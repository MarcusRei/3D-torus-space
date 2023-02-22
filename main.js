import "./style.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 1. Setup a scene
const scene = new three.Scene();

// 2. Setup a camera
const camera = new three.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// 3. Setup a renderer
const renderer = new three.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

//Start render of scene and camera
renderer.render(scene, camera);

// 4. Setup an object. Has 2 parts

// 4.1 The geometry
const geometry = new three.TorusGeometry(10, 3, 16, 100);

/* const material = new three.MeshBasicMaterial({
  color: 0xff6347,
  wireframe: true,
}); //no light source needed */

// 4.2 The material
const material = new three.MeshStandardMaterial({ color: 0xff6347 }); //no light source needed

// 4.3 Combine it into a mesh
const torus = new three.Mesh(geometry, material);

// 4.4 Add object to scene
scene.add(torus);

// 5 Add pointlight
const pointLight = new three.PointLight(0xffffff); // 0x is hex literal
pointLight.position.set(20, 20, 20);

// 6 Add ambient light (allround)
const ambientLight = new three.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// 7 Add helpers/guides
const lightHelper = new three.PointLightHelper(pointLight);
const gridHelper = new three.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

// 8 Adds ability to move camera
const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new three.SphereGeometry(0.25, 24, 24);
  const material = new three.MeshStandardMaterial({ color: 0xffffff });
  const star = new three.Mesh(geometry, material);

  // 9 Add random stars
  const [x, y, z] = Array(3)
    .fill()
    .map(() => three.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background
const spaceTexture = new three.TextureLoader().load("./assets/space.jpg");
scene.background = spaceTexture;

// 10 Add Planet

// 10.1 Load in texture & normal map
const planetTexture = new three.TextureLoader().load(
  "./assets/planet/Ground052_1K_Color.png"
);
const normalTexture = new three.TextureLoader().load(
  "./assets/planet/Ground052_1K_NormalGL.png"
);

// 10.2 Make object
const planet = new three.Mesh(
  new three.SphereGeometry(3, 32, 32),
  new three.MeshStandardMaterial({
    map: planetTexture,
    normalMap: normalTexture,
  })
);

// 10.3 Add planet to scene
scene.add(planet);

//Both these work the same way
planet.position.z = 30;
planet.position.setX(-10);

function moveCamera() {
  //Gives us dimensions of the viewport & top shows us exactly how far from the top we are
  const t = document.body.getBoundingClientRect().top;
  planet.rotation.x += 0.05;
  planet.rotation.y += 0.075;
  planet.rotation.z += 0.05;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

// 11 Rotates the torus
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();
