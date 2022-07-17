class Game {
    constructor() {
        this.hit = 0;
        this.maxHit = 0;
        updateScores();
        this.started = false;
    }


    newHit() {
        this.hit++;
        soundsOn && this.explSound.play();
        updateScores();
    }

    restart() {
        this.hit = 0;
        updateScores();
    }

    start() {
        openFullscreen();
        $("body").addClass("playing")
        if(soundsOn) {
            helicopterSound = new Howl({
                src: ['assets/helicopter.mp3'],
                loop: true,
                volume: 0.6,
            });
            this.explSound = new Howl({
                src: ['assets/explosion.wav'],
                volume: 0.8,
            });
            helicopterSound.play();
        } else {
            helicopterSound && helicopterSound.stop();
        }

        if(musicOn) {
            musicSound = new Howl({
                src: ['assets/music.mp3'],
                loop: true,
                volume: 0.8
            });
            musicSound.play();
        } else {
            musicSound && musicSound.stop()
        }

        this.started = true;
        $("#controls").hide();
        health.restore();
        this.restart();
        scene.add(helicopter.m);
    }

    end() {
        $("body").removeClass("playing")
        this.started = false;
        helicopter.gameOver();
        scene.remove(bullets[0].m);
        scene.remove(bullets[1].m);
        meloonsObj.removeMeloons();
        helicopterSound && helicopterSound.stop();
        musicSound && musicSound.stop();
        $("#controls").show();
    }
}

window.readyCount ? (window.readyCount++) : (window.readyCount = 1)