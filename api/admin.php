<?php
require_once dirname(__DIR__) . '/includes/auth.php';
require_once dirname(__DIR__) . '/includes/auth_check.php';

// Require admin access
requireAdmin();

// Get current user for display
$user = getCurrentUser();

// Read the admin.html content
$htmlContent = file_get_contents('admin.html');

// Inject logout button and user info into the navbar
$logoutButton = '<div class="d-flex align-items-center gap-2 ms-3">
    <span style="color:var(--muted-text);font-size:0.85rem;">' . htmlspecialchars($user['email']) . '</span>
    <a href="logout.php" class="btn btn-outline-light btn-sm">
        <i class="bi bi-box-arrow-right"></i> Logout
    </a>
</div>';

// Insert logout after the admin badge
$htmlContent = str_replace('</span>', '</span>' . $logoutButton, $htmlContent);

echo $htmlContent;
