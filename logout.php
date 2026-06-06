<?php
require_once 'includes/auth.php';
require_once 'includes/auth_check.php';

$result = $auth->logout();

if ($result['success']) {
    header('Location: login.php');
    exit();
} else {
    die('Logout failed: ' . $result['message']);
}
?>
