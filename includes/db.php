<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'paramcgwala_bots');

// Create database connection
class Database {
    private static $instance = null;
    private $conn;

    private function __construct() {
        try {
            // First, try MySQL connection
            $this->conn = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
        } catch(PDOException $e) {
            // Fallback to SQLite inside the database directory
            try {
                $dbDir = __DIR__ . '/../database';
                if (!is_dir($dbDir)) {
                    mkdir($dbDir, 0755, true);
                }
                $sqlitePath = $dbDir . '/paramcgwala_bots.sqlite';
                $isNew = !file_exists($sqlitePath);
                
                $this->conn = new PDO("sqlite:" . $sqlitePath);
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
                
                if ($isNew) {
                    $this->initializeSQLiteSchema();
                }
            } catch(PDOException $sqle) {
                die("Database connection failed: " . $e->getMessage() . " | SQLite Fallback also failed: " . $sqle->getMessage());
            }
        }
    }

    private function initializeSQLiteSchema() {
        // Run SQL schema translated for SQLite compatibility
        $sql = "
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            phone TEXT,
            role TEXT DEFAULT 'free',
            is_verified INTEGER DEFAULT 0,
            verification_token TEXT,
            reset_token TEXT,
            reset_token_expires TEXT,
            remember_token TEXT,
            avatar TEXT,
            bio TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            last_login TEXT,
            status TEXT DEFAULT 'active'
        );
        CREATE TABLE IF NOT EXISTS user_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            session_token TEXT NOT NULL,
            ip_address TEXT,
            user_agent TEXT,
            expires_at TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS user_courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            course_id TEXT NOT NULL,
            course_title TEXT,
            enrolled_at TEXT DEFAULT CURRENT_TIMESTAMP,
            progress INTEGER DEFAULT 0,
            status TEXT DEFAULT 'active',
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE (user_id, course_id)
        );
        CREATE TABLE IF NOT EXISTS user_downloads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            resource_id TEXT NOT NULL,
            resource_title TEXT,
            resource_type TEXT,
            download_url TEXT,
            downloaded_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS email_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            email_type TEXT NOT NULL,
            sent_at TEXT DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'sent',
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        -- Default admin user (password: admin123)
        INSERT INTO users (email, password, first_name, last_name, role, is_verified, status) 
        VALUES ('admin@paramcgwala.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'admin', 1, 'active');
        ";
        $this->conn->exec($sql);
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->conn;
    }

    // Prevent cloning
    private function __clone() {}

    // Prevent unserialization
    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }
}

// Get database instance
$db = Database::getInstance()->getConnection();
?>
