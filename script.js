// // UUIDs for the service and characteristic
const serviceUuid = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const characteristicUuid = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

document
  .getElementById("connectBluetooth")
  .addEventListener("click", async () => {
    try {
      const device = await navigator.bluetooth
        .requestDevice({
          // Request any available device
          acceptAllDevices: true,
          optionalServices: [serviceUuid],
        })
        .catch((error) => {
          console.log(error);
        });

      console.log("Connecting to the device...");
      let deviceName = device.gatt.device.name;
      const server = await device.gatt.connect();
      console.log("Connected to:", device.name);

      const service = await server.getPrimaryService(serviceUuid);
      const characteristic = await service.getCharacteristic(
        characteristicUuid
      );
      await characteristic.startNotifications();

      characteristic.addEventListener(
        "characteristicvaluechanged",
        handleBLEMessage
      );
      console.log("Setup complete. Listening for data...");
    } catch (error) {
      console.error("Error:", error);
    }
  });

function handleBLEMessage(event) {
  const value = event.target.value;
  const decoder = new TextDecoder("utf-8");
  const message = decoder.decode(value);
  console.log(new Date(), message);

  try {
    var data = message.split(" ");
    mac_id = data[0];
    data.shift();
    data.pop();
    // console.log(data);
    //check the length of data ==7
    if (data.length == 7) {
      var json_data = {
        id: mac_id,
        x: data[0],
        y: data[1],
        z: data[2],
        w: data[3],
        sensorPosition: { x: data[4], y: data[5], z: data[6] },
      };
      console.log(json_data);
    }

    // const data = JSON.parse(message);
    if (json_data.sensorPosition) {
      plotPosition(
        json_data.sensorPosition.x,
        json_data.sensorPosition.y,
        json_data.sensorPosition.z
      );
    }
  } catch (e) {
    console.error("Error parsing message:", e);
  }
}

// Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(7, 7, 7); // Adjusted to better see the axes
camera.lookAt(scene.position); // Ensure the camera looks at the center of the scene

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up the 3D axis
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Function to create axis label using 3D text
function createAxisLabel(text, x, y, z, color) {
  const loader = new THREE.FontLoader();

  // Load a font
  loader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    function (font) {
      const textGeo = new THREE.TextGeometry(text, {
        font: font,
        size: 0.5, // Adjust size here as needed
        height: 0.1, // Adjust depth of 3D text here
      });

      const textMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(`rgb(${color})`),
      });
      const mesh = new THREE.Mesh(textGeo, textMaterial);
      mesh.position.set(x, y, z);
      scene.add(mesh);
    }
  );
}

// Set up the axis labels
createAxisLabel("X", 5.2, 0, 0, "255,0,0"); // Position the labels to be clear
createAxisLabel("Y", 0, 5.2, 0, "0,255,0");
createAxisLabel("Z", 0, 0, 5.2, "0,0,255");

// Create a material for the position points
const pointMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });

// Function to generate random 3D position data
function generatePositionData() {
  const x = Math.random() * 10 - 5;
  const y = Math.random() * 10 - 5;
  const z = Math.random() * 10 - 5;
  return new THREE.Vector3(x, y, z);
}

// Function to plot the position data
function plotPosition(position) {
  const point = new THREE.Points(
    new THREE.BufferGeometry().setFromPoints([position]),
    pointMaterial
  );
  scene.add(point);
}

// Animation loop to simulate real-time position data
function animate() {
  requestAnimationFrame(animate);

  // const position = generatePositionData();
  // plotPosition(position);

  renderer.render(scene, camera);
}

// Start the animation loop
animate();
