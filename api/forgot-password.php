<?php
require_once dirname(__DIR__) . '/includes/auth.php';
require_once dirname(__DIR__) . '/includes/auth_check.php';

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');

    if (empty($email)) {
        $error = 'Please enter your email address';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Invalid email address';
    } else {
        $result = $auth->forgotPassword($email);
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
    <title>Forgot Password | PARAMCGWALABOTS</title>
    <meta name="description" content="Request a password reset link to safely regain access to your PARAMCGWALABOTS account and trading systems.">
    
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
            max-width: 450px;
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

        .auth-icon {
            font-size: 3rem;
            color: #00F5D4;
            margin-bottom: 15px;
        }

        .auth-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #fff;
            margin-bottom: 10px;
        }

        .auth-subtitle {
            color: #AAB2C8;
            font-size: 0.9rem;
            line-height: 1.5;
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

        .info-box {
            background: rgba(0, 245, 212, 0.05);
            border: 1px solid rgba(0, 245, 212, 0.2);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 20px;
        }

        .info-box p {
            color: #AAB2C8;
            font-size: 0.85rem;
            margin: 0;
            line-height: 1.5;
        }

        .info-box i {
            color: #00F5D4;
            margin-right: 8px;
        }

        @media (max-width: 576px) {
            .auth-card {
                padding: 30px 20px;
            }

            .auth-title {
                font-size: 1.3rem;
            }
        }
    </style>
</head>
<body>
    <div class="auth-container">
        <a href="login.php" class="back-link">
            <i class="bi bi-arrow-left"></i>
            Back to Login
        </a>

        <div class="auth-card">
            <div class="auth-header">
                <div class="auth-icon">
                    <i class="bi bi-key"></i>
                </div>
                <h1 class="auth-title">Forgot Password?</h1>
                <p class="auth-subtitle">Enter your email address and we'll send you a link to reset your password.</p>
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
                <div class="info-box">
                    <p><i class="bi bi-info-circle"></i> The password reset link will be sent to your email address and will expire in 1 hour.</p>
                </div>

                <div class="form-group">
                    <label for="email" class="form-label">Email Address</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="bi bi-envelope"></i>
                        </span>
                        <input type="email" class="form-control" id="email" name="email" placeholder="Enter your email" required value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>">
                    </div>
                </div>

                <button type="submit" class="btn btn-primary">
                    <i class="bi bi-send"></i>
                    Send Reset Link
                </button>
            </form>
            <?php endif; ?>

            <div class="auth-footer">
                <p>Remember your password? <a href="login.php">Sign in</a></p>
            </div>
        </div>
    </div>
</body>
</html>
