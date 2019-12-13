function creerGroupe(nom) {
	var groupe = new THREE.Group();
	groupe.name = nom;
	return groupe;
}


function creerAxes(l) {
	return new THREE.AxisHelper(l);
}


function creerSol(nom, largeur, hauteur, materiau) {
	var geo = new THREE.PlaneGeometry(
		largeur, hauteur,
		Math.floor(largeur / 10.0) + 1, Math.floor(hauteur / 10) + 1);
	var mesh = new THREE.Mesh(geo, materiau);
	mesh.name = "sol_" + nom;
	mesh.rotation.x = - Math.PI / 2;
	mesh.receiveShadow = true;
	return mesh;
}

function creerCloison(nom, largeur, hauteur, epaisseur, nx, ny, nz, materiau) {
	var geo = new THREE.BoxGeometry(largeur, hauteur, epaisseur, nx, ny, nz);
	var mesh = new THREE.Mesh(geo, materiau);
	mesh.name = "mur_" + nom;
	mesh.position.set(0, hauteur, 0);
	mesh.castShadow = true;
	return mesh;
}


function creerSphere(nom, rayon, subdivisions, materiau) {
	var geo = new THREE.SphereGeometry(rayon, subdivisions, subdivisions);
	var mesh = new THREE.Mesh(geo, materiau);
	mesh.name = nom;
	return mesh;
}


function creerPoster(nom, largeur, hauteur, nomImage) {
	var geo = new THREE.PlaneGeometry(largeur, hauteur);
	var mat = creerLambertTexture(nomImage, 0xffffff);
	var mesh = new THREE.Mesh(geo, mat);
	mesh.description = undefined;
	mesh.name = "poster_" + nom;
	return mesh;
}

function creerPoster1(nom, largeur, hauteur, nomImage) {
	var geo = new THREE.PlaneGeometry(largeur, hauteur);
	var mat = creerLambertTexture(nomImage, 0xffffff);
	var mesh = new THREE.Mesh(geo, mat);
	mesh.name = nom;
	var dos = new THREE.Mesh(geo, materiauBlanc);
	dos.rotation.y = Math.PI;
	dos.position.z = -0.01;
	mesh.position.z = 0.01;

	var groupe = new THREE.Group();
	groupe.add(mesh);
	groupe.add(dos);
	groupe.name = nom;
	return groupe;
}

function creerText(description, largeur) {
	description = description.split("\n");
	var canvasHeight = description.length;
	var textSize;

	// Fixe la taille du texte pour qu'il rentre dans le canvas prévu à cet effet
	if (canvasHeight >= 4 && canvasHeight <= 7) {
		textSize = 20 + (7 - canvasHeight) * 4;
	} else if (canvasHeight < 4) {
		textSize = 32;
	} else {
		throw ("Erreur, description dépassant 7 lignes !");
	}

	canvas = document.createElement('canvas')
	context = canvas.getContext('2d');
	canvas.width = 500;
	context.font = textSize + 'pt Arial';
	context.fillStyle = 'black';
	context.textAlign = "center";
	context.textBaseline = "middle";

	var textX = canvas.width / 2;
	var textY;
	var offset = textSize;
	var textHeight = 30;
	for (var i = 0; i < description.length; i++) {
		textY = textSize / 1.5 + i * offset;
		context.fillText(description[i], textX, textY);
	}

	var geometry = new THREE.PlaneGeometry(largeur * 0.9, textSize * canvasHeight * 0.01);
	texture = new THREE.CanvasTexture(canvas);
	var material = new THREE.MeshLambertMaterial({ color: 0xffffff, map: texture });
	var mesh = new THREE.Mesh(geometry, material)
	return mesh;
}

// ===================
// Création de sources
// ===================

function creerSourcePonctuelle(couleur, intensite, portee, attenuation) {
	var light = new THREE.PointLight(couleur, intensite, portee, attenuation);
	// ajout d'une sphere comme "source" de lumiere
	light.add(new THREE.Mesh(new THREE.SphereBufferGeometry(0.5,16,16), new THREE.MeshBasicMaterial({color:couleur})))
	light.castShadow = true;
	return light;
}

function creerSoleil() {
	var h = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
	return h;
}

function creerSourceAudio3d(listener, fileName, loop, volume, distance) {
	var sound = new THREE.PositionalAudio(listener);
	var audioLoader = new THREE.AudioLoader();
	audioLoader.load(
		fileName,
		function (buffer) {
			//var _loop     = params["loop"]     || false ; 
			//var _volume   = params["volume"]   || 1.0 ;
			//var _distance = params["distance"] || 20 ;
			sound.setBuffer(buffer);
			sound.setLoop(loop);
			sound.setVolume(volume);
			sound.setRefDistance(distance);
			//sound.play() ; 
		});
	return sound;
}

function creerModel(url) {
	var object;
	// manager

	function loadModel() {
		object.traverse(function (child) {
			if (child.isMesh) child.material.map = texture;
		});
		object.position.y = 0.5;
		object.rotateX=1.57079632679;
		scene.add(object);
	}

	var manager = new THREE.LoadingManager(loadModel);
	manager.onProgress = function (item, loaded, total) {
		console.log(item, loaded, total);
	};

	// texture

	var textureLoader = new THREE.TextureLoader(manager);

	//var texture = textureLoader.load('assets/uv_grid_opengl.jpg');

	// model

	function onProgress(xhr) {
		if (xhr.lengthComputable) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');
		}
	}

	function onError() { }

	var loader = new THREE.OBJLoader(manager);
	loader.load(url, function (obj) {
		object = obj;
	}, onProgress, onError);

	//
	return object;
}



// =====================
// Création de matériaux
// =====================

var textureLoader = new THREE.TextureLoader();

var materiauBlanc = creerLambert(0xffffff);
var materiauRouge = creerLambert(0xff0000);

function creerWireframe(couleur) {
	var mat = new THREE.MeshBasicMaterial({ color: couleur, wireframe: true });
	return mat;
}

function creerLambert(couleur) {
	var mat = new THREE.MeshLambertMaterial({ color: couleur });
	return mat;
}

function creerLambertTexture(nomImage, couleur, nx, ny) {
	var texture = textureLoader.load(nomImage);
	var mat = new THREE.MeshLambertMaterial({ color: couleur, map: texture });
	nx = nx || 1;
	ny = ny || 1;
	mat.map.wrapS = THREE.RepeatWrapping;
	mat.map.wrapT = THREE.RepeatWrapping;
	mat.map.repeat.set(nx, ny);
	return mat;
}

function creerPhong(couleur) {
	var mat = new THREE.MeshPhongMaterial({ color: couleur });
	return mat;
}

function creerPhongTexture(nomImage, couleur, nx, ny) {
	var texture = textureLoader.load(nomImage);
	var mat = new THREE.MeshPhongMaterial({ color: couleur, map: texture });
	nx = nx || 1;
	ny = ny || 1;
	mat.map.wrapS = THREE.RepeatWrapping;
	mat.map.wrapT = THREE.RepeatWrapping;
	mat.map.repeat.set(nx, ny);
	return mat;
}

function creerStandard(couleur) {
	var mat = new THREE.MeshStandardMaterial({ color: couleur });
	return mat;
}

function creerStandardTexture(nomImage, couleur, nx, ny) {
	var texture = textureLoader.load(nomImage);
	var mat = new THREE.MeshStandardMaterial({ color: couleur, map: texture });
	nx = nx || 1;
	ny = ny || 1;
	mat.map.wrapS = THREE.RepeatWrapping;
	mat.map.wrapT = THREE.RepeatWrapping;
	mat.map.repeat.set(nx, ny);
	return mat;
}


// ======================
// Traitements des meshes
// ======================

function placerXYZ(mesh, x, y, z) {
	mesh.translateX(x);
	mesh.translateY(y);
	mesh.translateZ(z);
}

function orienterY(mesh, y) {
	mesh.rotateY(y);
}

function parentDe(pere, fils) {
	pere.add(fils);
}




