<?php
require_once 'includes/auth.php';
require_once 'includes/auth_check.php';

$error = '';
$success = '';
$token = $_GET['token'] ?? '';

if (empty($token)) {
    header('Location: login.php');
    exit();
}

$result = $auth->verifyEmail($token);
if ($result['success']) {
    $success = $result['message'];
} else {
    $error = $result['message'];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Email Verification | PARAMCGWALABOTS</title>
    <meta name="description" content="Verify your registered email address with PARAMCGWALABOTS to activate your account and unlock access to courses, resources, and bots.">
    
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
            text-align: center;
        }

        .auth-icon {
            font-size: 4rem;
            margin-bottom: 20px;
        }

        .auth-icon.success {
            color: #51cf66;
        }

        .auth-icon.error {
            color: #ff6b6b;
        }

        .auth-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #fff;
            margin-bottom: 15px;
        }

        .auth-subtitle {
            color: #AAB2C8;
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 25px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #00F5D4 0%, #00BBF9 100%);
            border: none;
            border-radius: 10px;
            padding: 12px 30px;
            font-weight: 600;
            font-size: 1rem;
            color: #0B0F19;
            transition: all 0.3s ease;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 245, 212, 0.4);
            background: linear-gradient(135deg, #00F5D4 0%, #00BBF9 100%);
            color: #0B0F19;
        }

        .btn-outline {
            background: transparent;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            padding: 12px 30px;
            font-weight: 600;
            font-size: 1rem;
            color: #fff;
            transition: all 0.3s ease;
        }

        .btn-outline:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: #00F5D4;
            color: #00F5D4;
        }

        .alert {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 15px;
            font-size: 0.9rem;
            margin-bottom: 20px;
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

        .features-list {
            text-align: left;
            margin: 25px 0;
            padding: 20px;
            background: rgba(0, 245, 212, 0.05);
            border: 1px solid rgba(0, 245, 212, 0.2);
            border-radius: 10px;
        }

        .features-list h4 {
            color: #00F5D4;
            font-size: 1rem;
            margin-bottom: 15px;
        }

        .features-list ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .features-list li {
            color: #AAB2C8;
            font-size: 0.9rem;
            padding: 8px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .features-list li i {
            color: #00F5D4;
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
        <div class="auth-card">
            <?php if ($success): ?>
                <div class="auth-icon success">
                    <i class="bi bi-check-circle-fill"></i>
                </div>
                <h1 class="auth-title">Email Verified Successfully!</h1>
                <p class="auth-subtitle">
                    Your email has been verified. You can now access all features of your account.
                </p>
                
                <div class="features-list">
                    <h4><i class="bi bi-unlock"></i> Unlocked Features:</h4>
                    <ul>
                        <li><i class="bi bi-check-circle-fill"></i> Access to free courses and resources</li>
                        <li><i class="bi bi-check-circle-fill"></i> Join community discussions</li>
                        <li><i class="bi bi-check-circle-fill"></i> Download free trading bots</li>
                        <li><i class="bi bi-check-circle-fill"></i> Get email notifications</li>
                    </ul>
                </div>

                <a href="login.php" class="btn btn-primary">
                    <i class="bi bi-box-arrow-in-right"></i>
                    Sign In to Your Account
                </a>
            <?php else: ?>
                <div class="auth-icon error">
                    <i class="bi bi-x-circle-fill"></i>
                </div>
                <h1 class="auth-title">Verification Failed</h1>
                <p class="auth-subtitle">
                    <?php echo htmlspecialchars($error); ?>
                </p>
                
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i>
                    The verification link may have expired or is invalid.
                </div>

                <a href="login.php" class="btn btn-primary">
                    <i class="bi bi-box-arrow-in-right"></i>
                    Sign In
                </a>
                
                <div style="margin-top: 15px;">
                    <a href="signup.php" class="btn btn-outline">
                        <i class="bi bi-person-plus"></i>
                        Create New Account
                    </a>
                </div>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
