<?php
require_once '../includes/auth.php';
require_once '../includes/auth_check.php';

// Verify authentication and role
if (!$auth->isLoggedIn() || !$auth->isAdmin()) {
    header('HTTP/1.1 403 Forbidden');
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit();
}

header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];
$settingsFile = __DIR__ . '/../settings.json';

// Default Settings
$defaultSettings = [
    'company_name' => 'PARAMCGWALABOTS',
    'company_email' => 'Paramcgwala@gmail.com',
    'company_phone' => '9617422068',
    'whatsapp_number' => '9617422068',
    'telegram_handle' => 'param275',
    'contact_form_webhook' => 'YOUR_N8N_CONTACT_FORM_WEBHOOK_URL_HERE',
    'chatbot_webhook' => 'https://cgwala.app.n8n.cloud/webhook/e48e3e76-31a9-4033-9d6f-ccec51586100/chat',
    'maintenance_mode' => false
];

try {
    switch ($method) {
        case 'GET':
            if (file_exists($settingsFile)) {
                $settings = json_decode(file_get_contents($settingsFile), true);
                if (!$settings) {
                    $settings = $defaultSettings;
                }
            } else {
                $settings = $defaultSettings;
                file_put_contents($settingsFile, json_encode($settings, JSON_PRETTY_PRINT));
            }
            echo json_encode(['success' => true, 'data' => $settings]);
            break;
            
        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                throw new Exception('Invalid JSON input');
            }
            
            // Read existing setting data
            $currentSettings = file_exists($settingsFile) ? json_decode(file_get_contents($settingsFile), true) : $defaultSettings;
            if (!$currentSettings) {
                $currentSettings = $defaultSettings;
            }
            
            // Update fields
            $updatedSettings = array_merge($currentSettings, $input);
            
            // Save settings
            file_put_contents($settingsFile, json_encode($updatedSettings, JSON_PRETTY_PRINT));
            
            // Log action in database
            $db = Database::getInstance()->getConnection();
            $stmt = $db->prepare("INSERT INTO admin_activity_logs (admin_id, action, details, ip_address) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $auth->getCurrentUser()['id'],
                'update_settings',
                'Updated global configurations settings.json',
                $_SERVER['REMOTE_ADDR'] ?? ''
            ]);
            
            echo json_encode(['success' => true, 'message' => 'Settings updated successfully']);
            break;
            
        default:
            header('HTTP/1.1 405 Method Not Allowed');
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            break;
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
