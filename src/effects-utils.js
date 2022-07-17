class CustomItem {
    constructor(type) {
        let g;
        switch (type) {
            case EFFECTS.EXPLOSION:
                g = new THREE.IcosahedronGeometry(10, 0);
                break;
            case EFFECTS.BULLET_LAUNCH:
                g =  new THREE.PlaneGeometry( 7, 3 )
                break;
            case EFFECTS.HELI_MOVING:
                g =  new THREE.PlaneGeometry(4, 2)
                break;
            case EFFECTS.HELI_CRASH:
                g =  new THREE.IcosahedronGeometry(10, 0)
                break;
            default:
                return;
        }
        let mat = new THREE.MeshPhongMaterial({
            specular: 0xffffff,
            flatShading: true
        });
        this.m = new THREE.Mesh(g, mat);
    }

    explode(p, type) {
        let context = this;
        let targetX;
        let targetY;
        let noise = getRandom();
        switch (type) {
            case EFFECTS.EXPLOSION:
                targetX = p.x + getRandom(-30,30);
                targetY = p.y + getRandom(-30,30);
                this.m.material.color = new THREE.Color(getRandom() < 0.5 ?  COLORS.cocomeroGreen : COLORS.red);
                this.m.scale.set(2.2, 2.2, 2.2);
                break;
            case EFFECTS.BULLET_LAUNCH:
                noise*=70;
                targetX = p.x + getRandom(-1,1);
                targetY = p.y + getRandom(-40,40);
                this.m.material.color = new THREE.Color(COLORS.red);
                break;
            case EFFECTS.HELI_MOVING:
                noise*=60;
                targetX = p.x + getRandom(-30,30);
                targetY = p.y +  getRandom(-20,30);
                this.m.material.color = new THREE.Color(COLORS.black);
                break;
            case EFFECTS.HELI_CRASH:
                targetX = p.x + getRandom(-1,1);
                targetY = p.y + getRandom(-1,1);
                this.m.material.color = new THREE.Color(getRandom() < 0.7 ?  helicopterColor : COLORS.cocomeroGreen);
                this.m.scale.set(2.1, 2.1, 2.1);
                break;
            default:
                break;
        }

        if(!this.active)  {
            this.active = true;
            new TWEEN.Tween(this.m.rotation)
                .to({ x: getRandom() * Math.PI, y: getRandom() * Math.PI }, 200)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
            
            new TWEEN.Tween(this.m.scale)
                .to({ x: 0.01, y: 0.01, z: 0.01 }, 1500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();

            new TWEEN.Tween(this.m.position)
                .to({
                    x: targetX,
                    y: targetY
                }, 1000)
                .easing(TWEEN.Easing.Sinusoidal.Out)
                .onComplete(() => {
                    context.m.parent && context.m.parent.remove(context.m);
                })
                .start();
        }
    }

}


class EffectsUtils {
    constructor() {
        this.m = new THREE.Object3D();
        scene.add(this.m);
    }

    init (p, type) {
        let amount
        switch (type) {
            case EFFECTS.EXPLOSION:
                amount = 10;
                break;
            case EFFECTS.BULLET_LAUNCH:
                amount = 5;
                break;
            case EFFECTS.HELI_MOVING:
                amount = 20;
                break;
            case EFFECTS.HELI_CRASH:
                amount = 10;
                break;
            default:
                return;
        }
        for (let i = 0; i < amount; i++) {
            let item = new CustomItem(type);
            this.m.add(item.m);
            item.m.position.set(p.x, p.y, p.z);
            item.explode(p, type);
        }
    }

}

window.readyCount ? (window.readyCount++) : (window.readyCount = 1)