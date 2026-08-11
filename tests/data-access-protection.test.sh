#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:18080}"

for file in \
  data/admin-audit-log.json \
  data/workshop-verification.json \
  data/pending-submissions.json
 do
  code="$(curl -sS -o /tmp/data-access-test-body -w '%{http_code}' "$BASE_URL/$file")"
  case "$code" in
    403|404) ;;
    *) echo "FAIL: $file returned HTTP $code"; exit 1 ;;
  esac
  if grep -qE '<html|\{|\[|admin|verification|submission' /tmp/data-access-test-body 2>/dev/null; then
    if [[ "$code" == "200" ]]; then
      echo "FAIL: $file exposed contents"; exit 1
    fi
  fi
done

echo "PASS: protected data files return 403/404"
