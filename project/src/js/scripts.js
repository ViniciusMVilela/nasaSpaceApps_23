import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { InteractionManager } from 'three.interactive';

const div = document.getElementById('marte');

import starsTexture from "../img/stars.jpg";
import sunTexture from "../img/sun.jpg";
import marsTexture from "../img/mars.jpg";
import jupiterTexture from "../img/jupiter.jpg";
import saturnTexture from "../img/saturn.jpg";
import saturnRingTexture from "../img/saturn ring.png";
import moonTexture from "../img/moon.jpg";
import circlePng from "../img/circle.png";
// import navePng from "../img/"


const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const interactionManager = new InteractionManager(
  renderer,
  camera,
  renderer.domElement
)

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.panSpeed = 2;
orbit.rotateSpeed = 2;
orbit.maxDistance = 10;
orbit.minDistance = 10;
orbit.enablePan = false;

let stars, starGeo;

starGeo = new THREE.BufferGeometry();
const starsCount = 10000;

const positions = new Float32Array(starsCount * 3); // Cada estrela tem três coordenadas (x, y, z)
const velocities = new Float32Array(starsCount);
const accelerations = new Float32Array(starsCount);

for (let i = 0; i < starsCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 600; // Coordenada x
  positions[i * 3 + 1] = (Math.random() - 0.5) * 600; // Coordenada y
  positions[i * 3 + 2] = (Math.random() - 0.5) * 600; // Coordenada z

  velocities[i] = Math.random();
  accelerations[i] = 0;
}

starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
starGeo.setAttribute("velocity", new THREE.BufferAttribute(velocities, 1));
starGeo.setAttribute(
  "acceleration",
  new THREE.BufferAttribute(accelerations, 1)
);

let sprite = new THREE.TextureLoader().load(circlePng);
let starMaterial = new THREE.PointsMaterial({
  color: 0xaaaaaa,
  size: 0.7,
  map: sprite,
});

stars = new THREE.Points(starGeo, starMaterial);

scene.add(stars);

camera.position.set(-70, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
]);

function createPlanete(size, texture, position, positionY, ring) {
  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });
  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();
  obj.add(mesh);
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    obj.add(ringMesh);
    ringMesh.position.x = position;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(obj);
  mesh.position.x = position;
  mesh.position.y = positionY;
  return { mesh, obj };
}

const sun = createPlanete(8, sunTexture, 70, -120);
const moon = createPlanete(3, moonTexture, -70, 100);
const mars = createPlanete(1, marsTexture, 90, 20);
const jupiter = createPlanete(0.8, jupiterTexture, 70, 40);
const saturn = createPlanete(2, saturnTexture, 190, 0, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture,
});

const pointLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(pointLight);

function animate() {
  moon.mesh.rotateY (0.04);
  mars.mesh.rotateY (0.04);
  jupiter.mesh.rotateY (0.05);
  saturn.mesh.rotateY (0.1);
  sun.mesh.rotateY (0.01);

  renderer.render(scene, camera);
}

function animateStar() {
  const positions = starGeo.getAttribute("position");
  const velocities = starGeo.getAttribute("velocity");
  const accelerations = starGeo.getAttribute("acceleration");

  positions.set(positions.array);

  for (let i = 0; i < positions.count; i++) {
    velocities.array[i] += accelerations.array[i];
    positions.array[i * 3 + 1] -= velocities.array[i];

    if (positions.array[i * 3 + 1] < -200) {
      positions.array[i * 3 + 1] = 200;
      velocities.array[i] = 0;
    }
  }

  positions.needsUpdate = true;

  stars.updateMatrix();

  renderer.render(scene, camera);
  requestAnimationFrame(animateStar);
}

renderer.setAnimationLoop(animate);
animateStar();

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

interactionManager.add(mars.mesh);

div.addEventListener('click', e => {
  if (div.style.display == 'flex') {
    div.style.display = 'none';
  }
});

mars.mesh.addEventListener('click', () => {
  var mensagem = new SpeechSynthesisUtterance();
  var vozes = speechSynthesis.getVoices(1);
  mensagem.text = "Marte É uma ótima opção para quem não quer algo tão radical, por ser o planeta que mais vai se assemelhar as condições da terra dentro do sistema solar ";
  mensagem.voice = vozes[1]; 
  mensagem.lang = "pt-BR";
  mensagem.volume = 1; 
  mensagem.rate = 1; 
  mensagem.pitch = 0; 
  speechSynthesis.speak(mensagem);
});

mars.mesh.addEventListener('click', async (e) => {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  for (let i = 10; i < 36; i++) {
    await delay(200);
    createPlanete(i, marsTexture, 90, 20);
    interactionManager.update();
  }
  
  div.style.display = 'flex';
});

interactionManager.update();
