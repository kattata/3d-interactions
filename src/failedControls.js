import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import * as CANNON from 'cannon-es'

// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('#b7abde')

// World
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)

// Lights
const ambientLight = new THREE.AmbientLight('#ffffff')

const pointLight = new THREE.PointLight('#ffffff', 1, 10, 0.5)
pointLight.position.y = 1.5
pointLight.position.z = 1
pointLight.position.x = 0.5
pointLight.castShadow = true

scene.add(ambientLight, pointLight)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial()
)
floor.rotation.x = (Math.PI / 2) * -1
floor.receiveShadow = true

scene.add(floor)

const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)

world.addBody(floorBody)


// Cube
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.5),
    new THREE.MeshStandardMaterial({color: '#ffffff'})
)
cube.position.y = 0.25
cube.position.z = -1
cube.castShadow = true
scene.add(cube)

// Sphere
let objectsToUpdate = [];

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 1,
    roughness: 0.2
})

const createSphere = (radius, position) => {
    // Three.js sphere
    const mesh = new THREE.Mesh(
        sphereGeometry,
        sphereMaterial
    )
    mesh.castShadow = true
    mesh.scale.set(radius, radius, radius)
    mesh.position.copy(position)
    mesh.name = 'sphere'
    scene.add(mesh)

    // Cannon.js body
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        shape,
    })
    body.position.copy(position)

    world.addBody(body)

    // Save to array
    objectsToUpdate.push({
        mesh,
        body
    })

    return { mesh, body }
}

const sphere = createSphere(0.2, { x: 0, y: 1, z: 1})

// Controls
let jump = false
let moveForward = false

function handleKeyDown (e) {
    if (e.key === 'w') {
        moveForward = true
    }
    
    if (e.keyCode === 32) {
        jump = true
    }
}

function handleKeyUp (e) {
    if (e.key === 'w') {
        moveForward = false
    }
    
    if (e.keyCode === 32) {
        jump = false
    }
}

window.addEventListener('keydown', handleKeyDown)
window.addEventListener('keyup', handleKeyUp)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

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

    // Update physics world
    world.step(1/60 , deltaTime, 3)

    for (const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }
    
    if(jump) {
        sphere.body.applyLocalForce(new CANNON.Vec3(0, 35, 0), new CANNON.Vec3(0, 0, 0))
        sphere.mesh.position.copy(sphere.body.position)
    }
    
    if(moveForward) {
        sphere.body.applyLocalForce(new CANNON.Vec3(0, 0, -1), new CANNON.Vec3(0, 0, 0))
        sphere.mesh.position.copy(sphere.body.position)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()