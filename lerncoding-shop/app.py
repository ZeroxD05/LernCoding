import os
import secrets
import sqlite3
from functools import wraps
from pathlib import Path

import stripe
from flask import (
    Flask,
    flash,
    g,
    jsonify,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
from werkzeug.security import check_password_hash, generate_password_hash


BASE_DIR = Path(__file__).resolve().parent
DATABASE = BASE_DIR / "lerncoding.db"


def load_env_file():
    env_paths = [BASE_DIR / ".env", BASE_DIR.parent / ".env"]

    for env_path in env_paths:
        if not env_path.exists():
            continue

        for raw_line in env_path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key, value)


load_env_file()

STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY", "")
STRIPE_PUBLISHABLE_KEY = os.environ.get("STRIPE_PUBLISHABLE_KEY", "")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
BASE_URL = os.environ.get("APP_BASE_URL", "https://lern-coding.de")
FLASK_SECRET_KEY = os.environ.get("FLASK_SECRET_KEY", "dev-secret-key-change-me")

stripe.api_key = STRIPE_SECRET_KEY

PRODUCTS = {
    "webentwicklung": {
        "name": "Webentwicklung Kurs",
        "price": "29.99€",
        "price_cents": 2999,
        "stripe_product_id": "prod_UGcZX7fpyVUC7P",
        "shop_code": "Webs-1203",
        "status": "Direkt verfuegbar",
        "subtitle": "HTML, CSS und JavaScript mit klaren Projekten.",
        "image": "images/webentwicklung.svg",
        "resource_label": "Projekt-Kits",
        "resource_items": [
            "Responsive Landingpage von null bis live",
            "Interaktive FAQ und Animationsbausteine",
            "Deployment-Checkliste fuer eigene Seiten",
        ],
    },
    "python-basics": {
        "name": "Python Basics",
        "price": "39.99€",
        "price_cents": 3999,
        "stripe_product_id": "prod_UGcbGyYQnoicno",
        "shop_code": "Pyth-0310",
        "status": "Direkt verfuegbar",
        "subtitle": "Python fuer echte Web- und Automatisierungsgrundlagen.",
        "image": "images/python-basics.svg",
        "resource_label": "Lernpfade",
        "resource_items": [
            "Python-Setup fuer lokale Projekte",
            "Flask-Grundlagen mit Formularen und Routen",
            "Mini-Automationen fuer Alltag und Portfolio",
        ],
    },
    "projekte-paket": {
        "name": "Projekte-Paket",
        "price": "49.99€",
        "price_cents": 4999,
        "stripe_product_id": "prod_UGcdeI5tzoqZiE",
        "shop_code": "bundl-3066",
        "status": "Direkt verfuegbar",
        "subtitle": "Mehrere vollstaendige Praxisprojekte fuer dein Portfolio.",
        "image": "images/projekte-paket.svg",
        "resource_label": "Portfolio-Blueprints",
        "resource_items": [
            "E-Commerce-App als Komplettstruktur",
            "Dashboard-Layouts mit Auth und Datenfluss",
            "Roadmap fuer Releases, Feedback und Launch",
        ],
    },
}


app = Flask(
    __name__,
    template_folder=str(BASE_DIR / "templates"),
    static_folder=str(BASE_DIR / "static"),
    static_url_path="/static",
)
app.secret_key = FLASK_SECRET_KEY


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
    return g.db


def close_db(_error=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    db = sqlite3.connect(DATABASE)
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            order_number TEXT NOT NULL UNIQUE,
            stripe_session_id TEXT UNIQUE,
            product_key TEXT NOT NULL,
            product_name TEXT NOT NULL,
            price TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        """
    )

    columns = [row[1] for row in db.execute("PRAGMA table_info(orders)").fetchall()]
    if "stripe_session_id" not in columns:
        db.execute("ALTER TABLE orders ADD COLUMN stripe_session_id TEXT")
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS stripe_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id TEXT NOT NULL UNIQUE,
            event_type TEXT NOT NULL,
            processed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    db.commit()
    db.close()


def login_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if g.user is None:
            flash("Bitte logge dich zuerst ein.", "error")
            return redirect(url_for("login"))
        return view(*args, **kwargs)

    return wrapped_view


def create_order_number():
    return f"LC-{secrets.token_hex(4).upper()}"


def is_stripe_ready():
    return bool(STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY)


def shop_landing_url():
    return f"{BASE_URL.rstrip('/')}/shop.html"


def stripe_field(obj, key, default=None):
    if obj is None:
        return default
    if isinstance(obj, dict):
        return obj.get(key, default)
    try:
        return obj[key]
    except Exception:
        return default


def fulfill_paid_checkout(checkout_session, user):
    metadata = stripe_field(checkout_session, "metadata", {}) or {}
    product_key = stripe_field(metadata, "product_key")
    product = PRODUCTS.get(product_key)
    if product is None:
        raise RuntimeError("Stripe Session enthaelt ein unbekanntes Produkt.")

    db = get_db()
    session_id = stripe_field(checkout_session, "id")
    if not session_id:
        raise RuntimeError("Stripe Session enthaelt keine ID.")

    existing = db.execute(
        "SELECT id FROM orders WHERE stripe_session_id = ?",
        (session_id,),
    ).fetchone()
    if existing is not None:
        return False

    db.execute(
        """
        INSERT INTO orders (user_id, order_number, stripe_session_id, product_key, product_name, price, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            user["id"],
            create_order_number(),
            session_id,
            product_key,
            product["name"],
            product["price"],
            "Bezahlt per Stripe",
        ),
    )
    db.commit()
    return True


def fetch_purchases(user_id):
    db = get_db()
    return db.execute(
        """
        SELECT
            orders.product_key,
            orders.product_name,
            orders.price,
            orders.created_at,
            orders.status
        FROM orders
        WHERE orders.user_id = ?
        ORDER BY orders.created_at DESC, orders.id DESC
        """,
        (user_id,),
    ).fetchall()


def fetch_unlocks(user_id):
    rows = get_db().execute(
        """
        SELECT product_key, MAX(created_at) AS created_at
        FROM orders
        WHERE user_id = ?
        GROUP BY product_key
        ORDER BY MAX(created_at) DESC
        """,
        (user_id,),
    ).fetchall()

    unlocks = []
    for row in rows:
        product = PRODUCTS.get(row["product_key"])
        if product is None:
            continue
        unlocks.append(
            {
                "product_key": row["product_key"],
                "created_at": row["created_at"],
                "name": product["name"],
                "subtitle": product["subtitle"],
                "shop_code": product["shop_code"],
                "image": product.get("image"),
            }
        )
    return unlocks


def has_unlock(user_id, product_key):
    row = get_db().execute(
        "SELECT 1 FROM orders WHERE user_id = ? AND product_key = ? LIMIT 1",
        (user_id, product_key),
    ).fetchone()
    return row is not None


def user_has_purchase(user_id):
    row = get_db().execute(
        "SELECT 1 FROM orders WHERE user_id = ? LIMIT 1",
        (user_id,),
    ).fetchone()
    return row is not None


def reconcile_user_paid_sessions(user, limit=100):
    if not is_stripe_ready():
        return 0

    try:
        sessions = stripe.checkout.Session.list(limit=limit)
    except Exception:
        return 0

    created_count = 0
    session_items = getattr(sessions, "data", sessions)
    for checkout_session in session_items:
        if stripe_field(checkout_session, "mode") != "payment":
            continue
        if stripe_field(checkout_session, "payment_status") != "paid":
            continue

        metadata = stripe_field(checkout_session, "metadata", {}) or {}
        customer_email = (stripe_field(checkout_session, "customer_email", "") or "").strip().lower()
        metadata_user_id = stripe_field(metadata, "user_id")
        matches_user = metadata_user_id == str(user["id"]) or customer_email == user["email"]
        if not matches_user:
            continue

        try:
            if fulfill_paid_checkout(checkout_session, user):
                created_count += 1
        except RuntimeError:
            # Skip sessions that cannot be fulfilled right now (e.g., SMTP outage).
            continue

    return created_count


def fetch_user_by_id(user_id):
    if not user_id:
        return None
    return get_db().execute(
        "SELECT id, name, email, created_at FROM users WHERE id = ?",
        (user_id,),
    ).fetchone()


def fetch_user_by_email(email):
    if not email:
        return None
    return get_db().execute(
        "SELECT id, name, email, created_at FROM users WHERE email = ?",
        (email.strip().lower(),),
    ).fetchone()


@app.before_request
def load_logged_in_user():
    user_id = session.get("user_id")
    if user_id is None:
        g.user = None
        return

    g.user = get_db().execute(
        "SELECT id, name, email, created_at FROM users WHERE id = ?",
        (user_id,),
    ).fetchone()


@app.context_processor
def inject_globals():
    has_purchase = False
    if g.get("user") is not None:
        has_purchase = user_has_purchase(g.user["id"])

    return {
        "current_user": g.get("user"),
        "current_user_has_purchase": has_purchase,
        "products": PRODUCTS,
        "stripe_ready": is_stripe_ready(),
        "stripe_publishable_key": STRIPE_PUBLISHABLE_KEY,
    }


@app.teardown_appcontext
def teardown_db(error):
    close_db(error)


@app.route("/")
def home():
    return render_template("index.html", products=PRODUCTS)


@app.route("/register", methods=["GET", "POST"])
def register():
    if g.user is not None:
        return redirect(url_for("dashboard"))

    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")

        if len(name) < 2:
            flash("Bitte gib einen gueltigen Namen ein.", "error")
        elif "@" not in email:
            flash("Bitte gib eine gueltige E-Mail-Adresse ein.", "error")
        elif len(password) < 6:
            flash("Das Passwort muss mindestens 6 Zeichen lang sein.", "error")
        else:
            db = get_db()
            try:
                cursor = db.execute(
                    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
                    (name, email, generate_password_hash(password, method="pbkdf2:sha256")),
                )
                db.commit()
            except sqlite3.IntegrityError:
                flash("Diese E-Mail ist bereits registriert.", "error")
            else:
                session.clear()
                session["user_id"] = cursor.lastrowid
                flash("Konto erstellt. Willkommen bei LernCoding.", "success")
                return redirect(url_for("dashboard"))

    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if g.user is not None:
        return redirect(url_for("dashboard"))

    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        user = get_db().execute(
            "SELECT id, name, email, password_hash FROM users WHERE email = ?",
            (email,),
        ).fetchone()

        if user is None or not check_password_hash(user["password_hash"], password):
            flash("Login fehlgeschlagen. Bitte pruefe E-Mail und Passwort.", "error")
        else:
            session.clear()
            session["user_id"] = user["id"]
            flash("Erfolgreich eingeloggt.", "success")
            return redirect(url_for("dashboard"))

    return render_template("login.html")


@app.route("/logout", methods=["POST"])
@login_required
def logout():
    session.clear()
    flash("Du wurdest ausgeloggt.", "info")
    return redirect(url_for("home"))


@app.route("/buy/<product_key>", methods=["POST"])
@login_required
def buy(product_key):
    product = PRODUCTS.get(product_key)
    if product is None:
        flash("Dieses Produkt wurde nicht gefunden.", "error")
        return redirect(url_for("home"))

    if not is_stripe_ready():
        flash("Stripe ist noch nicht konfiguriert. Bitte STRIPE_SECRET_KEY und STRIPE_PUBLISHABLE_KEY setzen.", "error")
        return redirect(url_for("home") + "#produkte")

    try:
        checkout_session = stripe.checkout.Session.create(
            mode="payment",
            customer_email=g.user["email"],
            payment_method_types=["card"],
            line_items=[
                {
                    "quantity": 1,
                    "price_data": {
                        "currency": "eur",
                        "unit_amount": product["price_cents"],
                        "product": product["stripe_product_id"],
                    },
                }
            ],
            metadata={"product_key": product_key, "user_id": str(g.user["id"])},
            success_url=f"{shop_landing_url()}/stripe/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=shop_landing_url(),
        )
    except Exception as exc:
        flash(f"Stripe Checkout konnte nicht gestartet werden: {exc}", "error")
        return redirect(url_for("home") + "#produkte")

    return redirect(checkout_session.url, code=303)


@app.route("/stripe/success")
def stripe_success():
    session_id = request.args.get("session_id", "")
    if not session_id:
        flash("Stripe Rueckleitung ohne Session-ID erhalten.", "error")
        return redirect(shop_landing_url())

    try:
        checkout_session = stripe.checkout.Session.retrieve(session_id)
    except Exception as exc:
        flash(f"Stripe Session konnte nicht geladen werden: {exc}", "error")
        return redirect(shop_landing_url())

    if stripe_field(checkout_session, "payment_status") != "paid":
        flash("Die Zahlung wurde noch nicht bestaetigt.", "error")
        return redirect(shop_landing_url())

    metadata = stripe_field(checkout_session, "metadata", {}) or {}
    user = fetch_user_by_id(stripe_field(metadata, "user_id"))
    if user is None:
        user = fetch_user_by_email(stripe_field(checkout_session, "customer_email"))
    if user is None and g.get("user") is not None:
        user = g.user

    if user is None:
        flash("Die Zahlung wurde erkannt, konnte aber keinem Konto zugeordnet werden.", "error")
        return redirect(shop_landing_url())

    try:
        created_now = fulfill_paid_checkout(checkout_session, user)
    except RuntimeError as exc:
        flash(str(exc), "error")
        return redirect(shop_landing_url())

    if created_now:
        flash("Zahlung erfolgreich. Der Zugang zu deinem gekauften Kurs ist jetzt aktiv.", "success")
    else:
        flash("Diese Stripe-Zahlung wurde bereits verarbeitet.", "info")
    return redirect(shop_landing_url())


@app.route("/stripe/cancel")
def stripe_cancel():
    flash("Stripe Checkout wurde abgebrochen. Es wurde nichts berechnet.", "info")
    return redirect(shop_landing_url())


@app.route("/stripe/webhook", methods=["POST"])
def stripe_webhook():
    if not STRIPE_WEBHOOK_SECRET:
        return jsonify({"error": "Webhook secret not configured"}), 500

    payload = request.get_data()
    signature = request.headers.get("Stripe-Signature", "")

    try:
        event = stripe.Webhook.construct_event(payload, signature, STRIPE_WEBHOOK_SECRET)
    except ValueError:
        return jsonify({"error": "Invalid payload"}), 400
    except stripe.error.SignatureVerificationError:
        return jsonify({"error": "Invalid signature"}), 400

    db = get_db()
    event_id = event.get("id")
    event_type = event.get("type", "unknown")

    already_processed = db.execute(
        "SELECT 1 FROM stripe_events WHERE event_id = ?",
        (event_id,),
    ).fetchone()
    if already_processed is not None:
        return jsonify({"status": "already_processed"}), 200

    if event_type == "checkout.session.completed":
        checkout_session = event["data"]["object"]
        metadata = stripe_field(checkout_session, "metadata", {}) or {}
        user = fetch_user_by_id(stripe_field(metadata, "user_id"))
        if user is None:
            user = fetch_user_by_email(stripe_field(checkout_session, "customer_email"))
        if user is None:
            return jsonify({"error": "No matching user for checkout session"}), 400

        try:
            fulfill_paid_checkout(checkout_session, user)
        except RuntimeError as exc:
            return jsonify({"error": str(exc)}), 500

    db.execute(
        "INSERT INTO stripe_events (event_id, event_type) VALUES (?, ?)",
        (event_id, event_type),
    )
    db.commit()
    return jsonify({"status": "ok"}), 200


@app.route("/dashboard")
@app.route("/konto")
@login_required
def dashboard():
    purchases = fetch_purchases(g.user["id"])

    # Safety net: if webhook/success redirect didn't persist yet, sync directly from Stripe.
    if not purchases:
        synced = reconcile_user_paid_sessions(g.user)
        if synced > 0:
            flash("Dein letzter Stripe-Kauf wurde jetzt synchronisiert.", "success")
            purchases = fetch_purchases(g.user["id"])

    return render_template(
        "dashboard.html",
        purchases=purchases,
        unlocks=fetch_unlocks(g.user["id"]),
    )


@app.route("/devcademy/")
@login_required
def devcademy_index():
    unlocks = fetch_unlocks(g.user["id"])
    if not unlocks:
        flash("Devcademy ist erst nach einem Kauf verfuegbar.", "info")
        return redirect(url_for("dashboard"))

    return render_template("devcademy/index.html", unlocks=unlocks)


@app.route("/devcademy/<product_key>")
@login_required
def devcademy_product(product_key):
    product = PRODUCTS.get(product_key)
    if product is None:
        flash("Dieser Devcademy-Bereich existiert nicht.", "error")
        return redirect(url_for("devcademy_index"))
    if not has_unlock(g.user["id"], product_key):
        flash("Dieser Bereich ist nur mit gekauftem Kurs verfuegbar.", "error")
        return redirect(url_for("devcademy_index"))
    return render_template("devcademy/product.html", product_key=product_key, product=product)


@app.route("/widerruf")
def widerruf():
    return render_template("widerruf.html")


@app.route("/delete-account", methods=["POST"])
@login_required
def delete_account():
    db = get_db()
    db.execute("DELETE FROM orders WHERE user_id = ?", (g.user["id"],))
    db.execute("DELETE FROM users WHERE id = ?", (g.user["id"],))
    db.commit()
    session.clear()
    flash("Dein Konto wurde geloescht.", "info")
    return redirect(url_for("home"))


init_db()


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", "8000")))