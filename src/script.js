import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { Material } from 'three'
import { mergeWithCustomize } from 'webpack-merge'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//fog
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping


/**
 * House
 */

const house = new THREE.Group()
scene.add(house)

const wall = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshStandardMaterial({
                                    map: bricksColorTexture,
                                    aoMap: bricksAmbientOcclusionTexture,
                                    normalMap: bricksNormalTexture,
                                    roughnessMap: bricksRoughnessTexture }) 
)

wall.position.y = 1.5

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3, 3, 4),
    new THREE.MeshStandardMaterial({ color: 0x3f2323})
)

roof.position.y = 3 + 1.5
roof.rotation.y = Math.PI * 0.25

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2),
    new THREE.MeshStandardMaterial({ 
                                    map: doorColorTexture,
                                    transparent:true,
                                    alphaMap: doorAlphaTexture,
                                    aoMap: doorAmbientOcclusionTexture,
                                    displacementMap: doorHeightTexture,
                                    displacementScale: 0.1,
                                    normalMap: doorNormalTexture,
                                    metalnessMap: doorMetalnessTexture,
                                    roughnessMap: doorRoughnessTexture
                                 })
)

door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)

door.position.z = 1.5 + 0.01
door.position.y = 1.1

const bush1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 10, 10),
    new THREE.MeshStandardMaterial({ color: 0x89c854 })
)

bush1.position.z = 2
bush1.position.x = 1

const bush2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 10, 10),
    new THREE.MeshStandardMaterial({ color: 0x89c854 })
)

bush2.position.z = 2
bush2.position.x = 1.5

const bush3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 10, 10),
    new THREE.MeshStandardMaterial({ color: 0x89c854 })
)

bush3.position.z = 2
bush3.position.x = -1

const bush4 = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 10, 10),
    new THREE.MeshStandardMaterial({ color: 0x89c854 })
)

bush4.position.z = 2
bush4.position.x = -1.5

const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterials = new THREE.MeshStandardMaterial({ color: 0xdcdcdc })

for (let i = 0; i < 50; i++){
    const grave = new THREE.Mesh(graveGeometry, graveMaterials)

    const angle = Math.PI * 2 * Math.random()

    const radius = 3 + Math.random() * 6

    const x = radius * Math.sin(angle)
    const z = radius * Math.cos(angle)

    grave.rotation.y = (Math.random() - 0.5) * (Math.PI / 6)
    grave.rotation.z = (Math.random() - 0.5) * (Math.PI / 6)

    grave.castShadow = true

    grave.position.set(x, 0.2, z)
    graves.add(grave)
}

house.add(graves)
house.add(bush1, bush2, bush3, bush4)
house.add(door)
house.add(wall, roof)




// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
                                    map: grassColorTexture,
                                    aoMap: grassAmbientOcclusionTexture,
                                    normalMap: grassNormalTexture,
                                    roughnessMap: grassRoughnessTexture })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

//Pointer light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7)
scene.add(doorLight)

//ghost
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
const ghost2 = new THREE.PointLight('#ffff00', 2, 3)
const ghost3 = new THREE.PointLight('#00ffff', 2, 3)


scene.add(ghost1, ghost2, ghost3)

/**
 * Sizes
 */
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')


//shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

doorLight.castShadow = true
moonLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

wall.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

floor.receiveShadow = true

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.mapSize.far = 7

moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.mapSize.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.mapSize.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.mapSize.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.mapSize.far = 7





/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Ghost
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3)
    ghost1.position.z = Math.sin(ghost1Angle) * 4

    const ghost2Angle = elapsedTime * 0.5
    ghost2.position.x = - Math.cos(ghost2Angle) * 4
    ghost2.position.y = - Math.sin(elapsedTime * 3)
    ghost2.position.z = - Math.sin(ghost2Angle) * 4

    const ghost3Angle = elapsedTime * 1
    ghost3.position.x = Math.cos(ghost3Angle) * 8
    ghost3.position.y = Math.sin(elapsedTime * 3)
    ghost3.position.z = Math.sin(ghost3Angle) * 8

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()