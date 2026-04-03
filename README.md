# LernCoding (Website + Flask-Shop)

Dieses Repository enthaelt jetzt beides unter einer Domain:

- Hauptseite: `/` (statische Website aus dem Projektstamm)
- Shop: `/shop` (Flask-App aus `lerncoding-shop/`)

## Struktur

- `app.py`: zentraler Flask/WSGI-Einstieg (mountet Shop unter `/shop`)
- `lerncoding-shop/`: bestehende Shop-App (Templates, Static, DB-Logik)
- `requirements.txt`: Python-Abhaengigkeiten fuer den Gesamtbetrieb

## Lokal starten

```bash
pip install -r requirements.txt
python app.py
```

Dann erreichbar unter:

- `http://localhost:8000/`
- `http://localhost:8000/shop`

## Environment

Lege im Projektstamm eine `.env` an (oder nutze deine Hosting-Secrets):

- `FLASK_SECRET_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `APP_BASE_URL` (z. B. `https://lern-coding.de`)
- optional: `PORT`

Hinweis: Die Shop-App kann weiterhin auch ihre lokale `lerncoding-shop/.env` lesen.

## GitHub Push

1. Achte darauf, dass keine Secrets in Dateien liegen (`.env` wird ignoriert).
2. Committe alle Aenderungen im Root-Repository.
3. Push auf dein GitHub-Repo.

Beispiel:

```bash
git add .
git commit -m "Integrate Flask shop under /shop and prepare unified deployment"
git push
```
