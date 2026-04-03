import importlib.util
import os
from pathlib import Path

from flask import Flask, abort, send_from_directory
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.serving import run_simple

BASE_DIR = Path(__file__).resolve().parent
SHOP_DIR = BASE_DIR / "lerncoding-shop"
ALLOWED_EXTENSIONS = {
    ".html",
    ".css",
    ".js",
    ".xml",
    ".txt",
    ".avif",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".svg",
    ".pdf",
    ".mp4",
    ".mov",
}


def load_shop_app():
    module_path = SHOP_DIR / "app.py"
    if not module_path.exists():
        raise RuntimeError("Shop app not found at lerncoding-shop/app.py")

    spec = importlib.util.spec_from_file_location("lerncoding_shop_app", module_path)
    if spec is None or spec.loader is None:
        raise RuntimeError("Could not load shop app module")

    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.app


main_app = Flask(__name__)
shop_app = load_shop_app()


@main_app.route("/")
def root_index():
    return send_from_directory(BASE_DIR, "index.html")


@main_app.route("/<path:filename>")
def root_static(filename):
    requested = (BASE_DIR / filename).resolve()

    if BASE_DIR not in requested.parents and requested != BASE_DIR:
        abort(404)
    if not requested.exists() or not requested.is_file():
        abort(404)
    if requested.suffix.lower() not in ALLOWED_EXTENSIONS:
        abort(404)

    return send_from_directory(BASE_DIR, filename)


application = DispatcherMiddleware(
    main_app,
    {
        "/shop": shop_app,
        "/shop.html": shop_app,
    },
)


if __name__ == "__main__":
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", "8000"))
    run_simple(hostname=host, port=port, application=application, use_debugger=True, use_reloader=True)
