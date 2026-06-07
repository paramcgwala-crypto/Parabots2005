<?php
require_once dirname(__DIR__) . '/includes/auth.php';
require_once dirname(__DIR__) . '/includes/auth_check.php';

// Require login
requireLogin();

$user = getCurrentUser();
$active_tab = $_GET['tab'] ?? 'courses';

// Handle profile update
$profile_error = '';
$profile_success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_profile'])) {
    $data = [
        'first_name' => trim($_POST['first_name'] ?? ''),
        'last_name' => trim($_POST['last_name'] ?? ''),
        'phone' => trim($_POST['phone'] ?? ''),
        'bio' => trim($_POST['bio'] ?? '')
    ];
    
    $result = $auth->updateProfile($user['id'], $data);
    if ($result['success']) {
        $profile_success = $result['message'];
        $user = getCurrentUser(); // Refresh user data
    } else {
        $profile_error = $result['message'];
    }
}

// Handle password change
$password_error = '';
$password_success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['change_password'])) {
    $current_password = $_POST['current_password'] ?? '';
    $new_password = $_POST['new_password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';
    
    if ($new_password !== $confirm_password) {
        $password_error = 'Passwords do not match';
    } else {
        $result = $auth->changePassword($user['id'], $current_password, $new_password);
        if ($result['success']) {
            $password_success = $result['message'];
        } else {
            $password_error = $result['message'];
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
    <title>Dashboard | PARAMCGWALABOTS</title>
    <meta name="description" content="Access your personalized user dashboard to manage your enrolled courses, download trading PDFs and guide resources, and check your membership status.">
    
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
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding-top: 80px;
        }

        .dashboard-container {
            padding: 30px 0;
        }

        .dashboard-header {
            margin-bottom: 30px;
        }

        .welcome-card {
            background: rgba(19, 26, 41, 0.8);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .welcome-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 5px;
        }

        .welcome-subtitle {
            color: #AAB2C8;
            font-size: 1rem;
        }

        .user-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            margin-top: 15px;
        }

        .user-badge.admin {
            background: rgba(220, 53, 69, 0.2);
            border: 1px solid rgba(220, 53, 69, 0.3);
            color: #ff6b6b;
        }

        .user-badge.premium {
            background: rgba(0, 245, 212, 0.2);
            border: 1px solid rgba(0, 245, 212, 0.3);
            color: #00F5D4;
        }

        .user-badge.free {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #AAB2C8;
        }

        .dashboard-nav {
            background: rgba(19, 26, 41, 0.8);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 15px;
            margin-bottom: 30px;
        }

        .dashboard-nav .nav-link {
            color: #AAB2C8;
            padding: 12px 20px;
            border-radius: 10px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .dashboard-nav .nav-link:hover {
            background: rgba(255, 255, 255, 0.05);
            color: #00F5D4;
        }

        .dashboard-nav .nav-link.active {
            background: linear-gradient(135deg, rgba(0, 245, 212, 0.2) 0%, rgba(0, 187, 249, 0.2) 100%);
            color: #00F5D4;
            border: 1px solid rgba(0, 245, 212, 0.3);
        }

        .dashboard-nav .nav-link i {
            margin-right: 8px;
        }

        .dashboard-card {
            background: rgba(19, 26, 41, 0.8);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            margin-bottom: 20px;
        }

        .dashboard-card h3 {
            color: #fff;
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 20px;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 15px;
            padding: 25px;
            text-align: center;
            transition: all 0.3s ease;
        }

        .stat-card:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(0, 245, 212, 0.3);
            transform: translateY(-5px);
        }

        .stat-icon {
            font-size: 2.5rem;
            color: #00F5D4;
            margin-bottom: 15px;
        }

        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 5px;
        }

        .stat-label {
            color: #AAB2C8;
            font-size: 0.9rem;
        }

        .course-item {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 15px;
            transition: all 0.3s ease;
        }

        .course-item:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(0, 245, 212, 0.3);
        }

        .course-item h4 {
            color: #fff;
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .course-item p {
            color: #AAB2C8;
            font-size: 0.9rem;
            margin-bottom: 15px;
        }

        .course-progress {
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 10px;
        }

        .course-progress-bar {
            height: 100%;
            background: linear-gradient(135deg, #00F5D4 0%, #00BBF9 100%);
            border-radius: 3px;
        }

        .course-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.85rem;
            color: #AAB2C8;
        }

        .download-item {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 15px;
            transition: all 0.3s ease;
        }

        .download-item:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(0, 245, 212, 0.3);
        }

        .download-icon {
            font-size: 2rem;
            color: #00F5D4;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 245, 212, 0.1);
            border-radius: 10px;
        }

        .download-info h4 {
            color: #fff;
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 5px;
        }

        .download-info p {
            color: #AAB2C8;
            font-size: 0.85rem;
            margin-bottom: 0;
        }

        .download-action {
            margin-left: auto;
        }

        .btn-download {
            background: linear-gradient(135deg, #00F5D4 0%, #00BBF9 100%);
            border: none;
            border-radius: 8px;
            padding: 8px 16px;
            font-weight: 600;
            font-size: 0.85rem;
            color: #0B0F19;
            transition: all 0.3s ease;
        }

        .btn-download:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 245, 212, 0.4);
            color: #0B0F19;
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

        .btn-primary {
            background: linear-gradient(135deg, #00F5D4 0%, #00BBF9 100%);
            border: none;
            border-radius: 10px;
            padding: 12px 25px;
            font-weight: 600;
            font-size: 0.95rem;
            color: #0B0F19;
            transition: all 0.3s ease;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 245, 212, 0.4);
            background: linear-gradient(135deg, #00F5D4 0%, #00BBF9 100%);
            color: #0B0F19;
        }

        .btn-danger {
            background: rgba(220, 53, 69, 0.2);
            border: 1px solid rgba(220, 53, 69, 0.3);
            border-radius: 10px;
            padding: 12px 25px;
            font-weight: 600;
            font-size: 0.95rem;
            color: #ff6b6b;
            transition: all 0.3s ease;
        }

        .btn-danger:hover {
            background: rgba(220, 53, 69, 0.3);
            border-color: rgba(220, 53, 69, 0.5);
            color: #ff6b6b;
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

        .empty-state {
            text-align: center;
            padding: 40px 20px;
        }

        .empty-state i {
            font-size: 3rem;
            color: rgba(255, 255, 255, 0.2);
            margin-bottom: 15px;
        }

        .empty-state h4 {
            color: #fff;
            font-size: 1.1rem;
            margin-bottom: 10px;
        }

        .empty-state p {
            color: #AAB2C8;
            font-size: 0.9rem;
        }

        .premium-locked {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 15px;
            padding: 30px;
            text-align: center;
        }

        .premium-locked i {
            font-size: 3rem;
            color: #ffd43b;
            margin-bottom: 15px;
        }

        .premium-locked h4 {
            color: #fff;
            font-size: 1.2rem;
            margin-bottom: 10px;
        }

        .premium-locked p {
            color: #AAB2C8;
            font-size: 0.9rem;
            margin-bottom: 20px;
        }

        @media (max-width: 768px) {
            body {
                padding-top: 70px;
            }

            .dashboard-container {
                padding: 15px 0;
            }

            .dashboard-nav {
                overflow-x: auto;
                white-space: nowrap;
            }

            .dashboard-nav .nav-link {
                padding: 10px 15px;
                font-size: 0.9rem;
            }
        }
    </style>
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg fixed-top" style="background: rgba(11, 15, 25, 0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
        <div class="container">
            <a class="navbar-brand" href="index.html" style="font-size: 1.3rem; font-weight: 700; color: #fff; text-decoration: none;">
                <i class="bi bi-robot"></i>
                <span>PARAMCGWALA</span><span style="color: #00F5D4;">BOTS</span>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" style="border-color: rgba(255, 255, 255, 0.2);">
                <span class="navbar-toggler-icon" style="filter: invert(1);"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav mx-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="index.html" style="color: #AAB2C8;">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="courses.html" style="color: #AAB2C8;">Courses</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="bots.html" style="color: #AAB2C8;">Trading Bots</a>
                    </li>
                </ul>
                <div class="d-flex align-items-center gap-3">
                    <span style="color: #fff; font-size: 0.9rem;">
                        <i class="bi bi-person-circle"></i>
                        <?php echo htmlspecialchars($user['first_name'] . ' ' . $user['last_name']); ?>
                    </span>
                    <a href="logout.php" class="btn btn-outline-danger" style="border: 1px solid rgba(220, 53, 69, 0.3); color: #ff6b6b; padding: 8px 16px; font-size: 0.85rem;">
                        <i class="bi bi-box-arrow-right"></i> Logout
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <div class="container dashboard-container">
        <div class="dashboard-header">
            <div class="welcome-card">
                <h1 class="welcome-title">Welcome back, <?php echo htmlspecialchars($user['first_name']); ?>!</h1>
                <p class="welcome-subtitle">Manage your account, courses, and downloads from your dashboard.</p>
                <div class="user-badge <?php echo $user['role']; ?>">
                    <i class="bi bi-<?php echo $user['role'] === 'admin' ? 'shield-fill-check' : ($user['role'] === 'premium' ? 'star-fill' : 'person'); ?>"></i>
                    <?php echo ucfirst($user['role']); ?> Member
                </div>
            </div>
        </div>

        <div class="dashboard-nav">
            <ul class="nav nav-pills">
                <li class="nav-item">
                    <a class="nav-link <?php echo $active_tab === 'courses' ? 'active' : ''; ?>" href="dashboard.php?tab=courses">
                        <i class="bi bi-book"></i> My Courses
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link <?php echo $active_tab === 'downloads' ? 'active' : ''; ?>" href="dashboard.php?tab=downloads">
                        <i class="bi bi-download"></i> My Downloads
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link <?php echo $active_tab === 'profile' ? 'active' : ''; ?>" href="dashboard.php?tab=profile">
                        <i class="bi bi-person"></i> Profile
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link <?php echo $active_tab === 'settings' ? 'active' : ''; ?>" href="dashboard.php?tab=settings">
                        <i class="bi bi-gear"></i> Settings
                    </a>
                </li>
            </ul>
        </div>

        <?php if ($active_tab === 'courses'): ?>
            <div class="row">
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="bi bi-book"></i>
                        </div>
                        <div class="stat-number">0</div>
                        <div class="stat-label">Enrolled Courses</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="bi bi-check-circle"></i>
                        </div>
                        <div class="stat-number">0</div>
                        <div class="stat-label">Completed</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="bi bi-clock"></i>
                        </div>
                        <div class="stat-number">0h</div>
                        <div class="stat-label">Learning Time</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="bi bi-trophy"></i>
                        </div>
                        <div class="stat-number">0</div>
                        <div class="stat-label">Certificates</div>
                    </div>
                </div>
            </div>

            <div class="dashboard-card" style="margin-top: 30px;">
                <h3><i class="bi bi-book"></i> My Courses</h3>
                <div class="empty-state">
                    <i class="bi bi-inbox"></i>
                    <h4>No courses enrolled yet</h4>
                    <p>Start your learning journey by enrolling in our courses.</p>
                    <a href="courses.html" class="btn btn-primary">
                        <i class="bi bi-plus-circle"></i> Browse Courses
                    </a>
                </div>
            </div>
        <?php elseif ($active_tab === 'downloads'): ?>
            <?php if ($user['role'] === 'free'): ?>
                <div class="premium-locked">
                    <i class="bi bi-lock-fill"></i>
                    <h4>Premium Feature</h4>
                    <p>Upgrade to Premium to access exclusive downloads including trading bots, PDFs, and automation workflows.</p>
                    <a href="premium-membership.html" class="btn btn-primary">
                        <i class="bi bi-star"></i> Upgrade to Premium
                    </a>
                </div>
            <?php else: ?>
                <div class="dashboard-card">
                    <h3><i class="bi bi-download"></i> My Downloads</h3>
                    <div class="empty-state">
                        <i class="bi bi-inbox"></i>
                        <h4>No downloads yet</h4>
                        <p>Your downloaded resources will appear here.</p>
                    </div>
                </div>
            <?php endif; ?>
        <?php elseif ($active_tab === 'profile'): ?>
            <div class="dashboard-card">
                <h3><i class="bi bi-person"></i> Profile Information</h3>
                
                <?php if ($profile_error): ?>
                    <div class="alert alert-danger">
                        <i class="bi bi-exclamation-circle"></i>
                        <?php echo htmlspecialchars($profile_error); ?>
                    </div>
                <?php endif; ?>

                <?php if ($profile_success): ?>
                    <div class="alert alert-success">
                        <i class="bi bi-check-circle"></i>
                        <?php echo htmlspecialchars($profile_success); ?>
                    </div>
                <?php endif; ?>

                <form method="POST" action="">
                    <input type="hidden" name="update_profile" value="1">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="first_name" class="form-label">First Name</label>
                                <input type="text" class="form-control" id="first_name" name="first_name" value="<?php echo htmlspecialchars($user['first_name']); ?>" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="last_name" class="form-label">Last Name</label>
                                <input type="text" class="form-control" id="last_name" name="last_name" value="<?php echo htmlspecialchars($user['last_name']); ?>" required>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="email" class="form-label">Email Address</label>
                        <input type="email" class="form-control" id="email" value="<?php echo htmlspecialchars($user['email']); ?>" disabled style="opacity: 0.7;">
                        <small style="color: #AAB2C8; font-size: 0.8rem;">Email cannot be changed</small>
                    </div>

                    <div class="form-group">
                        <label for="phone" class="form-label">Phone Number</label>
                        <input type="tel" class="form-control" id="phone" name="phone" value="<?php echo htmlspecialchars($user['phone'] ?? ''); ?>" placeholder="+91 9876543210">
                    </div>

                    <div class="form-group">
                        <label for="bio" class="form-label">Bio</label>
                        <textarea class="form-control" id="bio" name="bio" rows="4" placeholder="Tell us about yourself..."><?php echo htmlspecialchars($user['bio'] ?? ''); ?></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary">
                        <i class="bi bi-check-circle"></i> Update Profile
                    </button>
                </form>
            </div>
        <?php elseif ($active_tab === 'settings'): ?>
            <div class="dashboard-card">
                <h3><i class="bi bi-gear"></i> Account Settings</h3>
                
                <?php if ($password_error): ?>
                    <div class="alert alert-danger">
                        <i class="bi bi-exclamation-circle"></i>
                        <?php echo htmlspecialchars($password_error); ?>
                    </div>
                <?php endif; ?>

                <?php if ($password_success): ?>
                    <div class="alert alert-success">
                        <i class="bi bi-check-circle"></i>
                        <?php echo htmlspecialchars($password_success); ?>
                    </div>
                <?php endif; ?>

                <form method="POST" action="">
                    <input type="hidden" name="change_password" value="1">
                    <h5 style="color: #fff; margin-bottom: 20px;">Change Password</h5>
                    
                    <div class="form-group">
                        <label for="current_password" class="form-label">Current Password</label>
                        <input type="password" class="form-control" id="current_password" name="current_password" required>
                    </div>

                    <div class="form-group">
                        <label for="new_password" class="form-label">New Password</label>
                        <input type="password" class="form-control" id="new_password" name="new_password" required minlength="6">
                    </div>

                    <div class="form-group">
                        <label for="confirm_password" class="form-label">Confirm New Password</label>
                        <input type="password" class="form-control" id="confirm_password" name="confirm_password" required minlength="6">
                    </div>

                    <button type="submit" class="btn btn-primary">
                        <i class="bi bi-shield-lock"></i> Change Password
                    </button>
                </form>
            </div>

            <div class="dashboard-card">
                <h3><i class="bi bi-info-circle"></i> Account Information</h3>
                <div class="row">
                    <div class="col-md-6">
                        <div style="margin-bottom: 15px;">
                            <label style="color: #AAB2C8; font-size: 0.85rem;">Member Since</label>
                            <div style="color: #fff; font-weight: 500;">
                                <?php echo date('F j, Y', strtotime($user['created_at'])); ?>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div style="margin-bottom: 15px;">
                            <label style="color: #AAB2C8; font-size: 0.85rem;">Account Status</label>
                            <div style="color: #51cf66; font-weight: 500;">
                                <i class="bi bi-check-circle-fill"></i> Active
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div style="margin-bottom: 15px;">
                            <label style="color: #AAB2C8; font-size: 0.85rem;">Email Verified</label>
                            <div style="color: <?php echo $user['is_verified'] ? '#51cf66' : '#ffd43b'; ?>; font-weight: 500;">
                                <i class="bi bi-<?php echo $user['is_verified'] ? 'check-circle-fill' : 'exclamation-circle-fill'; ?>"></i>
                                <?php echo $user['is_verified'] ? 'Verified' : 'Not Verified'; ?>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div style="margin-bottom: 15px;">
                            <label style="color: #AAB2C8; font-size: 0.85rem;">Account Type</label>
                            <div style="color: #fff; font-weight: 500;">
                                <?php echo ucfirst($user['role']); ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="dashboard-card" style="border-color: rgba(220, 53, 69, 0.3);">
                <h3 style="color: #ff6b6b;"><i class="bi bi-exclamation-triangle"></i> Danger Zone</h3>
                <p style="color: #AAB2C8; margin-bottom: 20px;">Once you delete your account, there is no going back. Please be certain.</p>
                <button class="btn btn-danger" onclick="if(confirm('Are you sure you want to delete your account? This action cannot be undone.')) { alert('Account deletion feature coming soon'); }">
                    <i class="bi bi-trash"></i> Delete Account
                </button>
            </div>
        <?php endif; ?>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
