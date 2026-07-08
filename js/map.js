(function(M) {

  var C = RetroMiner.Config;
  var R = RetroMiner.State;

  var WALL  = '#';
  var FLOOR = '.';
  var GOLD  = '$';

  var map = [];

  M.init = function() {
    map = [];
    for (var y = 0; y < C.ROWS; y++) {
      var row = [];
      for (var x = 0; x < C.COLS; x++) {
        if (
          x === 0 || y === 0 ||
          x === C.COLS - 1 || y === C.ROWS - 1 ||
          Math.random() < 0.12
        ) {
          row.push(WALL);
        } else {
          row.push(FLOOR);
        }
      }
      map.push(row);
    }
  };

  M.get = function(x, y) {
    return (map[y] && map[y][x]) || WALL;
  };

  M.isWalkable = function(x, y) {
    return this.get(x, y) !== WALL;
  };

  M.set = function(x, y, ch) {
    if (map[y] && map[y][x] !== undefined) map[y][x] = ch;
  };

  M.getMap = function() { return map; };

  M.WALL  = WALL;
  M.FLOOR = FLOOR;
  M.GOLD  = GOLD;

  M.generate = function() {
    // 1. Build walls
    M.init();

    // 2. Place player at (1,1)
    R.playerX = 1;
    R.playerY = 1;

    // Set of occupied cells (player, enemies, gold)
    var occupied = {};
    occupied['1,1'] = true;

    // 3. Spawn enemies (avoid player & each other)
    R.enemies = [];
    for (var i = 0; i < R.level; i++) {
      var ex, ey, ekey;
      var attempts = 0;
      do {
        ex = 1 + Math.floor(Math.random() * (C.COLS - 2));
        ey = 1 + Math.floor(Math.random() * (C.ROWS - 2));
        ekey = ex + ',' + ey;
        attempts++;
        if (attempts > 200) break;
      } while (map[ey][ex] !== FLOOR || occupied[ekey]);

      if (attempts <= 200) {
        occupied[ekey] = true;
        R.enemies.push({ x: ex, y: ey });
      }
    }

    // 4. Spawn gold (avoid occupied cells)
    for (var gi = 0; gi < C.GOLD_PER_LEVEL; gi++) {
      var gx, gy, gkey;
      var gattempts = 0;
      do {
        gx = 1 + Math.floor(Math.random() * (C.COLS - 2));
        gy = 1 + Math.floor(Math.random() * (C.ROWS - 2));
        gkey = gx + ',' + gy;
        gattempts++;
        if (gattempts > 200) break;
      } while (map[gy][gx] !== FLOOR || occupied[gkey]);

      if (gattempts <= 200) {
        occupied[gkey] = true;
        map[gy][gx] = GOLD;
      }
    }
  };

  M.countGold = function() {
    var count = 0;
    for (var y = 0; y < C.ROWS; y++)
      for (var x = 0; x < C.COLS; x++)
        if (map[y][x] === GOLD) count++;
    return count;
  };

})(RetroMiner.Map = {});
