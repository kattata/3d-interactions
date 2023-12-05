import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import GUI from 'lil-gui'
import gsap from 'gsap';

// Debug
// const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Lights
const pointLight = new THREE.PointLight('#ffffff', 1, 3, 0.5)
pointLight.position.y = 1.5
pointLight.position.z = 2
pointLight.position.x = 0
pointLight.castShadow = true

scene.add(pointLight)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
// scene.add(pointLightHelper);

// Torus knot
const torusKnotMaterial = new THREE.MeshStandardMaterial({
  roughness: 0.2,
  metalness: 0,
  color: '#471a8f'
})

const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.4, 0.2, 100, 16),
  torusKnotMaterial
)
torusKnot.scale.set(1.4, 1.4)

scene.add(torusKnot)

// Mouse tracking
let cursor = {}

function handleMouseMove (e) {
  cursor.x = e.clientX / sizes.width
  cursor.y = e.clientY / sizes.height
}

window.addEventListener('mousemove', handleMouseMove)

// Firefly
let firefly = null
function createLight () {
  const group = new THREE.Group()
  scene.add(group)

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.03),
    new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: '#ffffff'
    })
  )

  group.add(sphere)

  const light = new THREE.PointLight('#ffebb0', 100, 100, 1)

  group.position.x = -1.5
  group.position.y= -1.5
  group.add(light)
  firefly = group
}

const fireflyBtn = document.querySelector('#firefly-btn')
fireflyBtn.addEventListener('click', () => {
  createLight()
})

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
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enabled = false

// Debug panel
// gui.add(torusKnotMaterial, 'metalness').step(0.01).min(0).max(2)
// gui.add(torusKnotMaterial, 'roughness').step(0.01).min(0).max(1)

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

    // Update lights

    // Position - Substract 0.5 to get a number between -0.5 and 0.5
    pointLight.position.x = (cursor.x - 0.5) * 3
    pointLight.position.y = (cursor.y - 0.5) * -3
    
    // Intensity - Linear interpolation to get number 0 - 1 - 0
    let intensity = 0

    if (cursor.x <= 0.5) {
      intensity =  2 * cursor.x;
    } else {
      intensity = 2 - (2 * cursor.x);
    }

    pointLight.intensity = intensity

    // Firefly
    if(firefly) {
      gsap.timeline().to(firefly.position, {
        x: `random(0, 4)`, 
        y: `random(0, 2)`,
        duration: 3,
        ease: "none",
        repeat: -1,
        yoyo: true,
        repeatRefresh: true
      });
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()