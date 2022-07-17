class Cloud {
    constructor() {
        this.m = new THREE.Object3D();
        const texture = new THREE.TextureLoader().load( "assets/clouds.webp" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 1, 1);
        this.mat = new THREE.MeshPhongMaterial({
            map: texture,
            flatShading: true
        });

        this.rebase();

        this.g = new THREE.DodecahedronGeometry(getRandomInt(20,40), 0)
        let amount = getRandomInt(3,10);
        for (let i = 0; i < amount; i++) {
            let m = new THREE.Mesh(this.g, this.mat);
            m.position.x = i * 10 + getRandomInt(0,10);
            m.position.y = getRandom(0,25);
            m.position.z = getRandom(0,25);
            let s = 0.25 + getRandom(0.3,0.75);
            m.scale.set(s, s, s);
            this.m.add(m);
        }
    }

    rebase() {
        this.m.position.y = getRandomInt(-500,500);
        // put back the cloud
        this.m.position.x = getRandomInt(800, 1000);
        this.m.position.z = getRandomInt(-200,-400);
    }
}

window.readyCount ? (window.readyCount++) : (window.readyCount = 1)