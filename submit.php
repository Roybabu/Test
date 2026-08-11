<?php
/* ============================================================================
   SUBMISSION ENDPOINT
   ============================================================================ */

declare(strict_types=1);

// ---- CONFIG ---------------------------------------------------------------
const ADMIN_KEY   = 'CHANGE-ME-BEFORE-UPLOADING';
const STORE_DIR   = __DIR__ . '/data';
const STORE_FILE  = STORE_DIR . '/pending-submissions.json';
const VERIFICATION_FILE = STORE_DIR . '/workshop-verification.json';
const PUBLISHED_FILE = STORE_DIR . '/published-workshops.json';
const AUDIT_FILE = STORE_DIR . '/admin-audit-log.json';
const MAX_PENDING = 5000;
const MAX_PER_IP  = 25;
// ---------------------------------------------------------------------------

const EMIRATES = [
    'Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman',
    'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'
];

const WORKSHOP_TYPES = ['agency', 'nonagency'];
const SUBMISSION_KINDS = ['new', 'edit'];

const MAX_LENGTHS = [
    'name'    => 200,
    'target'  => 200,
    'address' => 300,
    'phone'   => 120,
    'hours'   => 200,
    'notes'   => 2000,
    'email'   => 254,
    'list'    => 60,
    'insurer' => 150,
];

const ALLOWED_MAKES = [
    'Audi', 'Bentley', 'Bestune', 'BMW', 'BMW Alpina', 'Bugatti', 'BYD',
    'Cadillac', 'Changan', 'Chevrolet', 'Chrysler', 'Dodge', 'Ferrari',
    'Ford', 'FUSO', 'GAC', 'Geely', 'Genesis', 'GMC', 'GWM', 'Honda',
    'Hyundai', 'Infiniti', 'Isuzu', 'JAC', 'Jaecoo', 'Jaguar', 'Jeep',
    'Kia', 'Land Rover', 'Lexus', 'Lincoln', 'Lynk & Co', 'Mahindra',
    'Maserati', 'Maybach', 'Mazda', 'Mercedes-Benz', 'MG', 'MINI',
    'Mitsubishi', 'Nissan', 'Omoda', 'Opel', 'Peugeot', 'Porsche', 'RAM',
    'Renault', 'Rolls-Royce', 'Subaru', 'Suzuki', 'Tesla', 'Toyota',
    'Volkswagen', 'Volvo'
];

/*
 * Keep this list in sync with data/data-insurers.js.
 * The server validates against this allow-list; the browser's insurer picker
 * is convenience only and is never treated as a security boundary.
 */
const ALLOWED_INSURERS = [
    "ADNIC (Abu Dhabi National Insurance Company)",
    "Abu Dhabi National Takaful Company",
    "Adamjee Insurance",
    "Al Ain Ahlia Insurance Company",
    "Al Buhaira National Insurance Company (ABNIC)",
    "Al Dhafra National Insurance Company",
    "Al Fujairah National Insurance Company (AFNIC)",
    "Al Ittihad Al Watani Insurance Company",
    "Al Khazna Insurance Company",
    "Al Sagr National Insurance Company",
    "Al Wathba National Insurance Company (AWNIC)",
    "Alliance Insurance Company",
    "Arabia Insurance Company",
    "Dar Al Takaful",
    "Damana",
    "Dubai Insurance Company (DIC)",
    "Dubai Islamic Insurance & Reinsurance Co. (AMAN)",
    "Dubai National Insurance & Reinsurance Company (DNIRC)",
    "Emirates Insurance Company (EIC)",
    "GIG Gulf (formerly AXA Gulf)",
    "Insurance House",
    "Iran Insurance Company",
    "LIVA Insurance",
    "National General Insurance Company (NGI)",
    "National Life & General Insurance Company",
    "New India Assurance (UAE branch)",
    "Noor Takaful",
    "Orient Insurance PJSC",
    "Orient Takaful",
    "Oriental Insurance Company (UAE branch)",
    "Qatar Insurance Company (QIC)",
    "RAK Insurance (RAK National Insurance Company)",
    "Salama (Islamic Arab Insurance Company)",
    "Sharjah Insurance Company",
    "Sukoon Insurance (formerly Oman Insurance Company)",
    "Sukoon Takaful (formerly Arabian Scandinavian Insurance Co. / ASCANA)",
    "Takaful Emarat",
    "Tokio Marine",
    "Union Insurance Company",
    "United Fidelity Insurance Company",
    "United Insurance Company",
    "Watania Takaful (National Takaful Company)",
    "Yas Takaful (formerly Hilal Takaful)"
];

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function out(array $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function validationError(string $message, string $field = ''): void {
    $response = ['ok' => false, 'error' => $message];
    if ($field !== '') $response['field'] = $field;
    out($response, 422);
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

function readVerification(): array {
    if (!file_exists(VERIFICATION_FILE)) return [];
    $raw = @file_get_contents(VERIFICATION_FILE);
    if ($raw === false || trim($raw) === '') return [];
    $rows = json_decode($raw, true);
    return is_array($rows) ? $rows : [];
}

function writeVerification(array $rows): bool {
    if (!is_dir(STORE_DIR)) @mkdir(STORE_DIR, 0755, true);
    $fp = @fopen(VERIFICATION_FILE, 'c+');
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

function writeAll(array $rows): bool {
    ensureStore();
    $fp = @fopen(STORE_FILE, 'c+');
    if (!$fp) return false;
    $ok = false;
    if (flock($fp, LOCK_EX)) {
        ftruncate($fp, 0);
        rewind($fp);
        $ok = fwrite($fp, json_encode(
            $rows,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        )) !== false;
        fflush($fp);
        flock($fp, LOCK_UN);
    }
    fclose($fp);
    return $ok;
}


function readPublished(): array {
    if (!file_exists(PUBLISHED_FILE)) return [];
    $raw = @file_get_contents(PUBLISHED_FILE);
    if ($raw === false || trim($raw) === '') return [];
    $rows = json_decode($raw, true);
    return is_array($rows) ? $rows : [];
}
function writePublished(array $rows): bool {
    if (!is_dir(STORE_DIR)) @mkdir(STORE_DIR, 0755, true);
    $fp=@fopen(PUBLISHED_FILE,'c+'); if(!$fp)return false; $ok=false;
    if(flock($fp,LOCK_EX)){ftruncate($fp,0);rewind($fp);$ok=fwrite($fp,json_encode($rows,JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES))!==false;fflush($fp);flock($fp,LOCK_UN);}
    fclose($fp); return $ok;
}
function readAudit(): array {
    if (!file_exists(AUDIT_FILE)) return [];
    $raw=@file_get_contents(AUDIT_FILE); if($raw===false||trim($raw)==='')return [];
    $rows=json_decode($raw,true); return is_array($rows)?$rows:[];
}
function writeAudit(array $rows): bool {
    if(!is_dir(STORE_DIR))@mkdir(STORE_DIR,0755,true);
    $rows=array_slice($rows,-10000);
    $fp=@fopen(AUDIT_FILE,'c+'); if(!$fp)return false; $ok=false;
    if(flock($fp,LOCK_EX)){ftruncate($fp,0);rewind($fp);$ok=fwrite($fp,json_encode($rows,JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES))!==false;fflush($fp);flock($fp,LOCK_UN);}
    fclose($fp); return $ok;
}
function auditMetadata(mixed $value): mixed {
    $blocked=['password','passwd','pass','admin_key','adminkey','authorization','cookie','token','secret','credential','credentials','api_key','apikey'];
    if(is_array($value)){ $out=[]; foreach($value as $k=>$v){$lk=strtolower((string)$k); foreach($blocked as $b){if($lk===$b||str_contains($lk,$b))continue 2;} $out[$k]=auditMetadata($v);} return $out; }
    if(is_object($value)) return auditMetadata((array)$value);
    if(is_string($value) && strlen($value)>500) return substr($value,0,500).'…';
    return $value;
}
function recordAudit(string $submissionId,string $actionType,string $previousStatus,string $newStatus,array $metadata=[]): void {
    $rows=readAudit();
    $rows[]=['administrator'=>'admin','submissionId'=>$submissionId,'actionType'=>$actionType,'timestamp'=>date('c'),'previousStatus'=>$previousStatus,'newStatus'=>$newStatus,'metadata'=>auditMetadata($metadata)];
    writeAudit($rows);
}

function requireAdmin(string $key): void {
    if (ADMIN_KEY === 'CHANGE-ME-BEFORE-UPLOADING') {
        out(['ok' => false, 'error' => 'Set ADMIN_KEY in submit.php before using the admin page.'], 403);
    }
    if (!hash_equals(ADMIN_KEY, $key)) {
        out(['ok' => false, 'error' => 'Wrong admin key.'], 403);
    }
}

/**
 * Validate and normalize a scalar string. Never silently truncates input.
 * Control characters are rejected rather than stripped.
 */
function validateString(mixed $value, string $field, int $max, bool $required, string $pattern): string {
    if ($value === null) {
        if ($required) validationError("$field is required.", $field);
        return '';
    }
    if (!is_string($value)) {
        validationError("$field must be a string.", $field);
    }

    $value = trim($value);
    if ($value === '') {
        if ($required) validationError("$field is required.", $field);
        return '';
    }

    if (function_exists('mb_strlen')) {
        $length = mb_strlen($value, 'UTF-8');
    } else {
        $length = strlen($value);
    }
    if ($length > $max) {
        validationError("$field exceeds the maximum length of $max characters.", $field);
    }

    if (preg_match('/[\x00-\x1F\x7F]/', $value)) {
        validationError("$field contains control characters.", $field);
    }

    if (!preg_match($pattern, $value)) {
        validationError("$field contains invalid characters.", $field);
    }

    return $value;
}

function validateList(
    mixed $value,
    string $field,
    int $itemMax,
    int $maxItems,
    bool $required,
    array $allowed = []
): array {
    if ($value === null) {
        if ($required) validationError("$field is required.", $field);
        return [];
    }
    if (!is_array($value)) {
        validationError("$field must be an array.", $field);
    }
    if (count($value) > $maxItems) {
        validationError("$field contains too many items.", $field);
    }

    $result = [];
    foreach ($value as $i => $item) {
        if (!is_string($item)) {
            validationError("$field item " . ($i + 1) . " must be a string.", $field);
        }

        $item = validateString(
            $item,
            "$field item " . ($i + 1),
            $itemMax,
            true,
            '/^[\p{L}\p{N}\p{M}][\p{L}\p{N}\p{M}\s&().,\-\/+\'’]*$/u'
        );

        if ($allowed && !in_array($item, $allowed, true)) {
            validationError("$field contains an unsupported value: $item.", $field);
        }
        $result[] = $item;
    }

    $result = array_values(array_unique($result));
    if ($required && count($result) === 0) {
        validationError("$field is required.", $field);
    }
    return $result;
}

/**
 * Accept common UAE phone formats and normalize every number to E.164-ish
 * UAE form (+971XXXXXXXXX). Multiple numbers may be separated by comma,
 * semicolon, slash, or "or".
 */
function normalizePhone(mixed $value, bool $required = false): string {
    if ($value === null || $value === '') {
        if ($required) validationError('Phone is required.', 'phone');
        return '';
    }
    if (!is_string($value)) validationError('Phone must be a string.', 'phone');

    $value = trim($value);
    if (strlen($value) > MAX_LENGTHS['phone']) {
        validationError('Phone exceeds the maximum length.', 'phone');
    }
    if (preg_match('/[\x00-\x1F\x7F]/', $value)) {
        validationError('Phone contains control characters.', 'phone');
    }
    if (!preg_match('/^[0-9+()\s.,;\/\-]+(?:\s+or\s+[0-9+()\s.,;\/\-]+)?$/i', $value)) {
        validationError('Phone contains invalid characters.', 'phone');
    }

    $parts = preg_split('/\s*(?:,|;|\/|\bor\b)\s*/i', $value, -1, PREG_SPLIT_NO_EMPTY);
    if (!$parts) validationError('Phone is invalid.', 'phone');

    $normalized = [];
    foreach ($parts as $part) {
        $digits = preg_replace('/\D+/', '', $part);
        if ($digits === null || $digits === '') {
            validationError('Phone contains an invalid number.', 'phone');
        }

        // UAE local landline: 04xxxxxxx; local mobile: 05xxxxxxxx.
        if (str_starts_with($digits, '00')) {
            $digits = substr($digits, 2);
        }
        if (str_starts_with($digits, '971')) {
            $local = substr($digits, 3);
        } elseif (str_starts_with($digits, '0')) {
            $local = $digits;
        } else {
            validationError('Phone must be a UAE number.', 'phone');
        }

        if (!preg_match('/^0(?:2|3|4|6|7|9)\d{7}$/', $local)
            && !preg_match('/^05\d{8}$/', $local)) {
            validationError('Phone must be a valid UAE landline or mobile number.', 'phone');
        }

        $normalized[] = '+971' . substr($local, 1);
    }

    return implode(', ', array_values(array_unique($normalized)));
}

function validateEmail(mixed $value, bool $required = false): string {
    if ($value === null || $value === '') {
        if ($required) validationError('Email is required.', 'email');
        return '';
    }
    if (!is_string($value)) validationError('Email must be a string.', 'email');
    $value = trim($value);

    if (strlen($value) > MAX_LENGTHS['email']) {
        validationError('Email exceeds the maximum length.', 'email');
    }
    if (preg_match('/[\x00-\x1F\x7F]/', $value) || filter_var($value, FILTER_VALIDATE_EMAIL) === false) {
        validationError('Email address is invalid.', 'email');
    }
    return $value;
}

function normalizeIdentityText(mixed $value): string {
    $value = is_string($value) ? $value : '';
    if (function_exists('normalizer_normalize')) {
        $value = normalizer_normalize($value, Normalizer::FORM_KC) ?: $value;
    }
    $value = mb_strtolower($value, 'UTF-8');
    $value = preg_replace('/\s+/u', ' ', trim($value)) ?? trim($value);
    $value = preg_replace('/[^\p{L}\p{N}\s]/u', '', $value) ?? $value;
    return preg_replace('/\s+/u', ' ', trim($value)) ?? trim($value);
}

function normalizeIdentityPhone(mixed $value): string {
    $value = is_string($value) ? $value : '';
    $value = preg_replace('/\D+/', '', $value) ?? '';
    $value = preg_replace('/^00/', '', $value) ?? $value;
    if (str_starts_with($value, '971')) return '971' . (substr($value, 3, 1) === '0' ? substr($value, 4) : substr($value, 3));
    if (str_starts_with($value, '0')) return '971' . substr($value, 1);
    return $value;
}

function identityKey(array $w): string {
    return implode('|', [
        normalizeIdentityText($w['name'] ?? ''),
        normalizeIdentityText($w['emirate'] ?? ''),
        normalizeIdentityPhone($w['phone'] ?? ''),
        normalizeIdentityText($w['address'] ?? '')
    ]);
}

function stableWorkshopId(array $w): string {
    $input = identityKey($w);
    $hash = 2166136261;
    $bytes = unpack('C*', $input) ?: [];
    foreach ($bytes as $byte) {
        $hash ^= $byte;
        $hash = ($hash * 16777619) & 0xFFFFFFFF;
    }
    return 'ws_' . str_pad(strtolower(dechex($hash)), 8, '0', STR_PAD_LEFT);
}

function exactWorkshopMatch(array $a, array $b): bool {
    if (!empty($a['id']) && !empty($b['id'])) return hash_equals((string)$a['id'], (string)$b['id']);
    return identityKey($a) === identityKey($b);
}

function uncertainWorkshopMatch(array $a, array $b): bool {
    if (normalizeIdentityText($a['name'] ?? '') !== normalizeIdentityText($b['name'] ?? '')) return false;
    if (normalizeIdentityText($a['emirate'] ?? '') !== normalizeIdentityText($b['emirate'] ?? '')) return false;
    return !exactWorkshopMatch($a, $b);
}

function ipHash(): string {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    return substr(hash('sha256', $ip . '|' . ADMIN_KEY), 0, 16);
}

// ---- request parsing ------------------------------------------------------
$raw = file_get_contents('php://input');
if ($raw === false || trim($raw) === '') {
    validationError('A JSON request body is required.');
}

$decoded = json_decode($raw, true);
if (!is_array($decoded) || json_last_error() !== JSON_ERROR_NONE) {
    validationError('Malformed JSON request body.');
}

$allowedTopLevelFields = ['action', 'key', 'workshop', 'id', 'status'];
$unknownTopLevel = array_diff(array_keys($decoded), $allowedTopLevelFields);
if ($unknownTopLevel) {
    validationError('Unknown request field: ' . (string)reset($unknownTopLevel) . '.');
}

$action = $decoded['action'] ?? $_GET['action'] ?? '';
$key    = $decoded['key'] ?? $_GET['key'] ?? '';

if (!is_string($action) || $action === '') {
    validationError('Action is required.', 'action');
}
if (!in_array($action, ['submit', 'published', 'list', 'status', 'delete', 'clear-handled', 'clear', 'approve', 'reject', 'publish', 'edit', 'audit-list', 'verification-list', 'verification'], true)) {
    validationError('Unknown action.', 'action');
}

// ---- PUBLIC: submit a workshop -------------------------------------------
if ($action === 'submit') {
    if (!array_key_exists('workshop', $decoded) || !is_array($decoded['workshop'])) {
        validationError('Workshop data is required.', 'workshop');
    }

    $w = $decoded['workshop'];

    $allowedWorkshopFields = [
        'id', 'name', 'type', 'emirate', 'phone', 'makes', 'insurers',
        'address', 'hours', 'notes', 'email', 'kind', 'target', 'duplicateReview'
    ];
    $unknown = array_diff(array_keys($w), $allowedWorkshopFields);
    if ($unknown) {
        validationError('Unknown workshop field: ' . (string)reset($unknown) . '.');
    }

    // Required fields.
    $name = validateString(
        $w['name'] ?? null, 'Workshop name', MAX_LENGTHS['name'], true,
        '/^[\p{L}\p{N}][\p{L}\p{N}\p{M}\s&().,\-\/+\'’]*$/u'
    );

    $type = validateString(
        $w['type'] ?? null, 'Workshop type', 20, true,
        '/^[a-z]+$/'
    );
    if (!in_array($type, WORKSHOP_TYPES, true)) {
        validationError('Workshop type must be agency or nonagency.', 'type');
    }

    $emirate = validateString(
        $w['emirate'] ?? null, 'Emirate', 30, true,
        '/^[\p{L}\s-]+$/u'
    );
    if (!in_array($emirate, EMIRATES, true)) {
        validationError('Invalid UAE emirate.', 'emirate');
    }

    $workshopId = validateString(
        $w['id'] ?? null, 'Workshop id', 20, false,
        '/^ws_[a-f0-9]{8}$/'
    );
    $duplicateReview = $w['duplicateReview'] ?? false;
    if (!is_bool($duplicateReview)) {
        validationError('duplicateReview must be a boolean.', 'duplicateReview');
    }

    // Optional fields.
    $address = validateString(
        $w['address'] ?? null, 'Address', MAX_LENGTHS['address'], false,
        '/^[\p{L}\p{N}\p{M}\s#&().,\-\/+:;\'’]*$/u'
    );
    $hours = validateString(
        $w['hours'] ?? null, 'Hours', MAX_LENGTHS['hours'], false,
        '/^[\p{L}\p{N}\p{M}\s#&().,\-\/+:;\'’]*$/u'
    );
    $notes = validateString(
        $w['notes'] ?? null, 'Notes', MAX_LENGTHS['notes'], false,
        '/^[\p{L}\p{N}\p{M}\s#&().,\-\/+:;!?%\'’]*$/u'
    );
    $phone = normalizePhone($w['phone'] ?? null, false);
    $email = validateEmail($w['email'] ?? null, false);

    $kind = validateString(
        $w['kind'] ?? 'new', 'Submission kind', 10, true,
        '/^[a-z]+$/'
    );
    if (!in_array($kind, SUBMISSION_KINDS, true)) {
        validationError('Submission kind must be new or edit.', 'kind');
    }

    $target = validateString(
        $w['target'] ?? '', 'Target', MAX_LENGTHS['target'], false,
        '/^[A-Za-z0-9][A-Za-z0-9._:-]*$/'
    );
    if ($kind === 'edit' && $target === '') {
        validationError('Target is required for an edit submission.', 'target');
    }

    // Car makes are required only for agency submissions.
    $makes = validateList(
        $w['makes'] ?? null,
        'Makes',
        MAX_LENGTHS['list'],
        25,
        $type === 'agency',
        ALLOWED_MAKES
    );

    // Insurer panels are required only for non-agency submissions.
    $insurers = validateList(
        $w['insurers'] ?? null,
        'Insurers',
        MAX_LENGTHS['insurer'],
        25,
        $type === 'nonagency',
        ALLOWED_INSURERS
    );

    $rows = readAll();

    // Light abuse guard.
    $mine = 0;
    $me   = ipHash();
    $cut  = time() - 3600;
    foreach ($rows as $r) {
        if (($r['by'] ?? '') === $me && (int)($r['ts'] ?? 0) > $cut) $mine++;
    }
    if ($mine >= MAX_PER_IP) {
        out(['ok' => false, 'error' => 'Too many submissions from this connection. Try again later.'], 429);
    }

    if (count($rows) >= MAX_PENDING) {
        out(['ok' => false, 'error' => 'The submissions file is full. Contact the site owner.'], 507);
    }

    $workshop = [
        'name'     => $name,
        'lastVerified' => '',
        'verificationStatus' => 'review',
        'source'   => 'User submission',
        'type'     => $type,
        'makes'    => $makes,
        'emirate'  => $emirate,
        'address'  => $address,
        'phone'    => $phone,
        'hours'    => $hours,
        'insurers' => $type === 'nonagency' ? $insurers : [],
        'notes'    => $notes,
    ];
    if ($email !== '') {
        $workshop['email'] = $email;
    }

    // The server is authoritative: derive the stable workshop id from the
    // normalized identity fields instead of trusting a browser-supplied id.
    $workshop['id'] = stableWorkshopId($workshop);
    $workshop['duplicateReview'] = false;

    foreach ($rows as $existing) {
        $existingWorkshop = is_array($existing['workshop'] ?? null) ? $existing['workshop'] : [];
        if (exactWorkshopMatch($existingWorkshop, $workshop)) {
            validationError('A submission for this normalized workshop already exists.', 'workshop');
        }
        if (uncertainWorkshopMatch($existingWorkshop, $workshop)) {
            $workshop['duplicateReview'] = true;
        }
    }

    $entry = [
        'id'       => 'sub-' . date('Ymd-His') . '-' . substr(bin2hex(random_bytes(4)), 0, 6),
        'status'   => 'pending',
        'kind'     => $kind,
        'target'   => $target,
        'ts'       => time(),
        'received' => date('c'),
        'by'       => $me,
        'workshop' => $workshop,
    ];

    $rows[] = $entry;
    if (!writeAll($rows)) {
        out(['ok' => false, 'error' => 'Could not write to data/pending-submissions.json — check folder permissions.'], 500);
    }
    out(['ok' => true, 'id' => $entry['id'], 'pending' => count($rows)]);
}

// ---- PUBLIC: published dataset -------------------------------------------
if ($action === 'published') {
    $rows = readPublished();
    out(['ok' => true, 'workshops' => $rows, 'count' => count($rows)]);
}

// ---- ADMIN: list everything ----------------------------------------------
if ($action === 'list') {
    if (!is_string($key)) validationError('Admin key must be a string.', 'key');
    requireAdmin($key);
    $rows = readAll();
    foreach ($rows as &$r) unset($r['by']);
    unset($r);
    out(['ok' => true, 'rows' => array_reverse($rows)]);
}


// ---- ADMIN: audit log ----------------------------------------------------
if ($action === 'audit-list') {
    if (!is_string($key)) validationError('Admin key must be a string.', 'key');
    requireAdmin($key);
    out(['ok' => true, 'rows' => array_reverse(readAudit())]);
}

// ---- ADMIN: list verification metadata ----------------------------------
if ($action === 'verification-list') {
    if (!is_string($key)) validationError('Admin key must be a string.', 'key');
    requireAdmin($key);
    out(['ok' => true, 'workshops' => readPublished(), 'verification' => readVerification()]);
}

// ---- ADMIN: update workshop verification --------------------------------
if ($action === 'verification') {
    if (!is_string($key)) validationError('Admin key must be a string.', 'key');
    requireAdmin($key);
    $id=$decoded['id']??''; $status=$decoded['status']??'';
    if(!is_string($id)||!preg_match('/^ws_[a-f0-9]{8}$/',$id))validationError('Invalid workshop ID.','id');
    if(!is_string($status)||!in_array($status,['verified','outdated','review'],true))validationError('Verification status must be verified, outdated, or review.','status');
    $pub=readPublished(); $found=false; $old='review'; $oldDate=''; $source='Existing directory data';
    foreach($pub as &$w){if(($w['id']??'')===$id){$found=true;$old=(string)($w['verificationStatus']??'review');$oldDate=(string)($w['lastVerified']??'');$source=(string)($w['source']??$source);$w['verificationStatus']=$status;if($status==='verified')$w['lastVerified']=date('Y-m-d');else $w['lastVerified']=$oldDate;break;}} unset($w);
    if(!$found)out(['ok'=>false,'error'=>'Published workshop not found.'],404);
    if(!writePublished($pub))out(['ok'=>false,'error'=>'Could not save published workshop.'],500);
    $registry=readVerification(); $registry[$id]=['lastVerified'=>$status==='verified'?date('Y-m-d'):$oldDate,'verificationStatus'=>$status,'source'=>$source]; writeVerification($registry);
    recordAudit($id,'edit',$old,$status,['operation'=>'verification','verificationStatus'=>$status]);
    out(['ok'=>true,'id'=>$id,'metadata'=>$registry[$id]]);
}

// ---- ADMIN: approve ------------------------------------------------------
if ($action === 'approve') {
    if (!is_string($key)) validationError('Admin key must be a string.', 'key'); requireAdmin($key);
    $id=$decoded['id']??''; if(!is_string($id)||!preg_match('/^sub-\d{8}-\d{6}-[a-f0-9]{6}$/',$id))validationError('Invalid submission ID.','id');
    $rows=readAll(); $found=false;
    $kind='new';
    foreach($rows as &$r){if(($r['id']??'')===$id){$found=true;$prev=(string)($r['status']??'pending');$kind=(string)($r['kind']??'new');if($prev!=='pending')validationError('Only pending submissions can be approved.','id');$r['status']='approved';break;}}unset($r);
    if(!$found)out(['ok'=>false,'error'=>'Submission not found.'],404); if(!writeAll($rows))out(['ok'=>false,'error'=>'Could not save.'],500);
    recordAudit($id,'approve',$prev,'approved',['kind'=>$kind]); out(['ok'=>true]);
}

// ---- ADMIN: reject -------------------------------------------------------
if ($action === 'reject') {
    if (!is_string($key)) validationError('Admin key must be a string.', 'key'); requireAdmin($key);
    $id=$decoded['id']??''; if(!is_string($id)||!preg_match('/^sub-\d{8}-\d{6}-[a-f0-9]{6}$/',$id))validationError('Invalid submission ID.','id');
    $rows=readAll(); $found=false;
    foreach($rows as &$r){if(($r['id']??'')===$id){$found=true;$prev=(string)($r['status']??'pending');$r['status']='rejected';break;}}unset($r);
    if(!$found)out(['ok'=>false,'error'=>'Submission not found.'],404); if(!writeAll($rows))out(['ok'=>false,'error'=>'Could not save.'],500);
    recordAudit($id,'reject',$prev,'rejected',[]); out(['ok'=>true]);
}

// ---- ADMIN: edit ---------------------------------------------------------
if ($action === 'edit') {
    if (!is_string($key)) validationError('Admin key must be a string.', 'key'); requireAdmin($key);
    $id=$decoded['id']??''; $incoming=$decoded['workshop']??null;
    if(!is_string($id)||!preg_match('/^sub-\d{8}-\d{6}-[a-f0-9]{6}$/',$id))validationError('Invalid submission ID.','id');
    if(!is_array($incoming))validationError('Workshop data is required.','workshop');
    $rows=readAll(); $idx=null; foreach($rows as $i=>$r)if(($r['id']??'')===$id){$idx=$i;break;}
    if($idx===null)out(['ok'=>false,'error'=>'Submission not found.'],404);
    $old=$rows[$idx]; $base=$old['workshop']??[]; $merged=array_merge($base,$incoming); $decoded['workshop']=$merged;
    // Reuse the same field validation contract used for public submissions.
    $name=validateString($merged['name']??null,'Workshop name',MAX_LENGTHS['name'],true,'/^[\p{L}\p{N}][\p{L}\p{N}\p{M}\s&().,\-\/+\'’]*$/u');
    $type=validateString($merged['type']??null,'Workshop type',20,true,'/^[a-z]+$/'); if(!in_array($type,WORKSHOP_TYPES,true))validationError('Invalid workshop type.','type');
    $emirate=validateString($merged['emirate']??null,'Emirate',30,true,'/^[\p{L}\s-]+$/u'); if(!in_array($emirate,EMIRATES,true))validationError('Invalid UAE emirate.','emirate');
    $address=validateString($merged['address']??null,'Address',MAX_LENGTHS['address'],false,'/^[\p{L}\p{N}\p{M}\s#&().,\-\/+:;\'’]*$/u');
    $phone=normalizePhone($merged['phone']??null,false); $hours=validateString($merged['hours']??null,'Hours',MAX_LENGTHS['hours'],false,'/^[\p{L}\p{N}\p{M}\s#&().,\-\/+:;\'’]*$/u'); $notes=validateString($merged['notes']??null,'Notes',MAX_LENGTHS['notes'],false,'/^[\p{L}\p{N}\p{M}\s#&().,\-\/+:;!?%\'’]*$/u'); $email=validateEmail($merged['email']??null,false);
    $makes=validateList($merged['makes']??null,'Makes',MAX_LENGTHS['list'],25,$type==='agency',ALLOWED_MAKES); $insurers=validateList($merged['insurers']??null,'Insurers',MAX_LENGTHS['insurer'],25,$type==='nonagency',ALLOWED_INSURERS);
    $updated=['id'=>stableWorkshopId(['id'=>$base['id']??null,'name'=>$name,'emirate'=>$emirate,'phone'=>$phone,'address'=>$address]),'name'=>$name,'type'=>$type,'makes'=>$makes,'insurers'=>$type==='nonagency'?$insurers:[],'emirate'=>$emirate,'address'=>$address,'phone'=>$phone,'hours'=>$hours,'notes'=>$notes,'lastVerified'=>(string)($base['lastVerified']??''),'verificationStatus'=>(string)($base['verificationStatus']??'review'),'source'=>(string)($base['source']??'User submission'),'duplicateReview'=>false]; if($email!=='')$updated['email']=$email;
    $rows[$idx]['workshop']=$updated; if(!writeAll($rows))out(['ok'=>false,'error'=>'Could not save.'],500);
    $changed=[]; foreach(['name','type','emirate','address','phone','hours','notes','makes','insurers','email'] as $f){if(($base[$f]??null)!==($updated[$f]??null))$changed[]=$f;}
    recordAudit($id,'edit',(string)($old['status']??'pending'),(string)($old['status']??'pending'),['changedFields'=>$changed]); out(['ok'=>true,'workshop'=>$updated]);
}

// ---- ADMIN: publish ------------------------------------------------------
if ($action === 'publish') {
    if (!is_string($key)) validationError('Admin key must be a string.', 'key'); requireAdmin($key);
    $id=$decoded['id']??''; if(!is_string($id)||!preg_match('/^sub-\d{8}-\d{6}-[a-f0-9]{6}$/',$id))validationError('Invalid submission ID.','id');
    $rows=readAll(); $idx=null; foreach($rows as $i=>$r)if(($r['id']??'')===$id){$idx=$i;break;}
    if($idx===null)out(['ok'=>false,'error'=>'Submission not found.'],404);
    $r=$rows[$idx]; if(($r['status']??'')!=='approved')validationError('Submission must be manually approved before publication.','id');
    $w=$r['workshop']??[]; if(!is_array($w))validationError('Submission workshop data is invalid.','workshop');
    $pub=readPublished(); foreach($pub as $existing){if(exactWorkshopMatch($existing,$w))validationError('An exact normalized workshop already exists in the published dataset.','workshop'); if(uncertainWorkshopMatch($existing,$w))validationError('This workshop resembles a published record and requires additional review before publication.','workshop');}
    $w['id']=stableWorkshopId($w); $w['publishedAt']=date('c'); $w['source']=$w['source']??'Approved submission'; $w['verificationStatus']=$w['verificationStatus']??'review'; $pub[]=$w;
    if(!writePublished($pub))out(['ok'=>false,'error'=>'Could not write published dataset.'],500);
    $rows[$idx]['status']='published'; $rows[$idx]['publishedAt']=date('c'); if(!writeAll($rows))out(['ok'=>false,'error'=>'Published record was written but submission state could not be updated.'],500);
    recordAudit($id,'publish','approved','published',['workshopId'=>$w['id']]); out(['ok'=>true,'workshop'=>$w]);
}

// ---- ADMIN: delete one ---------------------------------------------------
if ($action === 'delete') {
    if (!is_string($key)) validationError('Admin key must be a string.', 'key'); requireAdmin($key);
    $id=$decoded['id']??''; if(!is_string($id)||!preg_match('/^sub-\d{8}-\d{6}-[a-f0-9]{6}$/',$id))validationError('Invalid submission ID.','id');
    $rows=readAll();$found=null;$new=[];foreach($rows as $r){if(($r['id']??'')===$id)$found=$r;else$new[]=$r;}if($found===null)out(['ok'=>false,'error'=>'Submission not found.'],404);if(!writeAll($new))out(['ok'=>false,'error'=>'Could not save.'],500);
    recordAudit($id,'delete',(string)($found['status']??'unknown'),'deleted',[]);out(['ok'=>true,'remaining'=>count($new)]);
}

// ---- ADMIN: clear --------------------------------------------------------
if ($action === 'clear' || $action === 'clear-handled') {
    if (!is_string($key)) validationError('Admin key must be a string.', 'key'); requireAdmin($key);
    $rows=readAll();$kept=[];$removed=[];foreach($rows as $r){if(in_array(($r['status']??''),['rejected','published'],true))$removed[]=$r;else$kept[]=$r;}if(!writeAll($kept))out(['ok'=>false,'error'=>'Could not save.'],500);
    recordAudit('','clear','mixed','cleared',['removedCount'=>count($removed),'removedSubmissionIds'=>array_values(array_map(fn($r)=>(string)($r['id']??''),$removed))]);out(['ok'=>true,'removed'=>count($removed),'remaining'=>count($kept)]);
}

validationError('Unknown action.', 'action');
