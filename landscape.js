// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 30, 100);

// Create a renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-1, 2, 4);
scene.add(directionalLight);

// Create a ground plane
const planeGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x669966 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// Create mountains
const mountains = new THREE.Group();
const noise = new ClassicalNoise(); // Initialize the noise function
const heightScale = 20;
const mountainCount = 50;
const mountainWidth = 400;
const mountainDepth = 400;

for (let i = 0; i < mountainCount; i++) {
  const mountainGeometry = new THREE.PlaneGeometry(mountainWidth, mountainDepth, 100, 100);
  mountainGeometry.vertices.forEach((vertex) => {
    const noiseValue = noise.perlin2(vertex.x / 20, vertex.y / 20); // Use the noise function
    vertex.z = noiseValue * heightScale;
  });
  mountainGeometry.computeFlatVertexNormals();
  const mountainMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
  const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
  mountain.position.x = (Math.random() - 0.5) * 1000;
  mountain.position.z = (Math.random() - 0.5) * 1000;
  mountain.rotation.x = -Math.PI / 2;
  mountains.add(mountain);
}

scene.add(mountains);
// Load the OBJ file and its associated textures
const loader = new THREE.OBJLoader();
const textureLoader = new THREE.TextureLoader();

loader.load(
  'everest.obj',
  function(object) {
    // Load the texture maps
    const textureLoader = new THREE.TextureLoader();
    const textureMap = textureLoader.load('texturemap.png');
    const normalMap = textureLoader.load('normalmap.png');
    // Set the materials on the object
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        const material = new THREE.MeshPhongMaterial({
          map: textureMap,
          normalMap: normalMap,
          shininess: 50
        });
        child.material = material;
      }
    });
    // Add the object to the scene
    scene.add(object);
  },
  function(xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function(error) {
    console.log('An error happened');
    console.log(error);
  }
);

// Render the scene
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();
