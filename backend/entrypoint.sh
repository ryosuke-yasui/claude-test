#!/bin/sh
set -e

python - <<'EOF'
from app.database import engine
from sqlalchemy import inspect, text

insp = inspect(engine)

if not insp.has_table("alembic_version") and insp.has_table("users"):
    print("Existing schema found without migration tracking. Stamping at 0001...")
    with engine.connect() as conn:
        conn.execute(text(
            "CREATE TABLE alembic_version "
            "(version_num VARCHAR(32) NOT NULL, "
            "CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num))"
        ))
        conn.execute(text("INSERT INTO alembic_version VALUES ('0001')"))
        conn.commit()
    print("Stamped at 0001.")
EOF

alembic upgrade head
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
