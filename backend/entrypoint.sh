#!/bin/sh
set -e

# If schema exists without migration tracking (pre-Alembic), stamp at 0001
# so only pending migrations (0002+) run. Uses targeted SQL instead of full inspect().
if python - <<'PYEOF'
import sys
from app.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    has_alembic = conn.execute(text(
        "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'alembic_version')"
    )).scalar()
    has_users = conn.execute(text(
        "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users')"
    )).scalar()

sys.exit(0 if (not has_alembic and has_users) else 1)
PYEOF
then
    echo "Existing schema found without migration tracking. Stamping at 0001..."
    alembic stamp 0001
fi

alembic upgrade head
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
