import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import GUI from 'lil-gui'
import gsap from 'gsap';

// Debug
// const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Controls vars
let cameraPositionZ = 20
let cameraRotationY = 0

// Lights
const pointLight = new THREE.PointLight('#ffffff', 10, 10, 0.5)
pointLight.position.z = cameraPositionZ - 1.5
pointLight.castShadow = true

scene.add(pointLight)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
// scene.add(pointLightHelper);

const ambientLight = new THREE.AmbientLight('#ffffff', 0.01)
scene.add(ambientLight)

// Objects
const geometry = new THREE.IcosahedronGeometry()
const material = new THREE.MeshStandardMaterial({
  color: "rgb(227, 171, 18)",
  transparent: false
})

const positionModifier = 40

for (let i = 0; i < 100; i++) {
  const object = new THREE.Mesh(
    geometry,
    material
  )

  object.position.x = (Math.random() - 0.5) * positionModifier
  object.position.y = (Math.random() - 0.5) * positionModifier
  object.position.z = (Math.random() - 0.5) * positionModifier

  const scale = (Math.random() - 0.5) * 5

  object.scale.set(scale, scale, scale)

  const opacity = Math.random()

  if(opacity > 0.5) {    
    object.material.opacity = opacity
  }

  scene.add(object)
}

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 20
scene.add(camera)

// Keyboard controls
window.addEventListener('keydown', (e) => {
  if(e.key === 'w') {
    cameraPositionZ -= 1
  }

  if(e.key === 's') {
    cameraPositionZ += 1
  }

  if(e.key === 'd') {
    cameraRotationY -= 0.1
  }
  
  if(e.key === 'a') {
    cameraRotationY += 0.1
  }
  
  // Position
  gsap.to(camera.position, {z: cameraPositionZ, duration: 1});
  gsap.to(pointLight.position, {z: cameraPositionZ, duration: 1});

  // Rotation
  gsap.to(camera.rotation, {y: cameraRotationY, duration: 1});
})

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true
// controls.enabled = false

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Animate
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()