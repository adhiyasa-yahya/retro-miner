(function(U) {

  var HS_KEY = 'retrominer_highscore';

  // --- High Score (localStorage with fallback) ---

  U.getHighScore = function() {
    try {
      return parseInt(localStorage.getItem(HS_KEY)) || 0;
    } catch (_) { return 0; }
  };

  U.saveHighScore = function(score) {
    var current = U.getHighScore();
    if (score > current) {
      try { localStorage.setItem(HS_KEY, String(score)); } catch (_) {}
      return true;
    }
    return false;
  };

  // --- Overlay sync ---

  U.syncOverlays = function(state) {
    var menu    = document.getElementById('menu-overlay');
    var pause   = document.getElementById('pause-overlay');
    var gameover = document.getElementById('gameover-overlay');

    // Hide all
    menu.classList.add('hidden');
    menu.classList.remove('visible');
    pause.classList.add('hidden');
    pause.classList.remove('visible');
    gameover.classList.add('hidden');
    gameover.classList.remove('visible');

    switch (state) {

      case 'MENU':
        document.getElementById('menu-hs').textContent = U.getHighScore();
        menu.classList.remove('hidden');
        menu.classList.add('visible');
        break;

      case 'PAUSED':
        pause.classList.remove('hidden');
        pause.classList.add('visible');
        break;

      case 'GAME_OVER': {
        var finalScore = RetroMiner.State.score;
        var isNew = U.saveHighScore(finalScore);

        document.getElementById('final-score').textContent = finalScore;
        document.getElementById('gameover-hs').textContent = U.getHighScore();

        var hsMsg = document.getElementById('new-hs-msg');
        if (isNew) {
          hsMsg.classList.remove('hidden');
        } else {
          hsMsg.classList.add('hidden');
        }

        gameover.classList.remove('hidden');
        gameover.classList.add('visible');
        break;
      }

      // case 'PLAYING': all hidden — already handled above
    }
  };

  U.init = function() {
    // Show current high score on menu
    document.getElementById('menu-hs').textContent = U.getHighScore();

    // Wire overlay buttons
    document.getElementById('btn-start').addEventListener('click', function() {
      RetroMiner.State.transition(RetroMiner.State.PLAYING);
    });

    document.getElementById('btn-restart').addEventListener('click', function() {
      RetroMiner.State.transition(RetroMiner.State.MENU);
    });
  };

})(RetroMiner.UI = {});
