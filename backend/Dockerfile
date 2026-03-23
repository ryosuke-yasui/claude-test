FROM python:3.12-slim

WORKDIR /app

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

COPY pyproject.toml .
RUN uv sync --no-dev

COPY alembic.ini .
COPY alembic/ alembic/
COPY app/ app/
COPY entrypoint.sh .

ENV PATH="/app/.venv/bin:$PATH"

RUN chmod +x entrypoint.sh

CMD ["./entrypoint.sh"]
