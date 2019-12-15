//#region Variable
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var mouseClicked = false;
var world = null;
var origin = new THREE.Vector3();
var ext = new THREE.Vector3();
var POSTER = "poster";
var MUR = "mur";
var SOL = "sol";
var date;
var previousElementSeen;
var lastPosterSeen;
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3(1, 0, 0);
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var salle = "salleCentrale";
//#endregion

//#region Méthode
var KeyboardControls = function (object) {
	this.object = object;

	this.position = new THREE.Vector3(1, 1.7, 5);

	this.angle = 0.0;

	this.cible = new THREE.Vector3(2, 1.7, 5);


	var vertex = new THREE.Vector3();
	this.plusHaut = false;
	this.plusBas = false;

	this.domElement = document.body;
	this.isLocked = false;

	//
	// internals
	//

	var scope = this;

	var changeEvent = { type: 'change' };
	var lockEvent = { type: 'lock' };
	var unlockEvent = { type: 'unlock' };

	var euler = new THREE.Euler(0, 0, 0, 'YXZ');

	var PI_2 = Math.PI / 2;

	var vec = new THREE.Vector3();

	function onMouseMove(event) {
		if (scope.isLocked === false) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		euler.setFromQuaternion(camera.quaternion);

		euler.y -= movementX * 0.002;
		euler.x -= movementY * 0.002;

		euler.x = Math.max(- PI_2, Math.min(PI_2, euler.x));

		camera.quaternion.setFromEuler(euler);

		scope.dispatchEvent(changeEvent);
	}

	function onPointerlockChange() {

		if (document.pointerLockElement === scope.domElement) {

			scope.dispatchEvent(lockEvent);

			scope.isLocked = true;

		} else {

			scope.dispatchEvent(unlockEvent);

			scope.isLocked = false;

		}

	}

	function onPointerlockError() {

		console.error('THREE.PointerLockControls: Unable to use Pointer Lock API');

	}

	this.connect = function () {

		document.addEventListener('mousemove', onMouseMove, false);
		document.addEventListener('pointerlockchange', onPointerlockChange, false);
		document.addEventListener('pointerlockerror', onPointerlockError, false);

	};

	this.disconnect = function () {

		document.removeEventListener('mousemove', onMouseMove, false);
		document.removeEventListener('pointerlockchange', onPointerlockChange, false);
		document.removeEventListener('pointerlockerror', onPointerlockError, false);

	};

	this.dispose = function () {

		this.disconnect();

	};

	this.getObject = function () { // retaining this method for backward compatibility

		return camera;

	};

	this.getDirection = function () {

		var direction = new THREE.Vector3(0, 0, - 1);

		return function (v) {

			return v.copy(direction).applyQuaternion(camera.quaternion);

		};

	}();

	this.moveForward = function (distance) {

		// move forward parallel to the xz-plane
		// assumes camera.up is y-up

		vec.setFromMatrixColumn(camera.matrix, 0);

		vec.crossVectors(camera.up, vec);

		camera.position.addScaledVector(vec, distance);

	};

	this.moveRight = function (distance) {

		vec.setFromMatrixColumn(camera.matrix, 0);

		camera.position.addScaledVector(vec, distance);

	};

	this.lock = function () {

		this.domElement.requestPointerLock();

	};

	this.unlock = function () {

		document.exitPointerLock();

	};

	this.connect();
};

KeyboardControls.prototype = Object.create(THREE.EventDispatcher.prototype);
KeyboardControls.prototype.constructor = KeyboardControls;

/** Détecte si l'utilisateur regarde un tableau pendant plus de trois secondes ou non
 *	Si oui, affiche une description du tableau
 *  Sinon, efface la description */

function detectTableaux() {
	raycaster.setFromCamera(mouse, camera);
	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects(scene.children, true);
	if (intersects.length > 0) {
		var objectName = intersects[0].object.name;
		// Teste si l'objet regardé est un poster (les posters ont un nom commençant par 'poster')
		if (objectName.includes(POSTER)) {
			// Teste si l'élément regardé est le même que précedemment ou non
			if (objectName === previousElementSeen) {
				var date2 = new Date();
				// Teste si l'on regarde le poster depuis plus de 3 secondes
				if (date2 - date > 3000 && lastPosterSeen.description === undefined) {
					lastPosterSeen.description = afficherTexte(intersects[0].object, getTexte(intersects[0].object));
				}
			}
			lastPosterSeen = intersects[0].object;
			// Si on regarde un mur ou un sol, efface la description du précédent poster vu
		} else if (objectName.includes(MUR) || objectName.includes(SOL)) {
			effacerTexte(lastPosterSeen);
			date = new Date();
		}
		//Stocke le dernier élément vu par le 'joueur'
		previousElementSeen = intersects[0].object.name;
	}
}

// Créé un nouveau texte qui s'affichera devant le tableau
function afficherTexte(tableau, text) {
	texte = creerText(text, 2);
	placerXYZ(texte, 0, 0, 0.1);
	parentDe(tableau, texte);
	return texte;
}

// Efface le texte de description d'un poster
function effacerTexte(poster) {
	if (poster !== undefined) {
		poster.remove(poster.description);
		poster.description = undefined;
	}
}

function getSalleActuelle() {
	var posX = controls.getObject().position.x;
	var posZ = controls.getObject().position.z;
	if (posX > -10 && posX < 10 && posZ > -6 && posZ < 6
		|| posX > -6 && posX < 6 && posZ > -10 && posZ < 10
		|| isInCorner(posX, posZ) && posX > -10 && posX < 10 && posZ > -10 && posZ < 10) {
		return 'salleCentrale';
	} else if (posX < -15) {
		return 'salleGauche';
	} else if (posX > 15) {
		return 'salleDroite';
	} else if (posZ < -15) {
		return 'salleAvant';
	} else if (posZ > 15) {
		return 'salleArriere';
	} else {
		return 'couloir';
	}
}

/* Détecte si le joueur est dans un coin de la pièce centrale ou non
Pour chaque coin, le mur est répresenté par une équation de droite affine dans le repère du musée
Si le joueur est en dessous de deux droites (coin avant droit et coin arrière droit) et au dessus de deux autres (coin avant gauche et coin arrière gauche), 
alors il se trouve dans la pièce centrale 
Formule utilisée : posX - ( a * posZ + b ) où (posX,posZ) est la position du joueur, et la droite est d'équation x = a*z + b*/
function isInCorner(posX, posZ) {
	// Coin avant gauche (x = -z -16)
	var distance = (posX - (-1 * posZ - 16)) > 0;
	// Coin avant droit (x = (x = z + 16))
	var distance2 = (posX - (1 * posZ + 16)) < 0;
	// Coin arrière gauche (x = z -16)
	var distance3 = (posX - (1 * posZ - 16)) > 0;
	// Coin arrière droit (x = -z + 16)
	var distance4 = (posX - (-1 * posZ + 16)) < 0;
	return distance && distance2 && distance3 && distance4;
}

// Affiche le nom des tableaux proches devant le joueur
function setInformation(salleActuelle){
	var informations = document.getElementById("informations");
	var tableauxName = getTableauxSalleActuelle(salleActuelle);
	var trucAecrire = getSalleActuelle() + '<br/>' 
	+ 'Tableaux proches : ' + '<br/>';
	tableauxName.forEach(function(tableauName){
		trucAecrire += tableauName + '<br/>';
	});
	if (informations != null){
		informations.innerHTML = trucAecrire;
	}
}

// Récupère le nom des tableaux de la salle dans laquelle se trouve le joueur
function getTableauxSalleActuelle(salleActuelle){
	var tableaux = [];
	var nomTableaux = [];
	var salleActuelle1 = salleActuelle.substr(0,1).toUpperCase() + salleActuelle.substr(1,salleActuelle.length);
	for (var i=0 in annuaire){
		if (annuaire[i].parent != null){
			if (annuaire[i].parent.name.includes(salleActuelle1)){
				tableaux.push(annuaire[i]);
			}
		}
	}
	if (tableaux.length > 0){
		tableaux.forEach(function(tableau){
			nomTableaux.push(tableau.name.substr(7, tableau.name.length));
		});
	}
	return nomTableaux;
}

KeyboardControls.prototype.update = function (dt) {

	detectTableaux();

	var salleActuelle = getSalleActuelle();

	setInformation(salleActuelle);
	
	if (salleActuelle != salle) {
		if (salleActuelle != "salleCentrale") {
			var sound = chercherDansAnnuaire(salleActuelle + "Audio");
			sound.play();
		}
		if (salle != "salleCentrale") {
			sound = chercherDansAnnuaire(salle + "Audio");
			sound.stop();
		}
		salle = salleActuelle;
	}


	if (mouseClicked) {
		this.isLocked = false;

		direction.set(origin.x - ext.x, origin.y - ext.y, origin.z - ext.z);
		direction.normalize();
		velocity.z = direction.z * 300.0 * dt;
		velocity.x = direction.x * 300.0 * dt;
		controls.moveRight(- velocity.x * dt);
		controls.moveForward(- velocity.z * dt);

		var pos = camera.position;

		if ((pos.x > ext.x - 3.5 && pos.x < ext.x + 3.5) && (pos.z > ext.z - 3.5 && pos.z < ext.z + 3.5)) {
			mouseClicked = false;
			this.isLocked = true;
		}
	}
	else {
		raycaster.ray.origin.copy(controls.getObject().position);
		raycaster.ray.origin.y -= 10;
		velocity.x -= velocity.x * 30.0 * dt;
		velocity.z -= velocity.z * 30.0 * dt;
		velocity.y -= 9.8 * 100.0 * dt; // 100.0 = mass
		direction.z = Number(moveForward) - Number(moveBackward);
		direction.x = Number(moveRight) - Number(moveLeft);
		direction.normalize(); // this ensures consistent movements in all directions
		if (moveForward || moveBackward) velocity.z -= direction.z * 300.0 * dt;
		if (moveLeft || moveRight) velocity.x -= direction.x * 300.0 * dt;
		controls.moveRight(- velocity.x * dt);
		controls.moveForward(- velocity.z * dt);
	}

}

function keyUp(event) {
	switch (event.keyCode) {
		case 38: // up
		case 90: // w
			moveForward = false;
			break;
		case 37: // left
		case 81: // a
			moveLeft = false;
			break;
		case 40: // down
		case 83: // s
			moveBackward = false;
			break;
		case 39: // right
		case 68: // d
			moveRight = false;
			break;
	}
}


function keyDown(event) {
	switch (event.keyCode) {
		case 38: // up
		case 90: // w
			moveForward = true;
			break;
		case 37: // left
		case 81: // a
			moveLeft = true;
			break;
		case 40: // down
		case 83: // s
			moveBackward = true;
			break;
		case 39: // right
		case 68: // d
			moveRight = true;
			break;
	}
}



function mouseDown(event) {
	event.preventDefault();
	mouse.x = 0;
	mouse.y = 0;
	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects(scene.children, true);
	if (intersects.length > 0) {
		if (intersects[0].object.geometry.type == "SphereGeometry" && intersects[0].object.material.color.getStyle() == "rgb(255,255,255)") {
			pointeur.position.set(intersects[0].point.x, intersects[0].point.y, +intersects[0].point.z);
			mouseClicked = true;
			world = intersects[0].object.matrixWorld;
			origin = new THREE.Vector3(0, 0, 0);
			ext = new THREE.Vector3(0, 0, 2);
			origin.applyMatrix4(world);
			ext.applyMatrix4(world);
		}
	}
}
//#endregion
