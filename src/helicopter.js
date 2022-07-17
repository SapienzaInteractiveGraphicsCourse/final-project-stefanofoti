class Helicopter {
    constructor() {
        this.m = new THREE.Object3D();
        let cabin = this.getCabin();
        const windows = this.getWindows();
        windows.forEach(w => cabin.add(w));        
        cabin.add(this.getTail());
        cabin.add(this.getHelix());
        cabin.add(this.getBasement());
        cabin.add(this.getBulletsSupport());
        this.bulletL = generateBullet(true);
        this.bulletR = generateBullet(true);
        this.bulletR.position.set(0, -10, -45);
        this.m.add(this.bulletL);
        this.m.add(this.bulletR);
        this.m.add(cabin);
        this.m.scale.set(0.3, 0.3, 0.3);
    }

    getBulletsSupport() {
        let gBulletsHolder = new THREE.BoxGeometry(20, 5, 90);
        let matBulletsHolder = new THREE.MeshPhongMaterial({ color: COLORS.black, flatShading: true });
        let bulletsHolder = new THREE.Mesh(gBulletsHolder, matBulletsHolder);
        bulletsHolder.position.set(0, -9, 0);
        return bulletsHolder;
    }

    getBasement() {
        let basement = new THREE.Object3D();

        let matBasement = new THREE.MeshPhongMaterial({ color: COLORS.darkGray, flatShading: true });

        // basament supports connecting the helicopter
        let gBasementStand = new THREE.CylinderGeometry(6, 2, 30, 6);
        let basementBackRight = new THREE.Mesh(gBasementStand, matBasement);
        basementBackRight.position.set(-15, -30, 25);
        basementBackRight.rotation.x = -Math.PI / 6;
        basementBackRight.rotation.z = -Math.PI / 6;
        let basementFrontRight = new THREE.Mesh(gBasementStand, matBasement);
        basementFrontRight.position.set(15, -30, 25);
        basementFrontRight.rotation.x = -Math.PI / 6;
        basementFrontRight.rotation.z = +Math.PI / 6;

        let basementBackLeft = new THREE.Mesh(gBasementStand, matBasement);
        basementBackLeft.position.set(-15, -30, -25);
        basementBackLeft.rotation.x = Math.PI / 6;
        basementBackLeft.rotation.z = -Math.PI / 6;
        
        let basementFrontLeft = new THREE.Mesh(gBasementStand, matBasement);
        basementFrontLeft.position.set(+15, -30, -25);
        basementFrontLeft.rotation.x = Math.PI / 6;
        basementFrontLeft.rotation.z = +Math.PI / 6;

        basement.add(basementBackRight);
        basement.add(basementFrontRight);
        basement.add(basementBackLeft);
        basement.add(basementFrontLeft);


        // basement cylinders
        let gBasement = new THREE.CylinderGeometry(5, 5, 120, 6);
        let basementL = new THREE.Mesh(gBasement, matBasement);
        basementL.position.set(5, -42, 32);
        basementL.rotation.z = Math.PI/2;
        let basementR = basementL.clone();
        basementR.position.set(5, -42, -32);
        basement.add(basementL);
        basement.add(basementR);
        return basement;
    }


    getHelix() {
        let gHelix = new THREE.BoxGeometry(10, 21, 10);
        let matHelix = new THREE.MeshPhongMaterial({ color: COLORS.gray, flatShading: true });
        this.helix = new THREE.Mesh(gHelix, matHelix);

        let gBlade = new THREE.BoxGeometry(220, 2, 20);
        let matBlade = new THREE.MeshPhongMaterial({ color: COLORS.darkGray, flatShading: true });

        let blade = new THREE.Mesh(gBlade, matBlade);
        blade.position.set(0, 10, 0);

        let bladePerpendicular = blade.clone();
        bladePerpendicular.rotation.y = Math.PI/2

        this.helix.add(bladePerpendicular);
        this.helix.add(blade);
        
        this.helix.position.y = 35;
        return this.helix;
    }

    getCabin() {
        // Cabina
        const gCabin = new THREE.DodecahedronGeometry(40, 0)
        let matCabin = new THREE.MeshPhongMaterial({ color: helicopterColor, flatShading: true });
        let cabin = new THREE.Mesh(gCabin, matCabin);
        return cabin;
    }

    getWindows() {
        // windows common
        let matWindows = new THREE.MeshPhongMaterial({ color: COLORS.blue, flatShading: true, transparent: true, opacity: .8 });

        // Side windows
        let gSideWindows = new THREE.BoxGeometry(40, 20, 75);

        let sideWindows = new THREE.Mesh(gSideWindows, matWindows);
        sideWindows.position.set(0, 10, 0);

        // front window

        let pointsArray = [];
        for ( let i = 0; i < 10; i ++ ) {
            pointsArray.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 20, ( i - 5 ) * 1 ) );
        }
        const g = new THREE.LatheGeometry( pointsArray );
        let frontWindow = new THREE.Mesh( g, matWindows );
        frontWindow.position.set(30, 19, 0);
        frontWindow.rotation.set(0,0,2.08);

        return [sideWindows, frontWindow];        
    }

    getTail() {
        // tail
        let matTail = new THREE.MeshPhongMaterial({ color: helicopterColor, flatShading: true });

        let gTail = new THREE.BoxGeometry(120, 15, 15);
        let tail = new THREE.Mesh(gTail, matTail);
        
        let gTailVertical = new THREE.BoxGeometry(10, 25, 15);
        let tailVertical = new THREE.Mesh(gTailVertical, matTail);

        tailVertical.position.set(-60, 15, 0);
        tailVertical.rotation.set(0, 0, 0.4);

        tail.add(tailVertical);

        let gTailWing = new THREE.BoxGeometry(45, 7, 3);
        let matTailWing = new THREE.MeshPhongMaterial({ color: COLORS.darkGray, flatShading: true });
        this.tailWing = new THREE.Mesh(gTailWing, matTailWing);

        let tailWingPerpendicular = this.tailWing.clone();
        tailWingPerpendicular.rotation.set(0,0,Math.PI/2);
        this.tailWing.add(tailWingPerpendicular);

        this.tailWing.position.set(-62, 20, 0);
        
        tail.add(this.tailWing);

        tail.position.set(-70, 0, 0);
        return tail;
    }

    update() {

        let targetY = pointer.y;
        let targetX = pointer.x;

        // delta of the distance between the helicopter and desired position
        const deltaX = targetX - helicopter.m.position.x;
        const deltaY = targetY - helicopter.m.position.y;
        
        const speedX = 0.5 + Math.abs(deltaX)*helicopterMaxSpeed;
        const speedY = 0.5 + Math.abs(deltaY)*helicopterMaxSpeed;

        deltaX < -1 && (helicopter.m.position.x -= speedX);
        deltaX > 1 && (helicopter.m.position.x += speedX);
        deltaY < -1 && (helicopter.m.position.y -= speedY);
        deltaY > 1 && (helicopter.m.position.y += speedY);

        // exhaust gas effect
        if((chosenControls === CONTROLS.MOUSE && (speedX > 8 || speedY > 8)) ||
            (chosenControls === CONTROLS.WASD && (speedX > 3 || speedY > 3))) {
            effectsOn && new EffectsUtils().init(helicopter.m.position, EFFECTS.HELI_MOVING);
        }

        // rotation of the helicopter, proportional to the distance between helicopter current position and target position 
        effectsOn && (helicopter.m.rotation.x = -deltaY * 0.01);
        effectsOn && (helicopter.m.rotation.z = -deltaX * 0.005);

        // rotation of tail wing and main wing
        helicopter.helix.rotation.y += Math.min(1/speedX*0.1,1/speedY*0.1);
        helicopter.tailWing.rotation.z += 0.1;

    }

    gameOver() {
        new TWEEN.Tween(this.m.rotation)
        .to({ x: Math.PI/6, y: Math.PI/6 }, 3000)
        .easing(TWEEN.Easing.Circular.InOut)
        .start();
    
        new TWEEN.Tween(this.m.position)
            .to({
                x: 0,
                y: -30
            }, 3000)
            .onComplete(() => {
                scene.remove(this.m);
            })
            .start();
    }

}


window.readyCount ? (window.readyCount++) : (window.readyCount = 1)