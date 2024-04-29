// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

// Axes helper with colors and labels
const axesHelper = new THREE.AxesHelper(5);
axesHelper.material.depthTest = false; // To prevent depth-test issues
axesHelper.renderOrder = 1; // To ensure it's rendered after other objects
scene.add(axesHelper);

// Labels for the axes
const axesLabels = {
  x: createTextSprite("X", { fontsize: 24, textColor: { r: 255, g: 0, b: 0 } }),
  y: createTextSprite("Y", { fontsize: 24, textColor: { r: 0, g: 255, b: 0 } }),
  z: createTextSprite("Z", { fontsize: 24, textColor: { r: 0, g: 0, b: 255 } }),
};

axesLabels.x.position.set(5.2, 0, 0);
axesLabels.y.position.set(0, 5.2, 0);
axesLabels.z.position.set(0, 0, 5.2);
scene.add(axesLabels.x);
scene.add(axesLabels.y);
scene.add(axesLabels.z);

// Sphere that represents the position
const geometry = new THREE.SphereGeometry(0.1, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Camera position
camera.position.z = 10;

// Render loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

// Function to update position
function updatePosition(x, y, z) {
  sphere.position.set(x, y, z);
}

// Simulate position data
let x = 0,
  y = 0,
  z = 0;
setInterval(() => {
  x += 0.05;
  y += 0.05;
  z += 0.05;
  updatePosition(x % 5, y % 5, z % 5);
}, 100);

// Helper function to create text labels
function createTextSprite(message, opts) {
  const fontface = "Arial";
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = opts.fontsize + "px " + fontface;
  context.fillStyle = `rgba(${opts.textColor.r}, ${opts.textColor.g}, ${opts.textColor.b}, 1.0)`;
  context.fillText(message, 0, opts.fontsize);

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(0.5, 0.25, 1);
  return sprite;
}
