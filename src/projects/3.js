import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Lights
const pointLight = new THREE.PointLight('#ffffff', 10, 10, 0.5)
pointLight.position.y = 4
pointLight.position.z = 5
pointLight.castShadow = true

scene.add(pointLight)

const ambientLight = new THREE.AmbientLight('#ffffff', 0.01)
scene.add(ambientLight)

// Models
const gltfLoader = new GLTFLoader()

let mixer = null
let action = null

gltfLoader.load(
  '/models/zombies/scene.gltf',
  (gltf) => {
    mixer = new THREE.AnimationMixer(gltf.scene)
    action = mixer.clipAction(gltf.animations[0])
    // action.clampWhenFinished = true
    action.play()
    
    gltf.scene.scale.set(2, 2, 2)
    scene.add(gltf.scene)
  }
)

// Objects
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    color: '#9B7672'
  })
)
floor.rotation.x = Math.PI * 0.5
floor.position.y = 0.1
scene.add(floor)

// Play/pause animation
let isPlaying = true

const button = document.querySelector('#play-btn')
button.addEventListener('click', () => {

  if(isPlaying) {
    action.timeScale = 0
    isPlaying = false
    button.innerHTML = 'Play'
  } else {
    action.timeScale = 1
    isPlaying = true
    button.innerHTML = 'Pause'
  }
  
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
camera.position.z = 7
camera.position.y = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enabled = false

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

    // Update mixer
    if(mixer) {
      mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()