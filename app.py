from datetime import datetime, timezone
import json
from pathlib import Path

from flask import Flask, jsonify, render_template, request

BASE_DIR = Path(__file__).resolve().parent
MESSAGES_FILE = BASE_DIR / "messages.json"
app = Flask(__name__)


@app.get("/")
def home():
    return render_template("index.html")


@app.post("/contact")
def contact():
    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    message = str(data.get("message", "")).strip()

    if not name or not email or not message:
        return jsonify({"error": "Please fill in every field."}), 400

    submission = {
        "name": name,
        "email": email,
        "message": message,
        "received_at": datetime.now(timezone.utc).isoformat(),
    }

    messages = []
    if MESSAGES_FILE.exists():
        try:
            saved_messages = json.loads(MESSAGES_FILE.read_text(encoding="utf-8"))
            if isinstance(saved_messages, list):
                messages = saved_messages
        except json.JSONDecodeError:
            messages = []
    messages.append(submission)
    MESSAGES_FILE.write_text(
        json.dumps(messages, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    return jsonify({"message": f"Thanks, {name}! Your message has been received."}), 201


if __name__ == "__main__":
    app.run(debug=True)
