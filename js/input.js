(function(I) {

  var C = RetroMiner.Config;
  var S = RetroMiner.State;

  // --- Key state ---
  var keys = {};

  // --- Keyboard ---
  document.addEventListener('keydown', function(e) {
    keys[e.key] = true;

    // State-driven actions
    if (e.key === 'Escape') {
      if (S.is(S.PLAYING)) { S.transition(S.PAUSED); e.preventDefault(); return; }
      if (S.is(S.PAUSED))  { S.transition(S.PLAYING); e.preventDefault(); return; }
    }

    if (e.key === 'Enter' || e.key === ' ') {
      if (S.is(S.MENU))      { S.transition(S.PLAYING); e.preventDefault(); return; }
      if (S.is(S.GAME_OVER)) { S.transition(S.MENU); e.preventDefault(); return; }
    }
  });

  document.addEventListener('keyup', function(e) {
    keys[e.key] = false;
  });

  // --- D-Pad (buttons) ---
  function setupDpad() {
    document.querySelectorAll('.btn').forEach(function(btn) {
      function press() {
        keys[btn.dataset.key] = true;
        btn.classList.add('active');
        if (navigator.vibrate) navigator.vibrate(15);
      }

      function release() {
        keys[btn.dataset.key] = false;
        btn.classList.remove('active');
      }

      btn.addEventListener('touchstart', function(e) { e.preventDefault(); press(); });
      btn.addEventListener('touchend',   function(e) { e.preventDefault(); release(); });
      btn.addEventListener('touchcancel', function(e) { release(); });
      btn.addEventListener('mousedown',  press);
      btn.addEventListener('mouseup',    release);
      btn.addEventListener('mouseleave', release);
    });
  }

  // --- Swipe gestures ---
  var touchStartX = 0;
  var touchStartY = 0;

  function setupSwipe() {
    var canvas = C.DOM.canvas;
    if (!canvas) return;

    canvas.addEventListener('touchstart', function(e) {
      var t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
    }, { passive: true });

    canvas.addEventListener('touchend', function(e) {
      var t = e.changedTouches[0];
      var dx = t.clientX - touchStartX;
      var dy = t.clientY - touchStartY;
      var absDx = Math.abs(dx);
      var absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) < C.SWIPE_THRESHOLD) {
        // Tap on canvas during MENU -> start game
        if (S.is(S.MENU)) {
          S.transition(S.PLAYING);
        }
        return;
      }

      if (absDx > absDy) {
        I.queueMove(dx > 0 ? 1 : -1, 0);
      } else {
        I.queueMove(0, dy > 0 ? 1 : -1);
      }
    }, { passive: true });
  }

  // Init inputs after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setupDpad();
      setupSwipe();
    });
  } else {
    setupDpad();
    setupSwipe();
  }

  // --- Input queue (one move per frame) ---
  var pendingMove = null;

  I.queueMove = function(dx, dy) {
    pendingMove = { dx: dx, dy: dy };
  };

  I.consumeMove = function() {
    // Keyboard input (one-shot per frame)
    var dx = 0, dy = 0;
    if (keys.ArrowUp)    { dy = -1; keys.ArrowUp = false; }
    if (keys.ArrowDown)  { dy = 1;  keys.ArrowDown = false; }
    if (keys.ArrowLeft)  { dx = -1; keys.ArrowLeft = false; }
    if (keys.ArrowRight) { dx = 1;  keys.ArrowRight = false; }

    // Swipe/button if no keyboard input this frame
    if (dx === 0 && dy === 0 && pendingMove) {
      dx = pendingMove.dx;
      dy = pendingMove.dy;
      pendingMove = null;
    }

    if (dx !== 0 || dy !== 0) {
      RetroMiner.Entities.movePlayer(dx, dy);
    }
  };

  I.resetKeys = function() {
    Object.keys(keys).forEach(function(k) { keys[k] = false; });
    pendingMove = null;
  };

})(RetroMiner.Input = {});
