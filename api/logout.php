<?php
require_once dirname(__DIR__) . '/includes/auth.php';
require_once dirname(__DIR__) . '/includes/auth_check.php';

$result = $auth->logout();

if ($result['success']) {
    header('Location: login.php');
    exit();
} else {
    die('Logout failed: ' . $result['message']);
}
?>
