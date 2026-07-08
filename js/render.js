(function(R) {

  var C = RetroMiner.Config;
  var frameCount = 0;

  // C.DOM.ctx is set by main.js after DOM ready — resolve at call time
  function gc() { return C.DOM.ctx; }

  R.tickAnimation = function() { frameCount++; };

  R.clear = function() {
    var ctx = gc();
    ctx.fillStyle = '#0f380f';
    ctx.fillRect(0, 0, C.WIDTH, C.HEIGHT);
  };

  R.drawTile = function(ch, x, y) {
    var ctx = gc();
    var tx = x * C.TILE;
    var ty = y * C.TILE;

    if (ch === '#') {
      ctx.fillStyle = '#9bbc0f';
      ctx.fillRect(tx, ty, C.TILE, C.TILE);

      // Subtle border on walls for depth
      ctx.fillStyle = '#8bac0f';
      ctx.fillRect(tx, ty, C.TILE, 1);
      ctx.fillRect(tx, ty, 1, C.TILE);
      ctx.fillStyle = '#6b8c0a';
      ctx.fillRect(tx, ty + C.TILE - 1, C.TILE, 1);
      ctx.fillRect(tx + C.TILE - 1, ty, 1, C.TILE);
      return;
    }

    if (ch === '$') {
      // Pulsing gold
      var pulse = Math.sin(frameCount * 0.08 + x * 1.5 + y * 1.7) * 0.35 + 0.65;
      var size = Math.floor(6 * pulse);
      if (size < 2) size = 2;
      var off = Math.floor((6 - size) / 2);

      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(tx + 5 + off, ty + 5 + off, size, size);

      // Bright sparkle highlight
      if (pulse > 0.85) {
        ctx.fillStyle = '#fffbe6';
        ctx.fillRect(tx + 5 + off, ty + 5 + off, 2, 2);
      }
      return;
    }
  };

  R.drawPlayer = function() {
    var ctx = gc();
    var S = RetroMiner.State;
    var bx = S.playerX * C.TILE;
    var by = S.playerY * C.TILE;
    var bob = Math.sin(frameCount * 0.12) * 1.2;

    // Body
    ctx.fillStyle = '#00ff66';
    ctx.fillRect(bx + 2, by + 2 + bob, 12, 12);

    // Visor detail
    ctx.fillStyle = '#00cc44';
    ctx.fillRect(bx + 4, by + 4 + bob, 8, 3);

    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(bx + 5, by + 6 + bob, 2, 2);
    ctx.fillRect(bx + 9, by + 6 + bob, 2, 2);
  };

  R.drawEnemies = function() {
    var ctx = gc();
    var S = RetroMiner.State;

    for (var i = 0; i < S.enemies.length; i++) {
      var e = S.enemies[i];
      var bx = e.x * C.TILE;
      var by = e.y * C.TILE;

      var pulse = Math.sin(frameCount * 0.1 + e.x + e.y) * 0.15 + 0.85;
      var size = Math.floor(12 * pulse);
      if (size < 6) size = 6;
      var off = Math.floor((12 - size) / 2);

      // Body
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(bx + 2 + off, by + 2 + off, size, size);

      // Eyes
      ctx.fillStyle = '#000';
      ctx.fillRect(bx + 5, by + 5, 2, 2);
      ctx.fillRect(bx + 9, by + 5, 2, 2);
    }
  };

  R.drawHUD = function() {
    var ctx = gc();
    var S = RetroMiner.State;

    ctx.fillStyle = 'white';
    ctx.font = '10px monospace';
    ctx.fillText('L' + S.level, 5, 10);
    ctx.fillText('SCORE ' + S.score, 48, 10);
    ctx.fillText('TIME ' + Math.ceil(S.timer), 220, 10);

    // Combo indicator
    if (S.combo > 0) {
      ctx.fillStyle = '#ffcc00';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('x' + (S.combo + 1), 155, 10);
    }
  };

  R.render = function() {
    var map = RetroMiner.Map.getMap();

    R.clear();

    // Tiles
    for (var y = 0; y < C.ROWS; y++)
      for (var x = 0; x < C.COLS; x++)
        R.drawTile(map[y][x], x, y);

    // Always render entities (menu shows the map as background)
    R.drawEnemies();
    R.drawPlayer();
    R.drawHUD();
  };

})(RetroMiner.Render = {});
