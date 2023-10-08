import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let texture = new THREE.TextureLoader().load('/views/img/Material.jpeg');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 1, 1 );
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
let renderer = new THREE.WebGLRenderer();
let orbit  = new OrbitControls(camera, renderer.domElement);

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.SphereGeometry(1, 75, 100);
const material = new THREE.MeshBasicMaterial( { map: texture } );
const earth = new THREE.Mesh( geometry, material );
scene.add( earth );

camera.position.z = 5;
orbit.update();


function animate() {
	requestAnimationFrame( animate );
  earth.rotation.y += 0.001;
	renderer.render( scene, camera );
}

animate();
