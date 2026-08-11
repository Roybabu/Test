<?php
/* ============================================================================
   SUBMISSION ENDPOINT
   ============================================================================

   Collects workshops that visitors add through the "+ Add workshop" button
   and stores them in ONE separate file:

       data/pending-submissions.json

   Nothing here ever touches data-agency.js or data-nonagency.js. Those stay
   under your control — you review submissions in admin.html and paste the
   approved ones in yourself.

   SETUP — two things before you upload:
     1. Change ADMIN_KEY below to something only you know.
     2. Make sure the data/ folder is writable by the web server
        (chmod 755 usually works; 775 or 777 on stricter hosts).

   If your host doesn't run PHP, delete this file — the page still works, and
   visitor additions just stay on their own device.
   ============================================================================ */

declare(strict_types=1);

// ---- CONFIG ---------------------------------------------------------------
const ADMIN_KEY   = 'CHANGE-ME-BEFORE-UPLOADING';
const STORE_DIR   = __DIR__ . '/data';
const STORE_FILE  = STORE_DIR . '/pending-submissions.json';
const MAX_PENDING = 5000;   // hard ceiling, stops the file growing forever
const MAX_PER_IP  = 25;     // submissions allowed per IP per hour
// ---------------------------------------------------------------------------

const EMIRATES = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'];

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function out(array $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function ensureStore(): void {
    if (!is_dir(STORE_DIR)) {
        @mkdir(STORE_DIR, 0755, true);
    }
    if (!file_exists(STORE_FILE)) {
        @file_put_contents(STORE_FILE, "[]");
    }
}

function readAll(): array {
    ensureStore();
    $raw = @file_get_contents(STORE_FILE);
    if ($raw === false || trim($raw) === '') return [];
    $rows = json_decode($raw, true);
    return is_array($rows) ? $rows : [];
}

function writeAll(array $rows): bool {
    ensureStore();
    $fp = @fopen(STORE_FILE, 'c+');
    if (!$fp) return false;
    $ok = false;
    if (flock($fp, LOCK_EX)) {
        ftruncate($fp, 0);
        rewind($fp);
        $ok = fwrite($fp, json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)) !== false;
        fflush($fp);
        flock($fp, LOCK_UN);
    }
    fclose($fp);
    return $ok;
}

function requireAdmin(string $key): void {
    if (ADMIN_KEY === 'CHANGE-ME-BEFORE-UPLOADING') {
        out(['ok' => false, 'error' => 'Set ADMIN_KEY in submit.php before using the admin page.'], 403);
    }
    if (!hash_equals(ADMIN_KEY, $key)) {
        out(['ok' => false, 'error' => 'Wrong admin key.'], 403);
    }
}

function clean(string $s, int $max): string {
    $stripped = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $s);
    $s = ($stripped === null) ? preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $s) : $stripped;
    $s = trim((string)$s);
    if (function_exists('mb_substr')) return mb_substr($s, 0, $max);
    return substr($s, 0, $max);
}

function cleanList($v, int $max, int $maxItems = 25): array {
    if (is_string($v)) $v = explode(',', $v);
    if (!is_array($v)) return [];
    $outArr = [];
    foreach ($v as $item) {
        if (!is_string($item)) continue;
        $item = clean($item, $max);
        if ($item !== '') $outArr[] = $item;
        if (count($outArr) >= $maxItems) break;
    }
    return array_values(array_unique($outArr));
}

function ipHash(): string {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    return substr(hash('sha256', $ip . '|' . ADMIN_KEY), 0, 16);
}

// ---- request parsing ------------------------------------------------------
$body = [];
$raw  = file_get_contents('php://input');
if ($raw !== false && $raw !== '') {
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) $body = $decoded;
}
$action = (string)($body['action'] ?? $_GET['action'] ?? '');
$key    = (string)($body['key']    ?? $_GET['key']    ?? '');

// ---- PUBLIC: submit a workshop -------------------------------------------
if ($action === 'submit') {
    $w = $body['workshop'] ?? null;
    if (!is_array($w)) out(['ok' => false, 'error' => 'No workshop data received.'], 400);

    $name = clean((string)($w['name'] ?? ''), 200);
    if ($name === '') out(['ok' => false, 'error' => 'Workshop name is required.'], 400);

    $type = ($w['type'] ?? '') === 'nonagency' ? 'nonagency' : 'agency';

    $emirate = clean((string)($w['emirate'] ?? ''), 60);
    if (!in_array($emirate, EMIRATES, true)) $emirate = '';

    $rows = readAll();

    // light abuse guard
    $mine = 0;
    $me   = ipHash();
    $cut  = time() - 3600;
    foreach ($rows as $r) {
        if (($r['by'] ?? '') === $me && (int)($r['ts'] ?? 0) > $cut) $mine++;
    }
    if ($mine >= MAX_PER_IP) out(['ok' => false, 'error' => 'Too many submissions from this connection. Try again later.'], 429);

    if (count($rows) >= MAX_PENDING) out(['ok' => false, 'error' => 'The submissions file is full. Contact the site owner.'], 507);

    $entry = [
        'id'       => 'sub-' . date('Ymd-His') . '-' . substr(bin2hex(random_bytes(4)), 0, 6),
        'status'   => 'pending',
        'kind'     => ($w['kind'] ?? '') === 'edit' ? 'edit' : 'new',
        'target'   => clean((string)($w['target'] ?? ''), 200),
        'ts'       => time(),
        'received' => date('c'),
        'by'       => $me,
        'workshop' => [
            'name'     => $name,
            'type'     => $type,
            'makes'    => cleanList($w['makes'] ?? [], 60),
            'emirate'  => $emirate,
            'address'  => clean((string)($w['address'] ?? ''), 300),
            'phone'    => clean((string)($w['phone'] ?? ''), 120),
            'hours'    => clean((string)($w['hours'] ?? ''), 200),
            'insurers' => $type === 'nonagency' ? cleanList($w['insurers'] ?? [], 150) : [],
            'notes'    => clean((string)($w['notes'] ?? ''), 2000),
        ],
    ];

    $rows[] = $entry;
    if (!writeAll($rows)) {
        out(['ok' => false, 'error' => 'Could not write to data/pending-submissions.json — check folder permissions.'], 500);
    }
    out(['ok' => true, 'id' => $entry['id'], 'pending' => count($rows)]);
}

// ---- ADMIN: list everything ----------------------------------------------
if ($action === 'list') {
    requireAdmin($key);
    $rows = readAll();
    foreach ($rows as &$r) { unset($r['by']); }   // don't expose the IP hash
    out(['ok' => true, 'rows' => array_reverse($rows)]);
}

// ---- ADMIN: change status (pending / merged / rejected) -------------------
if ($action === 'status') {
    requireAdmin($key);
    $id     = (string)($body['id'] ?? '');
    $status = (string)($body['status'] ?? '');
    if (!in_array($status, ['pending', 'merged', 'rejected'], true)) {
        out(['ok' => false, 'error' => 'Unknown status.'], 400);
    }
    $rows  = readAll();
    $found = false;
    foreach ($rows as &$r) {
        if (($r['id'] ?? '') === $id) { $r['status'] = $status; $found = true; break; }
    }
    unset($r);
    if (!$found) out(['ok' => false, 'error' => 'Submission not found.'], 404);
    if (!writeAll($rows)) out(['ok' => false, 'error' => 'Could not save.'], 500);
    out(['ok' => true]);
}

// ---- ADMIN: delete one, or clear everything already merged/rejected -------
if ($action === 'delete') {
    requireAdmin($key);
    $id   = (string)($body['id'] ?? '');
    $rows = readAll();
    $rows = array_values(array_filter($rows, function ($r) use ($id) { return ($r['id'] ?? '') !== $id; }));
    if (!writeAll($rows)) out(['ok' => false, 'error' => 'Could not save.'], 500);
    out(['ok' => true, 'remaining' => count($rows)]);
}

if ($action === 'clear-handled') {
    requireAdmin($key);
    $rows = readAll();
    $rows = array_values(array_filter($rows, function ($r) { return ($r['status'] ?? 'pending') === 'pending'; }));
    if (!writeAll($rows)) out(['ok' => false, 'error' => 'Could not save.'], 500);
    out(['ok' => true, 'remaining' => count($rows)]);
}

out(['ok' => false, 'error' => 'Unknown action.'], 400);
