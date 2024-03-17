// Initialisation de la scène
const scene = new THREE.Scene();

// Initialisation de la caméra
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Initialisation du moteur de rendu
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Contrôles OrbitControls
//const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Fonction pour créer un bloc
function createBlock(width, height, depth) {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshBasicMaterial({
    color: Math.random() * 0xffffff,
  });
  return new THREE.Mesh(geometry, material);
}

// Fonction pour créer une étagère
function createShelf(blocks) {
  // Supprimer l'étagère existante
  const existingShelf = scene.getObjectByName("shelf");
  if (existingShelf) {
    scene.remove(existingShelf);
  }

  const shelf = new THREE.Object3D();
  let currentPosition = 0;

  blocks.forEach((block) => {
    const shelfBlock = createBlock(
      block.width,
      block.height,
      block.depth
    );
    shelfBlock.position.x = currentPosition;
    shelf.add(shelfBlock);
    currentPosition += block.width + 0.1; // espace entre les blocs
  });

  shelf.name = "shelf";
  scene.add(shelf);
}

// Exemple d'étagère avec des blocs
const defaultBlocks = [
];

createShelf(defaultBlocks);

// Fond de l'entrepôt
const warehouseBackMaterial = new THREE.MeshBasicMaterial({
    color: 'blue',
  });
  const warehouseFloorMaterial = new THREE.MeshBasicMaterial({
    color: 'red',
  });

const PROFONDEUR_HALL = 15;
const LARGEUR_HALL = 25;

const warehouseFloorGeometry = new THREE.BoxGeometry( LARGEUR_HALL,PROFONDEUR_HALL, 10);
const warehouseFloor = new THREE.Mesh(
    warehouseFloorGeometry,
  warehouseFloorMaterial
);
warehouseFloor.position.y = -10; // légèrement en dessous du sol
warehouseFloor.position.z = -PROFONDEUR_HALL/2; // légèrement en dessous du sol
scene.add(warehouseFloor);

const warehouseBackWalls = new THREE.Mesh(
  new THREE.BoxGeometry(LARGEUR_HALL, 10, 0.1),
  warehouseBackMaterial
);
warehouseBackWalls.position.z = -PROFONDEUR_HALL;
scene.add(warehouseBackWalls);

// Animation
function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  //controls.update(); // Mettre à jour les contrôles OrbitControls
}

animate();

// Redimensionnement de la fenêtre
window.addEventListener("resize", () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
});

// Mise à jour de l'étagère en fonction des contrôles
function updateShelf() {
  const width = parseFloat(document.getElementById("widthInput").value);
  const height = parseFloat(document.getElementById("heightInput").value);
  const depth = parseFloat(document.getElementById("depthInput").value);
  const shelf_width = parseFloat(document.getElementById("shelf_widthInput").value);
  const shelf_height = parseFloat(document.getElementById("shelf_heightInput").value);
  const shelf_depth = parseFloat(document.getElementById("shelf_depthInput").value);

  const updatedBlocks = [{ width, height, depth }];
  createShelf(updatedBlocks);
}
