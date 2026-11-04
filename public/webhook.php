<?php
// Paystack webhook handler
// Verifies payment and logs it to a local JSON file
// For full Firestore write, use Firebase Admin SDK or a Cloud Function

header('Content-Type: application/json');

$secret = getenv('PAYSTACK_SECRET_KEY');
if (!$secret) {
    // Fallback: read from a local config file (create this after getting your key)
    $config = @file_get_contents(__DIR__ . '/paystack_config.json');
    if ($config) {
        $cfg    = json_decode($config, true);
        $secret = $cfg['secret_key'] ?? '';
    }
}

$input     = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_PAYSTACK_SIGNATURE'] ?? '';

// Verify signature
if ($secret && hash_hmac('sha512', $input, $secret) !== $signature) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid signature']);
    exit;
}

$event = json_decode($input, true);

if (!$event || $event['event'] !== 'charge.success') {
    http_response_code(200);
    echo json_encode(['status' => 'ignored']);
    exit;
}

$data = $event['data'];
$ref  = $data['reference'] ?? '';
$amt  = ($data['amount'] ?? 0) / 100;
$email = $data['customer']['email'] ?? '';
$name  = '';
$phone = '';

foreach (($data['metadata']['custom_fields'] ?? []) as $f) {
    if ($f['variable_name'] === 'customer_name') $name  = $f['value'];
    if ($f['variable_name'] === 'phone')          $phone = $f['value'];
}

// Log to file (you can review paid orders here)
$log = [
    'ref'    => $ref,
    'amount' => $amt,
    'email'  => $email,
    'name'   => $name,
    'phone'  => $phone,
    'time'   => date('Y-m-d H:i:s'),
    'status' => 'paid',
];

$logFile = __DIR__ . '/paid_orders.log';
file_put_contents($logFile, json_encode($log) . PHP_EOL, FILE_APPEND | LOCK_EX);

http_response_code(200);
echo json_encode(['status' => 'ok']);
