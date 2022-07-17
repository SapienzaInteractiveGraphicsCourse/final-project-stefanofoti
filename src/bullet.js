class Bullet {

    constructor() {
        this.m = generateBullet(false);
        this.speed = 3;
        this.thrown = false;    
    }
 
    launchNextBullet() {
        for(let i = 0; i < 2; i++) {
            let bullet = bullets[i];
            if(!bullet.thrown) {
                this.launch(i);
                break;
            }
        }
    }

    launch(i) {
        bullets[i].m.position.x = helicopter.m.position.x;
        bullets[i].m.position.y = helicopter.m.position.y - 2.5;
        i%2 == 0 && (bullets[i].m.position.z = helicopter.m.position.z + 10);
        i%2 == 1 && (bullets[i].m.position.z = helicopter.m.position.z - 10);
        bullets[i].thrown = true;
        bullets[i].boom = false;
        bullets[i].pos = i;
        scene.add(bullets[i].m);
        i%2 == 0 && helicopter.m.remove(helicopter.bulletL);
        i%2 == 1 && helicopter.m.remove(helicopter.bulletR);
    }
    
    move(i) {
        let bullet = bullets[i];
        if(bullet.thrown){
            bullet.m.position.x += bullet.speed;
            let position = bullet.m.position.clone();
            position.x -= 10;
            effectsOn && new EffectsUtils().init(position, EFFECTS.BULLET_LAUNCH);
            if (bullet.m.position.x > 250) {
                scene.remove(bullet.m);
                i%2 == 0 && helicopter.m.add(helicopter.bulletL);
                i%2 == 1 && helicopter.m.add(helicopter.bulletR);
                bullet.thrown = false;
            }
        }
    }
}

function generateBullet(isHeli) {
    let gBullet = new THREE.CylinderGeometry(6, 6, 70, 33);
    let matBullet = new THREE.MeshPhongMaterial({ color: COLORS.red, flatShading: true });
    let bullet = new THREE.Mesh(gBullet, matBullet);
    isHeli && bullet.position.set(0, -10, 45);
    bullet.rotation.z = -Math.PI / 2;

    let points = [];
    for (let i = 0; i < 10; i++) {
        points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 7 + 0, ( i - 5 ) * 2 ) );
    }
    let gBulletHead = new THREE.LatheGeometry(points);
    let matBulletHead = new THREE.MeshPhongMaterial({ color: COLORS.darkGray, flatShading: true });
    let bulletHead = new THREE.Mesh(gBulletHead, matBulletHead);
    bulletHead.position.set(0, 40, 0);
    bulletHead.rotation.z = Math.PI;
    bullet.add(bulletHead);

    let gBulletTail = new THREE.BoxGeometry(20, 20, 2);
    let matBulletTail = new THREE.MeshPhongMaterial({ color: COLORS.darkGray, flatShading: true });
    
    
    let bTailItems = [];
    let bTailModel = new THREE.Mesh(gBulletTail, matBulletTail);
    for(let i = 0; i < 4; i++) {
        bTailItems[i] = bTailModel.clone();
        bTailItems[i].position.set(0, -33, 0);
        bTailItems[i].rotation.y = Math.PI/ 4 + i * Math.PI / 2;
        bullet.add(bTailItems[i]);
    }

    return bullet;
}

window.readyCount ? (window.readyCount++) : (window.readyCount = 1)