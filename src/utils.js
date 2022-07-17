function getRandom(min = 0, max = 1) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function updateScores() {
    if(!game) {
        $("#idNewRecord").hide()
        return;
    }
    if(game.hit >= game.maxHit && game.hit > 0) {
        game.maxHit = game.hit;
        $("#idNewRecord").show()
    } else {
        $("#idNewRecord").hide()
    }
    $("#idCurrent").text('Current: ' + game.hit)
    $("#idBest").text('Best: ' + game.maxHit)
}

function openFullscreen() {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
  }


window.readyCount ? (window.readyCount++) : (window.readyCount = 1)