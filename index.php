<?php
// Save deal submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['deal'])) {
  $deal = strip_tags(trim($_POST['deal']));
  if ($deal !== "") {
    $formatted = "<div class=\"deal\">" . htmlspecialchars($deal) . "</div>\n";
    file_put_contents("deals.html", $formatted, FILE_APPEND);
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit;
  }
}

// Save JSON pageview logs
if ($_SERVER['REQUEST_METHOD'] === 'POST' && strpos($_SERVER["CONTENT_TYPE"], 'application/json') !== false) {
  $data = json_decode(file_get_contents('php://input'), true);
  if (isset($data['timestamp']) && isset($data['event'])) {
    $logLine = date("Y-m-d H:i:s") . " — " . $data['event'] . " — " . $data['timestamp'] . "\n";
    file_put_contents('log.txt', $logLine, FILE_APPEND);
    http_response_code(200);
    exit;
  }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Moová Tracker — Atlas Infra Node 001</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', sans-serif;
      display: flex;
      flex-direction: column;
      background-color: #000;
      color: #fff;
      height: 100vh;
    }
    .header {
      background-color: #111;
      padding: 12px 20px;
      font-size: 20px;
      font-weight: bold;
      border-bottom: 2px solid gold;
    }
    .main {
      flex: 1;
      display: flex;
      flex-direction: row;
    }
    iframe {
      flex: 2;
      border: none;
      height: 100%;
    }
    .sidebar {
      flex: 1;
      background-color: #111;
      padding: 15px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
    .deal {
      background-color: #222;
      padding: 10px;
      border-radius: 6px;
      margin-bottom: 10px;
      font-size: 16px;
    }
    .footer {
      font-size: 12px;
      text-align: center;
      padding: 10px;
      border-top: 1px solid #333;
      background-color: #111;
    }
    form {
      margin-top: 10px;
    }
    input[type="text"] {
      padding: 8px;
      width: 90%;
      background-color: #000;
      border: 1px solid #444;
      color: #fff;
      border-radius: 4px;
    }
    button {
      padding: 8px 16px;
      background-color: gold;
      border: none;
      margin-top: 5px;
      cursor: pointer;
      font-weight: bold;
    }
    @media (max-width: 768px) {
      .main {
        flex-direction: column;
      }
      iframe {
        height: 300px;
      }
    }
  </style>
</head>
<body>

  <div class="header">🚌 Moová Tracker | Atlas Infra Node 001</div>

  <div class="main">
    <!-- Live Map -->
    <iframe src="https://maps.app.goo.gl/pECLc9eicUPGchFu5?g_st=ipc" allowfullscreen></iframe>

    <!-- Sidebar: Deals & Form -->
    <div class="sidebar">
      <div><strong>📣 Live Deals Along Route:</strong></div>
      <div id="deals">
        <?php if (file_exists('deals.html')) include('deals.html'); ?>
      </div>

      <form method="POST">
        <input type="text" name="deal" placeholder="Add your local offer..." required />
        <button type="submit">Submit Deal</button>
      </form>
    </div>
  </div>

  <div class="footer">
    Location updates are public. No personal data tracked.<br>
    Logged at: <span id="timestamp"></span> — Verified via Atlas Infra Node 🌐
  </div>

  <script>
    const ts = new Date();
    document.getElementById('timestamp').textContent = ts.toLocaleString();

    fetch(window.location.href, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: Date.now(),
        event: 'pageview'
      })
    });
  </script>

</body>
</html>
