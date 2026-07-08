window.RetroMiner = window.RetroMiner || {};

(function(C) {

  // --- Grid constants ---
  C.TILE    = 16;
  C.COLS    = 20;
  C.ROWS    = 15;
  C.WIDTH   = 320;
  C.HEIGHT  = 240;

  // --- Gameplay tuning ---
  C.INIT_TIMER   = 60;
  C.TIME_BONUS   = 20;
  C.GOLD_PER_LEVEL = 6;
  C.GOLD_SCORE   = 10;
  C.ENEMY_TICK_INTERVAL = 15;
  C.AI_CHASE_CHANCE = 0.45;
  C.COMBO_WINDOW = 2000;
  C.COMBO_MULTIPLIER = 0.5;

  // --- UI ---
  C.SWIPE_THRESHOLD = 30;

  // --- DOM refs (populated by main.js) ---
  C.DOM = {};

})(RetroMiner.Config = {});
