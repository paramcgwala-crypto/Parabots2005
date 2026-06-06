<?php
session_start();
require_once 'auth.php';

// Check if user is logged in
function requireLogin() {
    global $auth;
    if (!$auth->isLoggedIn()) {
        header('Location: login.php');
        exit();
    }
}

// Check if user is admin
function requireAdmin() {
    global $auth;
    requireLogin();
    if (!$auth->isAdmin()) {
        header('Location: dashboard.php');
        exit();
    }
}

// Check if user is premium
function requirePremium() {
    global $auth;
    requireLogin();
    if (!$auth->isPremium() && !$auth->isAdmin()) {
        header('Location: premium-membership.php');
        exit();
    }
}

// Check if user is verified
function requireVerified() {
    global $auth;
    requireLogin();
    $user = $auth->getCurrentUser();
    if (!$user || !$user['is_verified']) {
        header('Location: verify-email.php');
        exit();
    }
}

// Redirect if already logged in
function redirectIfLoggedIn($redirect_url = 'dashboard.php') {
    global $auth;
    if ($auth->isLoggedIn()) {
        header('Location: ' . $redirect_url);
        exit();
    }
}

// Get current user
function getCurrentUser() {
    global $auth;
    return $auth->getCurrentUser();
}

// Check if premium content is accessible
function canAccessPremiumContent() {
    global $auth;
    $user = $auth->getCurrentUser();
    if (!$user) {
        return false;
    }
    return $user['role'] === 'premium' || $user['role'] === 'admin';
}

// Protect premium pages
function protectPremiumPage() {
    if (!canAccessPremiumContent()) {
        $_SESSION['redirect_after_login'] = $_SERVER['REQUEST_URI'];
        header('Location: login.php');
        exit();
    }
}
?>
