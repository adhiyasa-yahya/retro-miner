(function(E) {

  var C = RetroMiner.Config;
  var R = RetroMiner.State;
  var Map = RetroMiner.Map;

  // --- Player ---

  E.movePlayer = function(dx, dy) {
    var nx = R.playerX + dx;
    var ny = R.playerY + dy;
    var tile = Map.get(nx, ny);

    if (tile === Map.WALL) return false;

    // Collect gold
    if (tile === Map.GOLD) {
      var now = performance.now();
      var timeSinceLastGold = now - R.lastGoldTime;
      R.lastGoldTime = now;

      if (timeSinceLastGold < C.COMBO_WINDOW) {
        R.combo++;
      } else {
        R.combo = 0;
      }

      R.score += C.GOLD_SCORE + Math.floor(C.GOLD_SCORE * C.COMBO_MULTIPLIER * R.combo);
      Map.set(nx, ny, Map.FLOOR);
    }

    R.playerX = nx;
    R.playerY = ny;

    // Check enemy collision after move
    for (var i = 0; i < R.enemies.length; i++) {
      if (R.enemies[i].x === nx && R.enemies[i].y === ny) {
        E.gameOver();
        return true;
      }
    }

    return true;
  };

  // --- Enemies ---

  E.updateEnemies = function() {
    R.enemyTick++;
    if (R.enemyTick < C.ENEMY_TICK_INTERVAL) return;
    R.enemyTick = 0;

    for (var i = 0; i < R.enemies.length; i++) {
      var e = R.enemies[i];

      // Four directions: up, down, left, right
      var dirs = [
        [0, -1], [0, 1], [-1, 0], [1, 0]
      ];

      // AI: 45% chance to chase player
      if (Math.random() < C.AI_CHASE_CHANCE) {
        dirs.sort(function(a, b) {
          var da = Math.abs(R.playerX - (e.x + a[0])) + Math.abs(R.playerY - (e.y + a[1]));
          var db = Math.abs(R.playerX - (e.x + b[0])) + Math.abs(R.playerY - (e.y + b[1]));
          return da - db;
        });
      } else {
        // Random shuffle (Fisher-Yates)
        for (var j = dirs.length - 1; j > 0; j--) {
          var k = Math.floor(Math.random() * (j + 1));
          var tmp = dirs[j];
          dirs[j] = dirs[k];
          dirs[k] = tmp;
        }
      }

      // Try directions in order
      for (var d = 0; d < dirs.length; d++) {
        var nx = e.x + dirs[d][0];
        var ny = e.y + dirs[d][1];
        if (Map.isWalkable(nx, ny)) {
          e.x = nx;
          e.y = ny;
          break;
        }
      }

      // Collision check with player
      if (e.x === R.playerX && e.y === R.playerY) {
        E.gameOver();
        // Don't return — let all enemies finish their move for consistency
      }
    }
  };

  E.gameOver = function() {
    R.transition(R.GAME_OVER);
  };

  E.reset = function() {
    R.enemyTick = 0;
  };

})(RetroMiner.Entities = {});
