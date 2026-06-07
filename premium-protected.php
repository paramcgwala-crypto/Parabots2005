<?php
require_once 'includes/auth.php';
require_once 'includes/auth_check.php';

// Protect premium content
protectPremiumPage();

$user = getCurrentUser();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Premium Content | PARAMCGWALABOTS</title>
    <meta name="description" content="Access premium PARAMCGWALABOTS content including exclusive trading bots, advanced trading courses, and direct expert support.">
    
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

        .premium-container {
            padding: 40px 0;
        }

        .premium-header {
            text-align: center;
            margin-bottom: 50px;
        }

        .premium-header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 15px;
        }

        .premium-header p {
            color: #AAB2C8;
            font-size: 1.1rem;
        }

        .premium-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, rgba(0, 245, 212, 0.2) 0%, rgba(0, 187, 249, 0.2) 100%);
            border: 1px solid rgba(0, 245, 212, 0.3);
            color: #00F5D4;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: 600;
            margin-top: 20px;
        }

        .content-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
        }

        .content-card {
            background: rgba(19, 26, 41, 0.8);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        }

        .content-card:hover {
            transform: translateY(-5px);
            border-color: rgba(0, 245, 212, 0.3);
        }

        .content-card h3 {
            color: #fff;
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 15px;
        }

        .content-card p {
            color: #AAB2C8;
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 20px;
        }

        .content-card .btn {
            background: linear-gradient(135deg, #00F5D4 0%, #00BBF9 100%);
            border: none;
            border-radius: 10px;
            padding: 10px 20px;
            font-weight: 600;
            font-size: 0.9rem;
            color: #0B0F19;
        }

        .content-card .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 245, 212, 0.4);
            color: #0B0F19;
        }

        .feature-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .feature-list li {
            color: #AAB2C8;
            font-size: 0.9rem;
            padding: 8px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .feature-list li i {
            color: #00F5D4;
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
                        <a class="nav-link" href="dashboard.php" style="color: #AAB2C8;">Dashboard</a>
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

    <div class="container premium-container">
        <div class="premium-header">
            <h1>Premium Content</h1>
            <p>Exclusive access to premium trading bots, courses, and resources</p>
            <div class="premium-badge">
                <i class="bi bi-star-fill"></i>
                Premium Member
            </div>
        </div>

        <div class="content-grid">
            <div class="content-card">
                <h3><i class="bi bi-robot"></i> Premium Trading Bots</h3>
                <p>Access our exclusive collection of high-performance trading bots with advanced algorithms.</p>
                <ul class="feature-list">
                    <li><i class="bi bi-check-circle-fill"></i> Forex Trading Bots</li>
                    <li><i class="bi bi-check-circle-fill"></i> Crypto Arbitrage Bots</li>
                    <li><i class="bi bi-check-circle-fill"></i> AI-Powered Strategies</li>
                    <li><i class="bi bi-check-circle-fill"></i> 24/7 Automated Trading</li>
                </ul>
                <button class="btn mt-3">
                    <i class="bi bi-download"></i> Download Bots
                </button>
            </div>

            <div class="content-card">
                <h3><i class="bi bi-book"></i> Premium Courses</h3>
                <p>Unlock all our premium trading courses with advanced strategies and techniques.</p>
                <ul class="feature-list">
                    <li><i class="bi bi-check-circle-fill"></i> Advanced ICT Concepts</li>
                    <li><i class="bi bi-check-circle-fill"></i> Smart Money Concepts</li>
                    <li><i class="bi bi-check-circle-fill"></i> Price Action Mastery</li>
                    <li><i class="bi bi-check-circle-fill"></i> Risk Management</li>
                </ul>
                <button class="btn mt-3">
                    <i class="bi bi-play-circle"></i> Access Courses
                </button>
            </div>

            <div class="content-card">
                <h3><i class="bi bi-diagram-3"></i> n8n Workflows</h3>
                <p>Download and use premium n8n automation workflows for your business needs.</p>
                <ul class="feature-list">
                    <li><i class="bi bi-check-circle-fill"></i> Trading Automation</li>
                    <li><i class="bi bi-check-circle-fill"></i> Lead Generation</li>
                    <li><i class="bi bi-check-circle-fill"></i> Data Processing</li>
                    <li><i class="bi bi-check-circle-fill"></i> Custom Integrations</li>
                </ul>
                <button class="btn mt-3">
                    <i class="bi bi-download"></i> Download Workflows
                </button>
            </div>

            <div class="content-card">
                <h3><i class="bi bi-file-earmark-pdf"></i> PDF Resources</h3>
                <p>Access exclusive PDF guides, trading plans, and educational materials.</p>
                <ul class="feature-list">
                    <li><i class="bi bi-check-circle-fill"></i> Trading Strategies</li>
                    <li><i class="bi bi-check-circle-fill"></i> Market Analysis</li>
                    <li><i class="bi bi-check-circle-fill"></i> Risk Calculators</li>
                    <li><i class="bi bi-check-circle-fill"></i> Trading Journals</li>
                </ul>
                <button class="btn mt-3">
                    <i class="bi bi-download"></i> Download PDFs
                </button>
            </div>

            <div class="content-card">
                <h3><i class="bi bi-people"></i> Private Community</h3>
                <p>Join our exclusive Telegram group for networking and direct support from experts.</p>
                <ul class="feature-list">
                    <li><i class="bi bi-check-circle-fill"></i> Daily Market Analysis</li>
                    <li><i class="bi bi-check-circle-fill"></i> Trade Ideas</li>
                    <li><i class="bi bi-check-circle-fill"></i> Q&A Sessions</li>
                    <li><i class="bi bi-check-circle-fill"></i> Networking</li>
                </ul>
                <button class="btn mt-3">
                    <i class="bi bi-telegram"></i> Join Community
                </button>
            </div>

            <div class="content-card">
                <h3><i class="bi bi-headset"></i> Priority Support</h3>
                <p>Get priority support with faster response times and dedicated assistance.</p>
                <ul class="feature-list">
                    <li><i class="bi bi-check-circle-fill"></i> 24/7 Support</li>
                    <li><i class="bi bi-check-circle-fill"></i> Direct Chat Access</li>
                    <li><i class="bi bi-check-circle-fill"></i> Video Consultations</li>
                    <li><i class="bi bi-check-circle-fill"></i> Custom Bot Setup</li>
                </ul>
                <button class="btn mt-3">
                    <i class="bi bi-chat-dots"></i> Contact Support
                </button>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
