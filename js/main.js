(function() {

  var C = RetroMiner.Config;
  var S = RetroMiner.State;

  // --- Bootstrap DOM refs ---
  C.DOM.canvas = document.getElementById('game');
  C.DOM.ctx    = C.DOM.canvas.getContext('2d');

  // --- Game loop ---
  var lastTimestamp = 0;

  function gameLoop(timestamp) {
    // Delta time in seconds, capped at 100 ms to prevent spiral-of-death
    var dt = lastTimestamp ? Math.min((timestamp - lastTimestamp) / 1000, 0.1) : 0;
    lastTimestamp = timestamp;

    if (S.is(S.PLAYING)) {
      tick(dt);
    }

    // Always render (menu = map background, pause/game over = frozen state)
    RetroMiner.Render.render();

    requestAnimationFrame(gameLoop);
  }

  function tick(dt) {
    // 1. Input
    RetroMiner.Input.consumeMove();

    // 2. Timer (delta-based accumulation — no setInterval)
    S.accumulatedTime += dt;
    while (S.accumulatedTime >= 1.0) {
      S.accumulatedTime -= 1.0;
      S.timer -= 1;
    }
    if (S.timer <= 0) {
      S.timer = 0;
      RetroMiner.Entities.gameOver();
      return;  // timer expired — stop updating
    }

    // 3. Enemies
    RetroMiner.Entities.updateEnemies();
    if (!S.is(S.PLAYING)) return;  // player was caught

    // 4. Check level complete
    if (RetroMiner.Map.countGold() === 0) {
      S.level++;
      S.timer += C.TIME_BONUS;
      RetroMiner.Map.generate();
      RetroMiner.Entities.reset();
    }

    // 5. Animation tick
    RetroMiner.Render.tickAnimation();
  }

  // --- Initialize ---
  RetroMiner.Map.generate();
  RetroMiner.UI.init();
  requestAnimationFrame(gameLoop);

})();
