import os
import secrets
import sqlite3
import hashlib
from datetime import date
from functools import wraps
from pathlib import Path
from urllib.parse import urlparse

import stripe
try:
    import psycopg
    from psycopg.rows import dict_row
except Exception:
    psycopg = None
    dict_row = None
from flask import (
    Flask,
    flash,
    g,
    has_request_context,
    jsonify,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
from werkzeug.security import check_password_hash, generate_password_hash


BASE_DIR = Path(__file__).resolve().parent


def resolve_database_url():
    candidates = [
        os.environ.get("DATABASE_URL", ""),
        os.environ.get("POSTGRES_URL_NON_POOLING", ""),
        os.environ.get("POSTGRES_URL", ""),
        os.environ.get("SUPABASE_DB_URL", ""),
        os.environ.get("SUPABASE_DATABASE_URL", ""),
    ]
    for value in candidates:
        cleaned = value.strip()
        if cleaned:
            return cleaned
    return ""


DATABASE_URL = resolve_database_url()
USE_POSTGRES = bool(DATABASE_URL)


def resolve_database_path():
    # Vercel serverless file system is read-only except /tmp.
    if os.environ.get("VERCEL"):
        return Path("/tmp") / "lerncoding.db"
    return BASE_DIR / "lerncoding.db"


DATABASE = resolve_database_path()


def is_ephemeral_database_runtime():
    return bool(os.environ.get("VERCEL") and not USE_POSTGRES)


def resolve_session_cookie_domain():
    raw = os.environ.get("SESSION_COOKIE_DOMAIN", "").strip()
    if raw:
        return raw

    parsed = urlparse(BASE_URL if "://" in BASE_URL else f"https://{BASE_URL}")
    host = (parsed.hostname or "").strip().lower()
    if not host or host == "localhost":
        return None
    if host.replace(".", "").isdigit():
        return None

    parts = host.split(".")
    if len(parts) < 2:
        return None

    base_domain = ".".join(parts[-2:])
    return f".{base_domain}"


class DatabaseConnection:
    def __init__(self, connection, use_postgres):
        self.connection = connection
        self.use_postgres = use_postgres

    def execute(self, query, params=()):
        if self.use_postgres:
            query = query.replace("?", "%s")
        return self.connection.execute(query, params)

    def commit(self):
        self.connection.commit()

    def rollback(self):
        self.connection.rollback()

    def close(self):
        self.connection.close()


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
ADMIN_LOGIN_EMAIL = os.environ.get("ADMIN_LOGIN_EMAIL", "lerncoding2026@gmail.com").strip().lower()
ADMIN_LOGIN_PASSWORD = os.environ.get("ADMIN_LOGIN_PASSWORD", "Atailayda05")

stripe.api_key = STRIPE_SECRET_KEY

PRODUCTS = {
    "webentwicklung": {
        "name": "Webentwicklung Kurs",
        "price": "19.99€",
        "list_price": "19.99€",
        "price_cents": 1999,
        "stripe_product_id": "prod_UGcZX7fpyVUC7P",
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
        "price": "24.99€",
        "list_price": "24.99€",
        "price_cents": 2499,
        "stripe_product_id": "prod_UGcbGyYQnoicno",
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
        "price": "39.99€",
        "list_price": "39.99€",
        "price_cents": 3999,
        "stripe_product_id": "prod_UGcdeI5tzoqZiE",
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

OPENING_PROMO_END_DATE = date(2026, 4, 10)
OPENING_PROMO_ACTIVE = date.today() <= OPENING_PROMO_END_DATE
OPENING_PROMO_LABEL = "Freitag, 10.04.2026"

if OPENING_PROMO_ACTIVE:
    PRODUCTS["webentwicklung"]["price"] = "12.99€"
    PRODUCTS["webentwicklung"]["price_cents"] = 1299

    PRODUCTS["python-basics"]["price"] = "14.99€"
    PRODUCTS["python-basics"]["price_cents"] = 1499

    PRODUCTS["projekte-paket"]["price"] = "24.99€"
    PRODUCTS["projekte-paket"]["price_cents"] = 2499


app = Flask(
    __name__,
    template_folder=str(BASE_DIR / "templates"),
    static_folder=str(BASE_DIR / "static"),
    static_url_path="/static",
)
app.secret_key = FLASK_SECRET_KEY


app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=bool(os.environ.get("VERCEL")),
    SESSION_COOKIE_DOMAIN=resolve_session_cookie_domain(),
)


def get_db():
    if "db" not in g:
        if USE_POSTGRES:
            if psycopg is None:
                raise RuntimeError("DATABASE_URL gesetzt, aber psycopg ist nicht installiert.")
            connection = psycopg.connect(DATABASE_URL, row_factory=dict_row)
            g.db = DatabaseConnection(connection, use_postgres=True)
        else:
            connection = sqlite3.connect(DATABASE)
            connection.row_factory = sqlite3.Row
            g.db = DatabaseConnection(connection, use_postgres=False)
    return g.db


def close_db(_error=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    if USE_POSTGRES:
        if psycopg is None:
            raise RuntimeError("DATABASE_URL gesetzt, aber psycopg ist nicht installiert.")

        db = psycopg.connect(DATABASE_URL, row_factory=dict_row)
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id BIGSERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
            """
        )
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS orders (
                id BIGSERIAL PRIMARY KEY,
                user_id BIGINT NOT NULL,
                order_number TEXT NOT NULL UNIQUE,
                stripe_session_id TEXT UNIQUE,
                academy_code TEXT,
                product_key TEXT NOT NULL,
                product_name TEXT NOT NULL,
                price TEXT NOT NULL,
                status TEXT NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
            """
        )
        db.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS academy_code TEXT")
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS stripe_events (
                id BIGSERIAL PRIMARY KEY,
                event_id TEXT NOT NULL UNIQUE,
                event_type TEXT NOT NULL,
                processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
            """
        )
        db.commit()
        db.close()
        return

    DATABASE.parent.mkdir(parents=True, exist_ok=True)
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
            academy_code TEXT,
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
    if "academy_code" not in columns:
        db.execute("ALTER TABLE orders ADD COLUMN academy_code TEXT")
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
            return redirect(url_for("register"))
        return view(*args, **kwargs)

    return wrapped_view


def admin_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if not session.get("admin_authenticated"):
            flash("Bitte als Admin einloggen.", "error")
            return redirect(url_for("admin_login"))
        return view(*args, **kwargs)

    return wrapped_view


def create_order_number():
    return f"LC-{secrets.token_hex(4).upper()}"


def create_academy_code():
    letters = "ABCDEFGHJKLMNPQRSTUVWXYZ"
    digits = "23456789"

    left = "".join(secrets.choice(letters) for _ in range(4))
    right = "".join(secrets.choice(digits) for _ in range(4))
    return f"{left}-{right}"


def generate_unique_academy_code(db):
    for _ in range(20):
        candidate = create_academy_code()
        existing = db.execute(
            "SELECT 1 FROM orders WHERE academy_code = ? LIMIT 1",
            (candidate,),
        ).fetchone()
        if existing is None:
            return candidate
    raise RuntimeError("Academy-Code konnte nicht erzeugt werden. Bitte erneut versuchen.")


def stable_academy_code(user_email, product_key):
    seed = f"{(user_email or '').strip().lower()}|{product_key}".encode("utf-8")
    key = FLASK_SECRET_KEY.encode("utf-8")
    digest = hashlib.blake2s(seed, key=key, digest_size=16).digest()

    letters = "ABCDEFGHJKLMNPQRSTUVWXYZ"
    digits = "23456789"
    left = "".join(letters[b % len(letters)] for b in digest[:4])
    right = "".join(digits[b % len(digits)] for b in digest[4:8])
    return f"{left}-{right}"


def find_existing_academy_code(db, user_id, product_key):
    row = db.execute(
        """
        SELECT academy_code
        FROM orders
        WHERE user_id = ? AND product_key = ? AND academy_code IS NOT NULL AND academy_code != ''
        ORDER BY created_at DESC, id DESC
        LIMIT 1
        """,
        (user_id, product_key),
    ).fetchone()
    if row is None:
        return None
    code = (row["academy_code"] or "").strip().upper()
    return code or None


def resolve_academy_code_for_user(db, user, product_key, preferred_code=None):
    preferred = (preferred_code or "").strip().upper()
    if preferred:
        return preferred

    existing = find_existing_academy_code(db, user["id"], product_key)
    if existing:
        return existing

    return stable_academy_code(user["email"], product_key)


def academy_access_for_product(product_key):
    if product_key == "webentwicklung":
        return "html"
    if product_key == "python-basics":
        return "python"
    return "both"


def is_stripe_ready():
    return bool(STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY)


def normalized_base_url():
    base = BASE_URL.strip().rstrip("/")
    for suffix in ("/shop.html", "/shop"):
        if base.endswith(suffix):
            base = base[: -len(suffix)]
            break
    return base


def shop_landing_url():
    if has_request_context():
        return f"{request.host_url.rstrip('/')}/shop/"
    return f"{normalized_base_url()}/shop/"


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

    academy_code = resolve_academy_code_for_user(
        db,
        user,
        product_key,
        stripe_field(metadata, "academy_code"),
    )

    db.execute(
        """
        INSERT INTO orders (user_id, order_number, stripe_session_id, academy_code, product_key, product_name, price, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            user["id"],
            create_order_number(),
            session_id,
            academy_code,
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
    db = get_db()
    rows = db.execute(
        """
        SELECT o.id, o.product_key, o.created_at, o.academy_code
        FROM orders o
        WHERE o.user_id = ?
          AND o.id = (
            SELECT o2.id
            FROM orders o2
            WHERE o2.user_id = o.user_id
              AND o2.product_key = o.product_key
            ORDER BY o2.created_at DESC, o2.id DESC
            LIMIT 1
          )
        ORDER BY o.created_at DESC, o.id DESC
        """,
        (user_id,),
    ).fetchall()

    unlocks = []
    account = fetch_user_by_id(user_id)
    for row in rows:
        product = PRODUCTS.get(row["product_key"])
        if product is None:
            continue

        academy_code = row["academy_code"]
        if not academy_code:
            if account is None:
                continue
            academy_code = stable_academy_code(account["email"], row["product_key"])
            db.execute(
                "UPDATE orders SET academy_code = ? WHERE id = ?",
                (academy_code, row["id"]),
            )
            db.commit()

        unlocks.append(
            {
                "product_key": row["product_key"],
                "created_at": row["created_at"],
                "name": product["name"],
                "subtitle": product["subtitle"],
                "shop_code": academy_code,
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


def fetch_admin_accounts_overview():
    rows = get_db().execute(
        """
        SELECT
            u.id AS user_id,
            u.name AS user_name,
            u.email AS user_email,
            u.created_at AS user_created_at,
            o.product_key,
            o.product_name,
            o.price,
            o.status,
            o.created_at AS order_created_at
        FROM users u
        LEFT JOIN orders o ON o.user_id = u.id
        ORDER BY u.created_at DESC, o.created_at DESC, o.id DESC
        """
    ).fetchall()

    accounts = []
    account_lookup = {}
    for row in rows:
        user_id = row["user_id"]
        entry = account_lookup.get(user_id)
        if entry is None:
            entry = {
                "id": user_id,
                "name": row["user_name"],
                "email": row["user_email"],
                "created_at": row["user_created_at"],
                "packages": [],
                "package_keys": set(),
            }
            account_lookup[user_id] = entry
            accounts.append(entry)

        product_key = row["product_key"]
        if not product_key or product_key in entry["package_keys"]:
            continue

        entry["packages"].append(
            {
                "product_key": product_key,
                "product_name": row["product_name"],
                "price": row["price"],
                "status": row["status"],
                "created_at": row["order_created_at"],
            }
        )
        entry["package_keys"].add(product_key)

    for account in accounts:
        account["package_keys"] = sorted(account["package_keys"])

    return accounts


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


def recover_user_from_session():
    # On serverless runtimes without a persistent database, instances can lose
    # local SQLite data. Only relink existing users; do not auto-create users
    # with random passwords because that can lock people out.
    if not os.environ.get("VERCEL") or USE_POSTGRES:
        return None

    email = (session.get("user_email") or "").strip().lower()
    name = (session.get("user_name") or "").strip()
    if not email or not name:
        return None

    existing = fetch_user_by_email(email)
    if existing is not None:
        session["user_id"] = existing["id"]
        return existing
    return None


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
    if g.user is None:
        g.user = recover_user_from_session()
    if g.user is None:
        session.clear()


@app.context_processor
def inject_globals():
    has_purchase = False
    if g.get("user") is not None:
        has_purchase = user_has_purchase(g.user["id"])

    return {
        "current_user": g.get("user"),
        "current_admin": bool(session.get("admin_authenticated")),
        "current_user_has_purchase": has_purchase,
        "ephemeral_db_runtime": is_ephemeral_database_runtime(),
        "products": PRODUCTS,
        "stripe_ready": is_stripe_ready(),
        "stripe_publishable_key": STRIPE_PUBLISHABLE_KEY,
        "opening_promo_active": OPENING_PROMO_ACTIVE,
        "opening_promo_end_label": OPENING_PROMO_LABEL,
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

        if "@" not in email:
            flash("Bitte gib eine gueltige E-Mail-Adresse ein.", "error")
        elif len(password) < 6:
            flash("Das Passwort muss mindestens 6 Zeichen lang sein.", "error")
        else:
            db = get_db()
            existing_user = db.execute(
                "SELECT id, name, email, password_hash FROM users WHERE email = ?",
                (email,),
            ).fetchone()

            # Existing account: treat this page as login.
            if existing_user is not None:
                if check_password_hash(existing_user["password_hash"], password):
                    session.clear()
                    session["user_id"] = existing_user["id"]
                    session["user_email"] = existing_user["email"]
                    session["user_name"] = existing_user["name"]
                    flash("Erfolgreich eingeloggt.", "success")
                    return redirect(url_for("dashboard"))

                # Optional recovery with matching name.
                if name and existing_user["name"].strip().lower() == name.strip().lower():
                    db.execute(
                        "UPDATE users SET password_hash = ? WHERE id = ?",
                        (generate_password_hash(password, method="pbkdf2:sha256"), existing_user["id"]),
                    )
                    db.commit()
                    session.clear()
                    session["user_id"] = existing_user["id"]
                    session["user_email"] = existing_user["email"]
                    session["user_name"] = existing_user["name"]
                    flash("Passwort aktualisiert und eingeloggt.", "success")
                    return redirect(url_for("dashboard"))

                flash("Login fehlgeschlagen. Bitte pruefe E-Mail und Passwort.", "error")
            else:
                if len(name) < 2:
                    flash("Bitte gib einen gueltigen Namen ein.", "error")
                    return render_template("register.html")

                session.clear()
                cursor = db.execute(
                    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
                    (name, email, generate_password_hash(password, method="pbkdf2:sha256")),
                )
                db.commit()

                created_user = fetch_user_by_email(email)
                session["user_id"] = (
                    created_user["id"] if created_user is not None else cursor.lastrowid
                )
                session["user_email"] = email
                session["user_name"] = name
                flash("Konto erstellt. Willkommen bei LernCoding.", "success")
                return redirect(url_for("dashboard"))

    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    return register()


@app.route("/admin/login", methods=["GET", "POST"])
def admin_login():
    if session.get("admin_authenticated"):
        return redirect(url_for("admin_dashboard"))

    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")

        if email == ADMIN_LOGIN_EMAIL and password == ADMIN_LOGIN_PASSWORD:
            session["admin_authenticated"] = True
            session["admin_email"] = ADMIN_LOGIN_EMAIL
            flash("Admin-Login erfolgreich.", "success")
            return redirect(url_for("admin_dashboard"))

        flash("Admin-Login fehlgeschlagen.", "error")

    return render_template("admin_login.html")


@app.route("/admin/logout", methods=["POST"])
@admin_required
def admin_logout():
    session.pop("admin_authenticated", None)
    session.pop("admin_email", None)
    flash("Admin ausgeloggt.", "info")
    return redirect(url_for("home"))


@app.route("/admin")
@admin_required
def admin_dashboard():
    return render_template(
        "admin_dashboard.html",
        accounts=fetch_admin_accounts_overview(),
        product_choices=PRODUCTS,
    )


@app.route("/admin/accounts/manage", methods=["POST"])
@admin_required
def admin_manage_accounts():
    action = request.form.get("action", "").strip()
    product_key = request.form.get("product_key", "").strip()

    try:
        user_id = int(request.form.get("user_id", "0"))
    except ValueError:
        user_id = 0

    if user_id <= 0:
        flash("Ungueltiger Account.", "error")
        return redirect(url_for("admin_dashboard"))

    user = fetch_user_by_id(user_id)
    if user is None:
        flash("Account wurde nicht gefunden.", "error")
        return redirect(url_for("admin_dashboard"))

    db = get_db()

    if action == "delete_account":
        db.execute("DELETE FROM orders WHERE user_id = ?", (user_id,))
        db.execute("DELETE FROM users WHERE id = ?", (user_id,))
        db.commit()
        flash(f"Account {user['email']} wurde geloescht.", "success")
        return redirect(url_for("admin_dashboard"))

    if action == "add_package":
        product = PRODUCTS.get(product_key)
        if product is None:
            flash("Unbekanntes Paket.", "error")
            return redirect(url_for("admin_dashboard"))

        if has_unlock(user_id, product_key):
            flash("Paket ist fuer diesen Account bereits aktiv.", "info")
            return redirect(url_for("admin_dashboard"))

        academy_code = resolve_academy_code_for_user(db, user, product_key)
        db.execute(
            """
            INSERT INTO orders (user_id, order_number, stripe_session_id, academy_code, product_key, product_name, price, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user_id,
                create_order_number(),
                None,
                academy_code,
                product_key,
                product["name"],
                "0.00€",
                "Vom Admin freigeschaltet",
            ),
        )
        db.commit()
        flash(f"Paket {product['name']} wurde kostenlos hinzugefuegt.", "success")
        return redirect(url_for("admin_dashboard"))

    if action == "remove_package":
        result = db.execute(
            "DELETE FROM orders WHERE user_id = ? AND product_key = ?",
            (user_id, product_key),
        )
        db.commit()
        removed = getattr(result, "rowcount", 0) or 0
        if removed > 0:
            flash("Paket wurde entfernt.", "success")
        else:
            flash("Dieses Paket war fuer den Account nicht aktiv.", "info")
        return redirect(url_for("admin_dashboard"))

    flash("Unbekannte Admin-Aktion.", "error")
    return redirect(url_for("admin_dashboard"))


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

    db = get_db()
    academy_code = resolve_academy_code_for_user(db, g.user, product_key)

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
            metadata={
                "product_key": product_key,
                "user_id": str(g.user["id"]),
                "academy_code": academy_code,
            },
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


@app.route("/api/academy-codes")
@login_required
def academy_codes_api():
    unlocks = fetch_unlocks(g.user["id"])
    codes = [
        {
            "code": unlock["shop_code"],
            "access": academy_access_for_product(unlock["product_key"]),
        }
        for unlock in unlocks
    ]
    return jsonify({"codes": codes})


@app.route("/api/academy-public-codes")
def academy_public_codes_api():
    rows = get_db().execute(
        """
        SELECT academy_code, product_key
        FROM orders
        WHERE academy_code IS NOT NULL
          AND academy_code != ''
        """
    ).fetchall()

    seen_codes = set()
    codes = []
    for row in rows:
        code = (row["academy_code"] or "").strip().upper()
        if not code or code in seen_codes:
            continue
        seen_codes.add(code)
        codes.append(
            {
                "code": code,
                "access": academy_access_for_product(row["product_key"]),
            }
        )

    return jsonify({"codes": codes})


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


@app.route("/admin/health")
@admin_required
def admin_health():
    db = get_db()
    try:
        result = db.execute("SELECT 1").fetchone()
        connection_ok = result is not None
    except Exception as exc:
        connection_ok = False
        error_msg = str(exc)
    else:
        error_msg = None

    status = {
        "runtime": {
            "vercel": bool(os.environ.get("VERCEL")),
            "database_type": "Postgres" if USE_POSTGRES else "SQLite",
            "ephemeral": is_ephemeral_database_runtime(),
        },
        "database_url_source": (
            "POSTGRES_URL_NON_POOLING" if os.environ.get("POSTGRES_URL_NON_POOLING")
            else "POSTGRES_URL" if os.environ.get("POSTGRES_URL")
            else "DATABASE_URL" if os.environ.get("DATABASE_URL")
            else "SUPABASE_DB_URL" if os.environ.get("SUPABASE_DB_URL")
            else "SQLite (local)"
        ),
        "connection_ok": connection_ok,
        "error": error_msg,
    }
    return jsonify(status), 200 if connection_ok else 500


init_db()


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", "8000")))