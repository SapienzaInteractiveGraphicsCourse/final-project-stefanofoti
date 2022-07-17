class Sky {

    constructor() {
        this.m = new THREE.Object3D();
        this.clouds = [];
        this.amount = getRandomInt(3,20);
        
        for (let i = 0; i < this.amount; i++) {
            let c = new Cloud();
            this.clouds.push(c);    
            this.m.add(c.m);
        }
    }

    fallLostMatch() {
        for (let i = 0; i < this.amount; i++) {
            this.clouds[i].m.position.y += 5;
        } 
    }

    moveClouds() {
        if(!game.started && game.hit !== 0) {
            this.fallLostMatch();
            return;
        }
        for (let i = 0; i < this.amount; i++) {
            let c = this.clouds[i];
            c.m.position.x -= 1;
            c.m.position.x < -800 && c.rebase();
        }
    } 
}

window.readyCount ? (window.readyCount++) : (window.readyCount = 1)