class Meloons {
    constructor() {
        this.m = new THREE.Object3D();
    }

    initMeloons() {
        for (let i = 0; i < difficulty; i++) {
            if(meloons.length >= difficulty) {
                break;
            }
            let meloon = new Meloon();    
            meloon.m.position.y = 50 + getRandomInt(0, 80);
            meloon.m.position.x = 200 + getRandomInt(0, 60);
            this.m.add(meloon.m);
            meloons.push(meloon);
        }
    }
    
    move() {
        for(let i = 0; i < meloons.length; i++) {
            let meloon = meloons[i];
            
            if(!meloon.m.isMoving){
                meloon.m.isMoving = true;
                let oldX = meloon.m.position.x;
                let oldY = meloon.m.position.y;
                var cx = oldX - getRandomInt(20*difficulty/2,60*difficulty/2);
                var cy;
                if(oldY < 100) {
                    cy = getRandomInt(oldY, 200)
                } else {
                    cy = getRandomInt(0, oldY)
                }
                new TWEEN.Tween(meloon.m.position)
                .to({x:cx, y:cy}, 2000)
                .onComplete(() => {
                    meloon.m.isMoving = false;
                })
                .start()
            }
            bullets.filter(b => b.thrown).forEach(bullet => {
                let diff = bullet.m.position.clone().sub(meloon.m.position.clone());
                let dBullet = diff.length();
                if (dBullet < 2*obstacleSize) {
                    effectsOn && new EffectsUtils().init(meloons[i].m.position, EFFECTS.EXPLOSION);
                    this.m.remove(meloons[i].m);
                    meloons.splice(i, 1);
                    scene.remove(bullet.m);
                    bullet.thrown = false;
                    bullet.pos%2 == 0 && helicopter.m.add(helicopter.bulletL);
                    bullet.pos%2 == 1 && helicopter.m.add(helicopter.bulletR);
                    game.newHit();
                }
            })

            let hPos = helicopter.m.position.clone();
            let ePos = meloon.m.position.clone();
            let heDiff = hPos.sub(ePos).length();
            
            if (heDiff < 2*obstacleSize) {
                // meloon crash
                effectsOn && new EffectsUtils().init(meloon.m.position, EFFECTS.HELI_CRASH);
                this.removeMeloon(i);
                health.reduceHealth(HEALTH.CRASH);
                game.newHit();
            } else if (meloon.m.position.x < -250) {
                // melon out
                health.reduceHealth(HEALTH.MISS);
                this.removeMeloon(i);
            }
        }
    }
    
    removeMeloon(i) {
        if(meloons[i]) {
            this.m.remove(meloons[i].m);
        }
        meloons.splice(i, 1);
    }

    removeMeloons() {
        meloons.forEach(meloon => this.m.remove(meloon.m))
        meloons.splice(0, meloons.length);
    }    

}

class Meloon {
    constructor() {
        const g = new THREE.SphereGeometry(obstacleSize, obstacleSize, obstacleSize);
        const texture = new THREE.TextureLoader().load( "assets/texture_wm.jpg" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 1, 1);
        const mat = new THREE.MeshPhongMaterial({
            map: texture,
            flatShading: true
        });
        this.m = new THREE.Mesh(g, mat);
    
    }
}


window.readyCount ? (window.readyCount++) : (window.readyCount = 1)