<?php
session_start();
require_once 'db.php';

class Auth {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    // Register new user
    public function register($email, $password, $first_name, $last_name, $phone = '') {
        try {
            // Check if email already exists
            $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->rowCount() > 0) {
                return ['success' => false, 'message' => 'Email already registered'];
            }

            // Hash password
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);

            // Generate verification token
            $verification_token = bin2hex(random_bytes(32));

            // Insert user
            $stmt = $this->db->prepare("INSERT INTO users (email, password, first_name, last_name, phone, verification_token) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$email, $hashed_password, $first_name, $last_name, $phone, $verification_token]);

            $user_id = $this->db->lastInsertId();

            // Send verification email
            $this->sendVerificationEmail($email, $first_name, $verification_token);

            return ['success' => true, 'message' => 'Registration successful. Please check your email to verify your account.', 'user_id' => $user_id];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Registration failed: ' . $e->getMessage()];
        }
    }

    // Login user
    public function login($email, $password, $remember = false) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ? AND status = 'active'");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if (!$user) {
                return ['success' => false, 'message' => 'Invalid credentials'];
            }

            // Verify password
            if (!password_verify($password, $user['password'])) {
                return ['success' => false, 'message' => 'Invalid credentials'];
            }

            // Update last login
            $stmt = $this->db->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
            $stmt->execute([$user['id']]);

            // Set session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_name'] = $user['first_name'] . ' ' . $user['last_name'];
            $_SESSION['user_role'] = $user['role'];
            $_SESSION['is_verified'] = $user['is_verified'];

            // Handle remember me
            if ($remember) {
                $this->setRememberMe($user['id']);
            }

            // Create session record
            $this->createSessionRecord($user['id']);

            return ['success' => true, 'message' => 'Login successful', 'user' => $this->getUserData($user['id'])];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Login failed: ' . $e->getMessage()];
        }
    }

    // Logout user
    public function logout() {
        try {
            // Delete session record
            if (isset($_SESSION['user_id'])) {
                $stmt = $this->db->prepare("DELETE FROM user_sessions WHERE user_id = ?");
                $stmt->execute([$_SESSION['user_id']]);
            }

            // Clear remember me cookie
            if (isset($_COOKIE['remember_token'])) {
                $stmt = $this->db->prepare("UPDATE users SET remember_token = NULL WHERE remember_token = ?");
                $stmt->execute([$_COOKIE['remember_token']]);
                setcookie('remember_token', '', time() - 3600, '/');
            }

            // Destroy session
            session_unset();
            session_destroy();

            return ['success' => true, 'message' => 'Logout successful'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Logout failed: ' . $e->getMessage()];
        }
    }

    // Request password reset
    public function forgotPassword($email) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ? AND status = 'active'");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if (!$user) {
                return ['success' => false, 'message' => 'Email not found'];
            }

            // Generate reset token
            $reset_token = bin2hex(random_bytes(32));
            $reset_token_expires = date('Y-m-d H:i:s', strtotime('+1 hour'));

            // Update user with reset token
            $stmt = $this->db->prepare("UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?");
            $stmt->execute([$reset_token, $reset_token_expires, $user['id']]);

            // Send password reset email
            $this->sendPasswordResetEmail($email, $user['first_name'], $reset_token);

            return ['success' => true, 'message' => 'Password reset link sent to your email'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Password reset failed: ' . $e->getMessage()];
        }
    }

    // Reset password
    public function resetPassword($token, $new_password) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()");
            $stmt->execute([$token]);
            $user = $stmt->fetch();

            if (!$user) {
                return ['success' => false, 'message' => 'Invalid or expired reset token'];
            }

            // Hash new password
            $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

            // Update password and clear reset token
            $stmt = $this->db->prepare("UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?");
            $stmt->execute([$hashed_password, $user['id']]);

            return ['success' => true, 'message' => 'Password reset successful'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Password reset failed: ' . $e->getMessage()];
        }
    }

    // Verify email
    public function verifyEmail($token) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM users WHERE verification_token = ?");
            $stmt->execute([$token]);
            $user = $stmt->fetch();

            if (!$user) {
                return ['success' => false, 'message' => 'Invalid verification token'];
            }

            // Update user as verified
            $stmt = $this->db->prepare("UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?");
            $stmt->execute([$user['id']]);

            return ['success' => true, 'message' => 'Email verified successfully'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Email verification failed: ' . $e->getMessage()];
        }
    }

    // Check if user is logged in
    public function isLoggedIn() {
        if (isset($_SESSION['user_id'])) {
            return true;
        }

        // Check remember me cookie
        if (isset($_COOKIE['remember_token'])) {
            return $this->checkRememberMe($_COOKIE['remember_token']);
        }

        return false;
    }

    // Get current user data
    public function getCurrentUser() {
        if (!$this->isLoggedIn()) {
            return null;
        }

        $user_id = $_SESSION['user_id'] ?? null;
        if (!$user_id) {
            return null;
        }

        return $this->getUserData($user_id);
    }

    // Get user data by ID
    public function getUserData($user_id) {
        try {
            $stmt = $this->db->prepare("SELECT id, email, first_name, last_name, phone, role, is_verified, avatar, bio, created_at, last_login FROM users WHERE id = ?");
            $stmt->execute([$user_id]);
            return $stmt->fetch();
        } catch (PDOException $e) {
            return null;
        }
    }

    // Update user profile
    public function updateProfile($user_id, $data) {
        try {
            $fields = [];
            $values = [];

            if (isset($data['first_name'])) {
                $fields[] = "first_name = ?";
                $values[] = $data['first_name'];
            }
            if (isset($data['last_name'])) {
                $fields[] = "last_name = ?";
                $values[] = $data['last_name'];
            }
            if (isset($data['phone'])) {
                $fields[] = "phone = ?";
                $values[] = $data['phone'];
            }
            if (isset($data['bio'])) {
                $fields[] = "bio = ?";
                $values[] = $data['bio'];
            }

            if (empty($fields)) {
                return ['success' => false, 'message' => 'No fields to update'];
            }

            $values[] = $user_id;
            $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute($values);

            return ['success' => true, 'message' => 'Profile updated successfully'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Profile update failed: ' . $e->getMessage()];
        }
    }

    // Change password
    public function changePassword($user_id, $current_password, $new_password) {
        try {
            // Verify current password
            $stmt = $this->db->prepare("SELECT password FROM users WHERE id = ?");
            $stmt->execute([$user_id]);
            $user = $stmt->fetch();

            if (!$user || !password_verify($current_password, $user['password'])) {
                return ['success' => false, 'message' => 'Current password is incorrect'];
            }

            // Hash new password
            $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

            // Update password
            $stmt = $this->db->prepare("UPDATE users SET password = ? WHERE id = ?");
            $stmt->execute([$hashed_password, $user_id]);

            return ['success' => true, 'message' => 'Password changed successfully'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Password change failed: ' . $e->getMessage()];
        }
    }

    // Check user role
    public function hasRole($role) {
        $user = $this->getCurrentUser();
        if (!$user) {
            return false;
        }
        return $user['role'] === $role;
    }

    // Check if user is admin
    public function isAdmin() {
        return $this->hasRole('admin');
    }

    // Check if user is premium
    public function isPremium() {
        return $this->hasRole('premium');
    }

    // Set remember me token
    private function setRememberMe($user_id) {
        $token = bin2hex(random_bytes(32));
        $stmt = $this->db->prepare("UPDATE users SET remember_token = ? WHERE id = ?");
        $stmt->execute([$token, $user_id]);
        setcookie('remember_token', $token, time() + (30 * 24 * 60 * 60), '/'); // 30 days
    }

    // Check remember me token
    private function checkRememberMe($token) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM users WHERE remember_token = ? AND status = 'active'");
            $stmt->execute([$token]);
            $user = $stmt->fetch();

            if (!$user) {
                return false;
            }

            // Set session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_name'] = $user['first_name'] . ' ' . $user['last_name'];
            $_SESSION['user_role'] = $user['role'];
            $_SESSION['is_verified'] = $user['is_verified'];

            // Create session record
            $this->createSessionRecord($user['id']);

            return true;
        } catch (PDOException $e) {
            return false;
        }
    }

    // Create session record
    private function createSessionRecord($user_id) {
        try {
            $session_token = bin2hex(random_bytes(32));
            $ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
            $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';
            $expires_at = date('Y-m-d H:i:s', strtotime('+24 hours'));

            $stmt = $this->db->prepare("INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$user_id, $session_token, $ip_address, $user_agent, $expires_at]);
        } catch (PDOException $e) {
            // Log error but don't fail
        }
    }

    // Send verification email
    private function sendVerificationEmail($email, $name, $token) {
        $verify_url = "http://" . $_SERVER['HTTP_HOST'] . "/verify.php?token=" . $token;
        
        $subject = "Verify Your Email - PARAMCGWALABOTS";
        $message = "
            <html>
            <head>
                <title>Verify Your Email</title>
            </head>
            <body>
                <h2>Welcome to PARAMCGWALABOTS, $name!</h2>
                <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
                <p><a href='$verify_url'>Verify Email</a></p>
                <p>Or copy and paste this link into your browser:</p>
                <p>$verify_url</p>
                <p>This link will expire in 24 hours.</p>
                <p>If you did not create an account, please ignore this email.</p>
            </body>
            </html>
        ";

        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=UTF-8\r\n";
        $headers .= "From: PARAMCGWALABOTS <noreply@paramcgwala.com>\r\n";

        mail($email, $subject, $message, $headers);
    }

    // Send password reset email
    private function sendPasswordResetEmail($email, $name, $token) {
        $reset_url = "http://" . $_SERVER['HTTP_HOST'] . "/reset-password.php?token=" . $token;
        
        $subject = "Reset Your Password - PARAMCGWALABOTS";
        $message = "
            <html>
            <head>
                <title>Reset Your Password</title>
            </head>
            <body>
                <h2>Password Reset Request</h2>
                <p>Hello $name,</p>
                <p>We received a request to reset your password. Click the link below to reset it:</p>
                <p><a href='$reset_url'>Reset Password</a></p>
                <p>Or copy and paste this link into your browser:</p>
                <p>$reset_url</p>
                <p>This link will expire in 1 hour.</p>
                <p>If you did not request a password reset, please ignore this email.</p>
            </body>
            </html>
        ";

        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=UTF-8\r\n";
        $headers .= "From: PARAMCGWALABOTS <noreply@paramcgwala.com>\r\n";

        mail($email, $subject, $message, $headers);
    }
}

// Create auth instance
$auth = new Auth();
?>
