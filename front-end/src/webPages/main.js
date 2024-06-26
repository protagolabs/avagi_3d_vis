      
import * as THREE from "three";

import Stats from "three/addons/libs/stats.module.js";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// if using package manager: npm install @avaturn/sdk
// import { AvaturnSDK } from "https://cdn.jsdelivr.net/npm/@avaturn/sdk/dist/index.js";

let scene, renderer, camera,  animationGroup;
let model, mixer, clock;


export async function init(glb_url, container) {
  if (container.children.length > 0) {
        container.innerHTML = '';  // Clear the existing content in the container
    }

  // The WebGL renderer displays your beautifully crafted scenes using WebGL.
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // PerspectiveCamera: This projection mode is designed to mimic the way the human eye sees.
  camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );

  // OrbitControls: allow the camera to orbit around a target.
  const controls = new OrbitControls(camera, renderer.domElement);

  camera.position.set(0, 0.2, 1);
  controls.target.set(0, 0, 0);

  controls.update();

  clock = new THREE.Clock();
  animationGroup = new THREE.AnimationObjectGroup();
  mixer = new THREE.AnimationMixer(animationGroup);

  // Init lighting, ground plane, env map
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xc0c0c0);
  scene.fog = new THREE.Fog(0xc0c0c0, 20, 50);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(3, 3, 5);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = -2;
  dirLight.shadow.camera.left = -2;
  dirLight.shadow.camera.right = 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;
  dirLight.shadow.bias = -0.001;
  dirLight.intensity = 3;
  scene.add(dirLight);

  new RGBELoader().load("brown_photostudio_01.hdr", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  // Load default avatar
  await loadAvatar(glb_url);
  animate();
}


async function loadAvatar(url) {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(url);
    model = gltf.scene;
    scene.add(model);
  
    // Set some other params
    model.traverse(function (object) {
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        object.material.envMapIntensity = 0.3;
        // Turn off mipmaps to make textures look crispier (only use if texture resolution is 1k)
        if (object.material.map && !object.material.name.includes("hair")) {
          object.material.map.generateMipmaps = false;
        }
      }
    });

    animationGroup.add(model);
  }
  

function animate() {
    
  requestAnimationFrame(animate);
  let mixerUpdateDelta = clock.getDelta();
  mixer.update(mixerUpdateDelta);

  renderer.render(scene, camera);
}