/* import * as THREE from './build/three.module.js';
import { PointerLockControls } from './js/PointerLockControls.js';
import * as parser from './js/parser.js'; */
//import { KeyboardControls } from './js/controleur.js';


//#region Variable
var temps = 0.0;
var dt;
var chrono = null;
var annuaire = null;
var scene = null;
var renderer = null;
var camera = null;

var listener = null;
var sound = null;
var sound1 = null;

var controls = null;
var windowHalfX = window.innerWidth / 2.0;
var windowHalfY = window.innerHeight / 2.0;

var pointeur;

var mouseX = 0.0;
var mouseY = 0.0;

var data;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var vertex = new THREE.Vector3();
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

//#endregion

//#region Initialisation
function init() {

	chrono = new THREE.Clock();

	annuaire = {};

	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	scene = new THREE.Scene();
	enregistrerDansAnnuaire("scene", scene);

	camera = new THREE.PerspectiveCamera(70.0, window.innerWidth / window.innerHeight, 0.1, 100.0);
	camera.position.set(0, 1.7, 10.0);
	camera.lookAt(new THREE.Vector3(0.0, 1.7, 0.0));

	listener = new THREE.AudioListener();
	camera.add(listener);

	window.addEventListener('resize', function () {
		windowHalfX = window.innerWidth / 2.0;
		windowHalfY = window.innerHeight / 2.0;
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);

	});

	controls = new PointerLockControls(camera);

	var blocker = document.getElementById('blocker');
	var instructions = document.getElementById('instructions');
	instructions.addEventListener('click', function () {
		controls.lock();
	}, false);

	controls.addEventListener('lock', function () {
		instructions.style.display = 'none';
		blocker.style.display = 'none';
	});
	controls.addEventListener('unlock', function () {
		blocker.style.display = 'block';
		instructions.style.display = '';
	});

	//controls = new KeyboardControls(camera);
	console.log(controls);

	window.addEventListener('keydown', keyDown, false);
	window.addEventListener('keyup', keyUp, false);
	window.addEventListener('mousemove', mouseMove, false);
	window.addEventListener('mousedown', mouseDown, false);

	chrono.start();

};
//#endregion

//#region Méthode
function enregistrerDansAnnuaire(nom, objet) {
	annuaire[nom] = objet;
}

function chercherDansAnnuaire(nom, defaut) {
	return (annuaire[nom] || defaut);
}


function creerScene() {

	//scene.add(creerSoleil()) ; 
	pointeur = creerSphere("pointeur", 0.05, 16, materiauRouge);
	scene.add(pointeur);

	//parser() ;
	chargerDocument();
	console.log("Fin de création de la scène");
}


function animate() {

	/* raycaster.ray.origin.copy(controls.getObject().position);
	raycaster.ray.origin.y -= 10;
		var intersections = raycaster.intersectObjects(objects);
		var onObject = intersections.length > 0;
	var time = performance.now();
	var delta = (time - prevTime) / 1000;
	velocity.x -= velocity.x * 10.0 * delta;
	velocity.z -= velocity.z * 10.0 * delta;
	velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
	direction.z = Number(moveForward) - Number(moveBackward);
	direction.x = Number(moveRight) - Number(moveLeft);
	direction.normalize(); // this ensures consistent movements in all directions
	if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
	if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;
		if (onObject === true) {
			velocity.y = Math.max(0, velocity.y);
			canJump = true;
		}
	controls.moveRight(- velocity.x * delta);
	controls.moveForward(- velocity.z * delta);
	controls.getObject().position.y += (velocity.y * delta); // new behavior
	if (controls.getObject().position.y < 10) {
		velocity.y = 0;
		controls.getObject().position.y = 10;
		canJump = true;
	}
	prevTime = time; */



	dt = chrono.getDelta();
	temps += dt;
	requestAnimationFrame(animate);
	controls.update(dt);
	renderer.render(scene, camera);
}
//#endregion

/*
init();
creerScene();
animate(); */
/*
export { camera }; */