import "./style.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new three.Scene();

const camera = new three.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new three.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const geometry = new three.TorusGeometry(10, 3, 16, 100);
/* const material = new three.MeshBasicMaterial({
  color: 0xff6347,
  wireframe: true,
}); //no light source needed */

const material = new three.MeshStandardMaterial({ color: 0xff6347 }); //no light source needed
const torus = new three.Mesh(geometry, material);

scene.add(torus);

const pointLight = new three.PointLight(0xffffff); // 0x är hex literal
pointLight.position.set(20, 20, 20);

const ambientLight = new three.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new three.PointLightHelper(pointLight);
const gridHelper = new three.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

//Planet
planetTexture = new three.TextureLoader().load(
  "./assets/planet/Ground052_1K_Color.png"
);
normalTexture = new three.TextureLoader().load(
  "./assets/planet/Ground052_1K_NormalGL.png"
);

const planet = new three.Mesh(
  new three.SphereGeometry(3, 32, 32),
  new three.MeshStandardMaterial({
    map: planetTexture,
    normalMap: normalTexture,
  })
);

scene.add(planet);

function addStar() {
  const geometry = new three.SphereGeometry(0.25, 24, 24);
  const material = new three.MeshStandardMaterial({ color: 0xffffff });
  const star = new three.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => three.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new three.TextureLoader().load("./assets/space.jpg");
scene.background = spaceTexture;

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();
