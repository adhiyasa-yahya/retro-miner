(function(S) {

  // --- Enum ---
  S.MENU      = 'MENU';
  S.PLAYING   = 'PLAYING';
  S.PAUSED    = 'PAUSED';
  S.GAME_OVER = 'GAME_OVER';

  // --- Current state ---
  var currentState = S.MENU;
  var previousState = null;

  // --- Transition table with guards ---
  var transitions = {};

  // MENU -> PLAYING
  transitions[S.MENU] = {};
  transitions[S.MENU][S.PLAYING] = function() {
    RetroMiner.Map.generate();
    RetroMiner.Entities.reset();
    S.timer = RetroMiner.Config.INIT_TIMER;
    S.score = 0;
    S.level = 1;
    S.combo = 0;
    S.lastGoldTime = 0;
    S.accumulatedTime = 0;
    return true;
  };

  // PLAYING -> PAUSED
  transitions[S.PLAYING] = {};
  transitions[S.PLAYING][S.PAUSED] = function() {
    previousState = S.PLAYING;
    return true;
  };

  // PAUSED -> PLAYING
  transitions[S.PAUSED] = {};
  transitions[S.PAUSED][S.PLAYING] = function() {
    return true;
  };

  // PLAYING -> GAME_OVER
  transitions[S.PLAYING][S.GAME_OVER] = function() {
    RetroMiner.UI.saveHighScore(S.score);
    return true;
  };

  // GAME_OVER -> MENU
  transitions[S.GAME_OVER] = {};
  transitions[S.GAME_OVER][S.MENU] = function() {
    return true;
  };

  S.transition = function(toState) {
    var t = transitions[currentState];
    if (t && t[toState] && t[toState]() !== false) {
      previousState = currentState;
      currentState = toState;
      RetroMiner.UI.syncOverlays(currentState);
      return true;
    }
    return false;
  };

  S.getState = function() { return currentState; };
  S.is = function(state) { return currentState === state; };

  // --- Game data (mutable) ---
  S.timer = RetroMiner.Config.INIT_TIMER;
  S.score = 0;
  S.level = 1;
  S.combo = 0;
  S.lastGoldTime = 0;
  S.accumulatedTime = 0;
  S.enemyTick = 0;
  S.playerX = 1;
  S.playerY = 1;
  S.enemies = [];

})(RetroMiner.State = {});
