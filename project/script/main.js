import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// import earthTexture from './Material.jpeg';

let scene, camera, renderer, starGeo, stars, esfera;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);

    camera.position.z = 1;
    camera.rotation.x = Math.PI / 2;

    renderer = new THREE.WebGLRenderer();

    // renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setSize(window.innerWidth, 607.91);

    document.getElementById('container2').appendChild(renderer.domElement);
    
    starGeo = new THREE.BufferGeometry();
    const starsCount = 20000;

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

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));
    starGeo.setAttribute('acceleration', new THREE.BufferAttribute(accelerations, 1));

    let sprite = new THREE.TextureLoader().load('/views/img/circuloo.png');
    let starMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.7,
        map: sprite
    });

    stars = new THREE.Points(starGeo, starMaterial);

    scene.add(stars);
    
    camera.position.z = 10;

    animate();
}

function animate() {
    const positions = starGeo.getAttribute('position');
    const velocities = starGeo.getAttribute('velocity');
    const accelerations = starGeo.getAttribute('acceleration');

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
    requestAnimationFrame(animate);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

init();