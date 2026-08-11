#!/bin/sh
set -eu
ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
PORT=$((18000 + ($$ % 1000)))
COOKIE=$(mktemp)
HEADERS=$(mktemp)
RESP=$(mktemp)
PID=""
cleanup(){ [ -n "$PID" ] && kill "$PID" 2>/dev/null || true; rm -f "$COOKIE" "$HEADERS" "$RESP"; }
trap cleanup EXIT INT TERM

(
  cd "$ROOT"
  GF_ADMIN_SECRET='test-secret-123' php -S "127.0.0.1:$PORT" >/dev/null 2>&1
) &
PID=$!
sleep 1

curl -fsS -D "$HEADERS" -o "$RESP" -c "$COOKIE" \
  -H 'Content-Type: application/json' -X POST \
  --data '{"action":"login","key":"test-secret-123"}' \
  "http://127.0.0.1:$PORT/submit.php"
grep -qi 'Set-Cookie: gf_admin_session=.*secure;.*HttpOnly;.*SameSite=Strict' "$HEADERS"
CSRF=$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["csrfToken"])' "$RESP")
test -n "$CSRF"

STATUS=$(curl -sS -o /dev/null -w '%{http_code}' \
  "http://127.0.0.1:$PORT/submit.php?action=approve&id=sub-20200101-000000-abcdef")
test "$STATUS" = 405

STATUS=$(curl -sS -o /dev/null -w '%{http_code}' -b "$COOKIE" \
  -H 'Content-Type: application/json' -X POST --data '{"action":"clear"}' \
  "http://127.0.0.1:$PORT/submit.php")
test "$STATUS" = 403

STATUS=$(curl -sS -o /dev/null -w '%{http_code}' -b "$COOKIE" \
  -H "X-CSRF-Token: $CSRF" -H 'Content-Type: application/json' -X POST \
  --data '{"action":"approve","id":"sub-20200101-000000-abcdef"}' \
  "http://127.0.0.1:$PORT/submit.php")
test "$STATUS" = 404

echo 'PASS admin session, Secure cookie, CSRF, and GET-destructive-operation checks'
