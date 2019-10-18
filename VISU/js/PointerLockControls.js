/**
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
 */

var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var vertex = new THREE.Vector3();
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

var PointerLockControls = function (camera, domElement) {

	this.domElement = domElement || document.body;
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

PointerLockControls.prototype = Object.create(THREE.EventDispatcher.prototype);
PointerLockControls.prototype.constructor = PointerLockControls;



PointerLockControls.prototype.update = function (dt) {

	raycaster.ray.origin.copy(controls.getObject().position);
	raycaster.ray.origin.y -= 10;
	/* 	var intersections = raycaster.intersectObjects(objects);
		var onObject = intersections.length > 0; */
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
	/* 	if (onObject === true) {
			velocity.y = Math.max(0, velocity.y);
			canJump = true;
		} */
	controls.moveRight(- velocity.x * delta);
	controls.moveForward(- velocity.z * delta);
	controls.getObject().position.y += (velocity.y * delta); // new behavior
	if (controls.getObject().position.y < 10) {
		velocity.y = 0;
		controls.getObject().position.y = 10;
		canJump = true;
	}
	prevTime = time;

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
		case 32: // space
			if (canJump === true) velocity.y += 350;
			canJump = false;
			break;
	}
}


/* export { PointerLockControls }; */
