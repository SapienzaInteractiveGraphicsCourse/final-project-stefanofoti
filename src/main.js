const COLORS = {
    blue: 0x0c5a96,
    black: 0x000000,
    cocomeroGreen: 0x18945e,
    green: 0x03ac13,
    red: 0xff0000,
    yellow: 0xffff00,
    orange: 0xff8303,
    gray: 0x55565b,
    darkGray: 0x2b2b2e,
};

const SPEEDS = {
    SLOW: 0.05,
    MEDIUM: 0.1,
    FAST: 0.15
}

const CONTROLS = {
    MOUSE: 1,
    WASD: 2,
}

const DIFFICULTY = {
    EASY: 2,
    MEDIUM: 5,
    HARD: 8
}

const HEALTH = {
    CRASH: 7,
    MISS: 2
}

const EFFECTS = {
    EXPLOSION: 0,
    BULLET_LAUNCH: 1,
    HELI_MOVING: 2,
    HELI_CRASH: 3
}

const NUM_COMP = 9;

// core
let scene, camera, webGlRenderer;

// lights
let directionalLight, ambientLight;

// classes
let sky, helicopter, game, health;
let meloons = [], meloonsObj;
let bullets = [];

let pointer = new THREE.Vector2(0, 1);

// to manage wasd commands 
let keyW = false;
let keyA = false;
let keyS = false;
let keyD = false;

// customization (defaults)
let helicopterMaxSpeed = SPEEDS.MEDIUM;
let helicopterColor = COLORS.orange;
let chosenControls = CONTROLS.MOUSE;
let obstacleSize = 10;
let difficulty = DIFFICULTY.MEDIUM;

let effectsOn = true;
let soundsOn = true;
let musicOn = true;
let helicopterSound, musicSound;

let readyCount = 0;

function init() {
    initScene();
    initCamera();
    initRenderer();
    initListeners();
    initControls();
    initLights();
    initMeloons();
    initHealth();
    initClouds();
    initBullets();
    initGame();
    loop();
}



// Scene initialization
function initScene() {
    scene = new THREE.Scene();
    let fog = new THREE.Fog(COLORS.gray, 0, 1000);
    scene.fog = fog;
}

function initCamera() {
    let ratio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(50, ratio, 1, 1000);
    camera.position.set(0,100,220);
}

function initRenderer() {
    webGlRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    webGlRenderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(webGlRenderer.domElement);
}

// Init listeners for mouse movements and window resize 
function initListeners() {
    window.addEventListener('resize', resizeHandler);
    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('click', clickHandler);
    window.addEventListener("keydown", onKeyDown, false);
    window.addEventListener("keyup", onKeyUp, false);
}

// controls in the customization form
function initControls() {
    $("#startBtn").click(() => {
        effectsOn = $("#idCheckboxEffects").prop('checked');
        soundsOn = $("#idSounds").prop('checked');
        musicOn = $("#idMusic").prop('checked');    
        initHeli();
        game.start()
    })
    $("input[name='radioColor']").click(function(){
        let radioValue = $("input[name='radioColor']:checked")[0].id;
        switch (radioValue) {
            case "idGreen":
                helicopterColor = COLORS.green;                
                break; 
            case "idOrange":
                helicopterColor = COLORS.orange;                
                    break;        
            default:
                helicopterColor = COLORS.yellow;                
                break;
        }
    });
    $("input[name='radioControls']").click(function(){
        let radioValue = $("input[name='radioControls']:checked")[0].id;
        switch (radioValue) {
            case "idWasd":
                chosenControls = CONTROLS.WASD;                
                break;
            default:
                chosenControls = CONTROLS.MOUSE;                
                break;
        }
    });

    $("#idObstacleSize").on("input change",(e)=>{
        obstacleSize = e.target.value;
    });
    $("#idSpeed").on("input change",(e)=>{
        helicopterMaxSpeed = e.target.value;
    });
    $("#idDifficulty").on("input change",(e)=>{
        difficulty = e.target.value;
    });
}

function onKeyDown(event) {
    let keyCode = event.keyCode;
    if(!game.started) {
        return;
    }
    switch (keyCode) {
        case 68: //d
            keyD = true;
            break;
        case 83: //s
            keyS = true;
            break;
        case 65: //a
            keyA = true;
            break;
        case 87: //w
            keyW = true;
            break;
        case 32: //space
            bullets[0].launchNextBullet();
            break;

    }
}

function onKeyUp(event) {
    let keyCode = event.keyCode;

    switch (keyCode) {
        case 68: //d
            keyD = false;
            break;
        case 83: //s
            keyS = false;
            break;
        case 65: //a
            keyA = false;
            break;
        case 87: //w
            keyW = false;
            break;
    }
}


function mouseMoveHandler(event) {
    if (chosenControls === CONTROLS.MOUSE) {
        let tx = -200 + (event.clientX / window.innerWidth) * 200 * 2;
        let ty = 200 - (event.clientY / window.innerHeight) * 200;
        pointer.set(tx, ty);
    }
}

function updatePosition() {
    if (chosenControls === CONTROLS.WASD) {
        keyA && pointer.x > -200 && (pointer.x -= 4);
        keyD && pointer.x < 200 && (pointer.x += 4);
        keyW && pointer.y < 200 && (pointer.y += 4);
        keyS && pointer.y > 0 && (pointer.y -= 4);
    }
}

function clickHandler() {
    game.started && bullets[0].launchNextBullet();
}

function resizeHandler() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    webGlRenderer.setSize(window.innerWidth, window.innerHeight);
}

// Lights 
function initLights() {
    directionalLight = new THREE.DirectionalLight(0xffffff, .9);
    directionalLight.position.set(150, 350, 400);
    ambientLight = new THREE.AmbientLight(0xeeeeee, .5);

    scene.add(directionalLight);
    scene.add(ambientLight);
}

function initHeli() {
    helicopter = new Helicopter();
}

function initClouds() {
    sky = new Sky();
    scene.add(sky.m);
}

function initMeloons() {
    meloonsObj = new Meloons();
    scene.add(meloonsObj.m);
}

function initBullets() {
    initBullet(0);
    initBullet(1);
}

function initBullet(i) {
    let bullet = new Bullet(i);
    bullet.m.scale.set(0.25, 0.25, 0.25);
    bullets.push(bullet);
}


function initHealth() {
    health = new Health();
}

function initGame() {
    game = new Game();
}

function loop() {
    sky.moveClouds();
    if (game.started) {
        updatePosition();
        helicopter.update();
        bullets[0].thrown && bullets[0].move(0);
        bullets[1].thrown && bullets[1].move(1);
        meloonsObj.initMeloons();
        meloonsObj.move();
    }
    TWEEN.update();
    webGlRenderer.render(scene, camera);
    requestAnimationFrame(loop);
}

const checkExist = setInterval(() => {
    if (window.readyCount === NUM_COMP) {
        clearInterval(checkExist);
        init();
    }
}, 100);


setInterval(() => {
    window.readyCount !== NUM_COMP && init();
}, 3000);
