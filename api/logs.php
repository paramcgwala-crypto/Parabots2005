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

try {
    $db = Database::getInstance()->getConnection();
    
    // Ensure table exists
    $db->exec("CREATE TABLE IF NOT EXISTS admin_activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        details TEXT,
        ip_address TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )");
    
    // Fetch logs joining the users table to show admin email
    $sql = "SELECT l.id, l.action, l.details, l.ip_address, l.created_at, u.email as admin_email 
            FROM admin_activity_logs l 
            LEFT JOIN users u ON l.admin_id = u.id 
            ORDER BY l.id DESC LIMIT 100";
            
    $stmt = $db->query($sql);
    $logs = $stmt->fetchAll();
    
    echo json_encode(['success' => true, 'data' => $logs]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
