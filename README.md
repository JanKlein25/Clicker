<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mini Cookie Clicker</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      background: #f4f4f4;
      padding: 30px;
    }
    #cookie {
      width: 200px;
      cursor: pointer;
      transition: transform 0.1s;
    }
    #cookie:active {
      transform: scale(0.9);
    }
    .shop-item {
      border: 1px solid #ccc;
      padding: 10px;
      margin: 10px auto;
      width: 250px;
      background: white;
      border-radius: 8px;
    }
    button {
      padding: 5px 10px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>Cookie Clicker Clone</h1>
  <h2>Cookies: <span id="score">0</span></h2>

  <img id="cookie" src="https://upload.wikimedia.org/wikipedia/commons/7/70/Emoji_u1f36a.svg" alt="Cookie" />

  <h2>Shop</h2>
  <div class="shop-item">
    <p>Cursor (+1 CPS)</p>
    <p>Kosten: <span id="cursorCost">10</span></p>
    <button onclick="buyCursor()">Kaufen</button>
  </div>

  <script>
    let cookies = 0;
    let cps = 0;
    let cursorCost = 10;

    const scoreDisplay = document.getElementById("score");
    const cookie = document.getElementById("cookie");
    const cursorCostDisplay = document.getElementById("cursorCost");

    cookie.addEventListener("click", () => {
      cookies++;
      updateScore();
    });

    function updateScore() {
      scoreDisplay.textContent = cookies;
    }

    function buyCursor() {
      if (cookies >= cursorCost) {
        cookies -= cursorCost;
        cps += 1;
        cursorCost = Math.round(cursorCost * 1.3);
        cursorCostDisplay.textContent = cursorCost;
        updateScore();
      }
    }

    // Automatisches Generieren der Cookies
    setInterval(() => {
      cookies += cps;
      updateScore();
    }, 1000);
  </script>
</body>
</html>
