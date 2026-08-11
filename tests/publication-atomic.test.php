<?php
declare(strict_types=1);

$root = dirname(__DIR__);
$files = [
    $root . '/data/pending-submissions.json',
    $root . '/data/published-workshops.json',
    $root . '/data/state-transaction.json',
];
$backups = [];
foreach ($files as $file) {
    $backups[$file] = file_exists($file) ? file_get_contents($file) : null;
}

putenv('GF_TEST_LIBRARY_ONLY=1');
require $root . '/submit.php';

try {
    $pendingBefore = [['id' => 'sub-test', 'status' => 'approved']];
    $publishedBefore = [['id' => 'ws_existing', 'name' => 'Existing']];
    $pendingAfter = [['id' => 'sub-test', 'status' => 'published']];
    $publishedAfter = array_merge($publishedBefore, [['id' => 'ws_new', 'name' => 'New']]);

    file_put_contents($files[0], json_encode($pendingBefore));
    file_put_contents($files[1], json_encode($publishedBefore));
    @unlink($files[2]);

    putenv('GF_TEST_FAIL_AFTER_PUBLISHED_WRITE=1');
    $ok = publishAtomically($pendingBefore, $pendingAfter, $publishedBefore, $publishedAfter);
    putenv('GF_TEST_FAIL_AFTER_PUBLISHED_WRITE');

    if ($ok !== false) throw new RuntimeException('Simulated post-publish failure unexpectedly reported success.');
    $pendingNow = json_decode(file_get_contents($files[0]), true);
    $publishedNow = json_decode(file_get_contents($files[1]), true);
    if ($pendingNow !== $pendingBefore || $publishedNow !== $publishedBefore) {
        throw new RuntimeException('Rollback failed: JSON-backed state became inconsistent.');
    }
    if (file_exists($files[2])) throw new RuntimeException('Transaction journal was not cleaned up after rollback.');

    echo "PASS publication rollback after post-published-write failure\n";
} finally {
    foreach ($backups as $file => $contents) {
        if ($contents === null) @unlink($file);
        else file_put_contents($file, $contents);
    }
    putenv('GF_TEST_LIBRARY_ONLY');
    putenv('GF_TEST_FAIL_AFTER_PUBLISHED_WRITE');
}
