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

try {
    $db = Database::getInstance()->getConnection();
    
    switch ($method) {
        case 'GET':
            // Search / filter users
            $search = trim($_GET['search'] ?? '');
            $role = trim($_GET['role'] ?? '');
            $status = trim($_GET['status'] ?? '');
            
            $sql = "SELECT id, email, first_name, last_name, phone, role, is_verified, avatar, bio, status, created_at, last_login FROM users WHERE 1=1";
            $params = [];
            
            if ($search !== '') {
                $sql .= " AND (email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)";
                $params[] = "%$search%";
                $params[] = "%$search%";
                $params[] = "%$search%";
            }
            if ($role !== '') {
                $sql .= " AND role = ?";
                $params[] = $role;
            }
            if ($status !== '') {
                $sql .= " AND status = ?";
                $params[] = $status;
            }
            
            $sql .= " ORDER BY id DESC";
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $users = $stmt->fetchAll();
            
            echo json_encode(['success' => true, 'data' => $users]);
            break;
            
        case 'POST':
            // Create user
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                throw new Exception('Invalid JSON input');
            }
            
            $email = trim($input['email'] ?? '');
            $password = $input['password'] ?? '';
            $first_name = trim($input['first_name'] ?? '');
            $last_name = trim($input['last_name'] ?? '');
            $phone = trim($input['phone'] ?? '');
            $role = $input['role'] ?? 'free';
            $status = $input['status'] ?? 'active';
            
            if (empty($email) || empty($password) || empty($first_name) || empty($last_name)) {
                throw new Exception('All required fields must be filled');
            }
            
            // Hash password
            $hashed = password_hash($password, PASSWORD_DEFAULT);
            
            // Insert User
            $stmt = $db->prepare("INSERT INTO users (email, password, first_name, last_name, phone, role, status, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, 1)");
            $stmt->execute([$email, $hashed, $first_name, $last_name, $phone, $role, $status]);
            
            // Log Action
            $newId = $db->lastInsertId();
            logAdminActivity($auth->getCurrentUser()['id'], 'create_user', "Created user account ID: $newId ($email)");
            
            echo json_encode(['success' => true, 'message' => 'User created successfully', 'id' => $newId]);
            break;
            
        case 'PUT':
            // Update user details
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                throw new Exception('Invalid JSON input');
            }
            
            $id = intval($input['id'] ?? 0);
            if ($id <= 0) {
                throw new Exception('Invalid User ID');
            }
            
            $first_name = trim($input['first_name'] ?? '');
            $last_name = trim($input['last_name'] ?? '');
            $phone = trim($input['phone'] ?? '');
            $role = $input['role'] ?? 'free';
            $status = $input['status'] ?? 'active';
            $password = $input['password'] ?? '';
            
            if (empty($first_name) || empty($last_name)) {
                throw new Exception('First and Last name are required');
            }
            
            $sql = "UPDATE users SET first_name = ?, last_name = ?, phone = ?, role = ?, status = ?";
            $params = [$first_name, $last_name, $phone, $role, $status];
            
            if (!empty($password)) {
                $sql .= ", password = ?";
                $params[] = password_hash($password, PASSWORD_DEFAULT);
            }
            
            $sql .= " WHERE id = ?";
            $params[] = $id;
            
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            
            logAdminActivity($auth->getCurrentUser()['id'], 'update_user', "Updated user details for ID: $id");
            
            echo json_encode(['success' => true, 'message' => 'User updated successfully']);
            break;
            
        case 'DELETE':
            // Delete user account
            $input = json_decode(file_get_contents('php://input'), true);
            $id = intval($input['id'] ?? ($_GET['id'] ?? 0));
            
            if ($id <= 0) {
                throw new Exception('Invalid User ID');
            }
            
            // Prevent deleting self
            if ($id === intval($auth->getCurrentUser()['id'])) {
                throw new Exception('Cannot delete your own administrative account');
            }
            
            $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$id]);
            
            logAdminActivity($auth->getCurrentUser()['id'], 'delete_user', "Deleted user account ID: $id");
            
            echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
            break;
            
        default:
            header('HTTP/1.1 405 Method Not Allowed');
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            break;
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

// Logger helper
function logAdminActivity($adminId, $action, $details) {
    try {
        $db = Database::getInstance()->getConnection();
        // Create activity logs table if not exists (SQLite and MySQL compatible)
        $db->exec("CREATE TABLE IF NOT EXISTS admin_activity_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            admin_id INTEGER NOT NULL,
            action TEXT NOT NULL,
            details TEXT,
            ip_address TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )");
        
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
        $stmt = $db->prepare("INSERT INTO admin_activity_logs (admin_id, action, details, ip_address) VALUES (?, ?, ?, ?)");
        $stmt->execute([$adminId, $action, $details, $ip]);
    } catch(Exception $e) {
        // Silent catch
    }
}
?>
