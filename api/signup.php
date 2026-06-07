<?php
require_once dirname(__DIR__) . '/includes/auth.php';
require_once dirname(__DIR__) . '/includes/auth_check.php';

// Redirect if already logged in
redirectIfLoggedIn();

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $first_name = trim($_POST['first_name'] ?? '');
    $last_name = trim($_POST['last_name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    if (empty($first_name) || empty($last_name) || empty($email) || empty($password)) {
        $error = 'Please fill in all required fields';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Invalid email address';
    } elseif (strlen($password) < 6) {
        $error = 'Password must be at least 6 characters';
    } elseif ($password !== $confirm_password) {
        $error = 'Passwords do not match';
    } else {
        $result = $auth->register($email, $password, $first_name, $last_name, $phone);
        if ($result['success']) {
            $success = $result['message'];
        } else {
            $error = $result['message'];
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Sign Up | PARAMCGWALABOTS</title>
    <meta name="description" content="Sign up for a free or premium PARAMCGWALABOTS account to access expert forex and crypto AI bots, n8n workflows, educational courses, and live market tracking.">
    
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/style.css">
    
    <style>
        body {
            background: linear-gradient(135deg, #0B0F19 0%, #1a1f2e 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px;
        }

        .auth-container {
            width: 100%;
            max-width: 500px;
        }

        .auth-card {
            background: rgba(19, 26, 41, 0.8);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .auth-header {
            text-align: center;
            margin-bottom: 30px;
        }

        .auth-logo {
            font-size: 2rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 10px;
        }

        .auth-logo .accent {
            color: #00F5D4;
        }

        .auth-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #fff;
            margin-bottom: 5px;
        }

        .auth-subtitle {
            color: #AAB2C8;
            font-size: 0.9rem;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-label {
            color: #fff;
            font-weight: 500;
            margin-bottom: 8px;
        }

        .form-control {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 12px 15px;
            color: #fff;
            font-size: 0.95rem;
            transition: all 0.3s ease;
        }

        .form-control:focus {
            background: rgba(255, 255, 255, 0.08);
            border-color: #00F5D4;
            box-shadow: 0 0 0 3px rgba(0, 245, 212, 0.1);
            color: #fff;
        }

        .form-control::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        .input-group {
            position: relative;
        }

        .input-group-text {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            color: #AAB2C8;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .input-group-text:hover {
            background: rgba(255, 255, 255, 0.08);
            color: #00F5D4;
        }

        .form-check {
            display: flex;
            align-items: flex-start;
            gap: 8px;
        }

        .form-check-input {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 5px;
            margin-top: 3px;
        }

        .form-check-input:checked {
            background: #00F5D4;
            border-color: #00F5D4;
        }

        .form-check-label {
            color: #AAB2C8;
            font-size: 0.85rem;
            line-height: 1.4;
        }

        .form-check-label a {
            color: #00F5D4;
            text-decoration: none;
        }

        .form-check-label a:hover {
            color: #00BBF9;
            text-decoration: underline;
        }

        .btn-primary {
            background: linear-gradient(135deg, #00F5D4 0%, #00BBF9 100%);
            border: none;
            border-radius: 10px;
            padding: 12px 20px;
            font-weight: 600;
            font-size: 1rem;
            color: #0B0F19;
            width: 100%;
            transition: all 0.3s ease;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 245, 212, 0.4);
            background: linear-gradient(135deg, #00F5D4 0%, #00BBF9 100%);
            color: #0B0F19;
        }

        .auth-divider {
            display: flex;
            align-items: center;
            margin: 25px 0;
            color: #AAB2C8;
            font-size: 0.85rem;
        }

        .auth-divider::before,
        .auth-divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: rgba(255, 255, 255, 0.1);
        }

        .auth-divider span {
            padding: 0 15px;
        }

        .auth-footer {
            text-align: center;
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .auth-footer p {
            color: #AAB2C8;
            font-size: 0.9rem;
            margin-bottom: 0;
        }

        .auth-footer a {
            color: #00F5D4;
            text-decoration: none;
            font-weight: 500;
        }

        .auth-footer a:hover {
            color: #00BBF9;
        }

        .alert {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 12px 15px;
            font-size: 0.9rem;
        }

        .alert-danger {
            background: rgba(220, 53, 69, 0.1);
            border-color: rgba(220, 53, 69, 0.3);
            color: #ff6b6b;
        }

        .alert-success {
            background: rgba(25, 135, 84, 0.1);
            border-color: rgba(25, 135, 84, 0.3);
            color: #51cf66;
        }

        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            color: #AAB2C8;
            text-decoration: none;
            font-size: 0.9rem;
            margin-bottom: 20px;
            transition: color 0.3s ease;
        }

        .back-link:hover {
            color: #00F5D4;
        }

        .row .col-md-6 {
            padding-right: 8px;
            padding-left: 8px;
        }

        @media (max-width: 576px) {
            .auth-card {
                padding: 30px 20px;
            }

            .auth-title {
                font-size: 1.3rem;
            }

            .row .col-md-6 {
                padding-right: 12px;
                padding-left: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="auth-container">
        <a href="index.html" class="back-link">
            <i class="bi bi-arrow-left"></i>
            Back to Home
        </a>

        <div class="auth-card">
            <div class="auth-header">
                <div class="auth-logo">
                    <i class="bi bi-robot"></i>
                    PARAMCGWALA<span class="accent">BOTS</span>
                </div>
                <h1 class="auth-title">Create Account</h1>
                <p class="auth-subtitle">Join us and start your trading journey</p>
            </div>

            <?php if ($error): ?>
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-circle"></i>
                    <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <?php if ($success): ?>
                <div class="alert alert-success">
                    <i class="bi bi-check-circle"></i>
                    <?php echo htmlspecialchars($success); ?>
                </div>
            <?php endif; ?>

            <?php if (!$success): ?>
            <form method="POST" action="">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="first_name" class="form-label">First Name *</label>
                            <div class="input-group">
                                <span class="input-group-text">
                                    <i class="bi bi-person"></i>
                                </span>
                                <input type="text" class="form-control" id="first_name" name="first_name" placeholder="John" required value="<?php echo htmlspecialchars($_POST['first_name'] ?? ''); ?>">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="last_name" class="form-label">Last Name *</label>
                            <div class="input-group">
                                <span class="input-group-text">
                                    <i class="bi bi-person"></i>
                                </span>
                                <input type="text" class="form-control" id="last_name" name="last_name" placeholder="Doe" required value="<?php echo htmlspecialchars($_POST['last_name'] ?? ''); ?>">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="email" class="form-label">Email Address *</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="bi bi-envelope"></i>
                        </span>
                        <input type="email" class="form-control" id="email" name="email" placeholder="john@example.com" required value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>">
                    </div>
                </div>

                <div class="form-group">
                    <label for="phone" class="form-label">Phone Number</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="bi bi-telephone"></i>
                        </span>
                        <input type="tel" class="form-control" id="phone" name="phone" placeholder="+91 9876543210" value="<?php echo htmlspecialchars($_POST['phone'] ?? ''); ?>">
                    </div>
                </div>

                <div class="form-group">
                    <label for="password" class="form-label">Password *</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="bi bi-lock"></i>
                        </span>
                        <input type="password" class="form-control" id="password" name="password" placeholder="At least 6 characters" required>
                        <span class="input-group-text" onclick="togglePassword('password', 'passwordToggle')">
                            <i class="bi bi-eye" id="passwordToggle"></i>
                        </span>
                    </div>
                </div>

                <div class="form-group">
                    <label for="confirm_password" class="form-label">Confirm Password *</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="bi bi-lock"></i>
                        </span>
                        <input type="password" class="form-control" id="confirm_password" name="confirm_password" placeholder="Confirm your password" required>
                        <span class="input-group-text" onclick="togglePassword('confirm_password', 'confirmPasswordToggle')">
                            <i class="bi bi-eye" id="confirmPasswordToggle"></i>
                        </span>
                    </div>
                </div>

                <div class="form-group">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="terms" name="terms" required>
                        <label class="form-check-label" for="terms">
                            I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                        </label>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary">
                    <i class="bi bi-person-plus"></i>
                    Create Account
                </button>
            </form>
            <?php endif; ?>

            <div class="auth-divider">
                <span>or</span>
            </div>

            <div class="auth-footer">
                <p>Already have an account? <a href="login.php">Sign in</a></p>
            </div>
        </div>
    </div>

    <script>
        function togglePassword(inputId, toggleId) {
            const passwordInput = document.getElementById(inputId);
            const passwordToggle = document.getElementById(toggleId);
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                passwordToggle.classList.remove('bi-eye');
                passwordToggle.classList.add('bi-eye-slash');
            } else {
                passwordInput.type = 'password';
                passwordToggle.classList.remove('bi-eye-slash');
                passwordToggle.classList.add('bi-eye');
            }
        }
    </script>
</body>
</html>
