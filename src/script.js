import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import gsap from 'gsap'
import GUI from 'lil-gui'

/**
 * Debug
 */
const gui = new GUI({
    width: 300,
    title: 'Settings',
    closeFolders: false
})
// gui.close()
// gui.hide()
window.addEventListener('keydown', (event) => {
    if (event.key == 'h')
        gui.show(gui._hidden)
})

const debugObject = {}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
debugObject.color = '#a778d8'

const stockinhZoneData = {
    depth: 1,
    width: 5,
    height: 6,
}

const shelf = {
    depth: 1,
    width: 1,
    height: 0.9,
    beamWidth: 0.2,
    beamDepth: 0.1,
}
const data = {
    count: 0
}
let instancedMesh;



const geometry = new THREE.BoxGeometry(stockinhZoneData.width+0.01, stockinhZoneData.height+0.01, stockinhZoneData.depth + 0.1)
const material = new THREE.MeshBasicMaterial({ color: 'grey', transparent: true, opacity: 0.5 })
const totalZone = new THREE.Mesh(geometry, material)
scene.add(totalZone)

const totalZoneTweaks = gui.addFolder('Stocking Area');

// totalZoneTweaks
//     .add(stockinhZoneData, "depth")
//     .min(1)
//     .max(20)
//     .step(0.5)
//     .name("Depth").onFinishChange(() => {
//         instancedMesh = createTotalZone();
//     })

totalZoneTweaks
    .add(stockinhZoneData, "width")
    .min(1)
    .max(20)
    .step(0.5)
    .name("Width")
    .onFinishChange(() => {
        instancedMesh = createTotalZone();
    })

totalZoneTweaks
    .add(stockinhZoneData, "height")
    .min(1)
    .max(20)
    .step(0.5)
    .name("Height")
    .onFinishChange(() => {
        instancedMesh = createTotalZone();
    })

const shelfTweaks = gui.addFolder('Shelf Dimension');

shelfTweaks
    .add(shelf, "width")
    .min(1)
    .max(stockinhZoneData.width)
    .step(0.5)
    .name("Width")
    .onFinishChange(() => {
        instancedMesh = createShelf()
    })

shelfTweaks
    .add(shelf, "height")
    .min(1)
    .max(stockinhZoneData.height)
    .step(0.5)
    .name("Height")
    .onFinishChange(() => {
        instancedMesh = createShelf();
    })
const result = gui.addFolder("Result");

result.add(data, "count").name("Shelf Count").listen()


const createShelf = () => {

    if (instancedMesh) {
        console.log("instancecount", instancedMesh);
        scene.remove(instancedMesh)
        instancedMesh.geometry.dispose();
        instancedMesh.material.dispose();
        instancedMesh = null
        // instancedMesh.dispose();
    }
    const widthShelfCount = Math.floor((stockinhZoneData.width - 0.5) / shelf.width);
    const heightShelfCount = Math.floor(stockinhZoneData.height / shelf.height);
    const instanceCount = widthShelfCount * heightShelfCount;
    
    data.count =  instanceCount;
    result.setva;
    const geom = [];
    for(let i = 0; i<2 ; i++){
        for(let j= 0; j<2 ; j++){
            const laterteralBeam = new THREE.BoxGeometry(shelf.beamWidth, shelf.height, shelf.beamDepth);
            laterteralBeam.translate( ((i*2) -1)*(shelf.beamWidth-shelf.width)/2,0,((j*2) -1)*(shelf.beamDepth - shelf.depth)/2);
            geom.push(laterteralBeam);
        }
        let laterteralBeam = new THREE.BoxGeometry(shelf.beamWidth-0.01, shelf.beamDepth, shelf.depth);
        laterteralBeam.translate( ((i*2) -1)*(shelf.beamWidth-shelf.width)/2,-shelf.height/2, 0);
        geom.push(laterteralBeam);
        laterteralBeam = new THREE.BoxGeometry(shelf.width, shelf.beamWidth, shelf.beamDepth);
        laterteralBeam.translate( 0,shelf.beamWidth-shelf.height/2, ((i*2) -1)*(shelf.beamDepth-shelf.depth)/2);
        geom.push(laterteralBeam);
    }
    
    const geometry= BufferGeometryUtils.mergeBufferGeometries(geom);

    const material = new THREE.MeshBasicMaterial()
    instancedMesh = new THREE.InstancedMesh(
        geometry,
        material,
        instanceCount
    );

    const matrix = new THREE.Matrix4();
    const xStep = stockinhZoneData.width / widthShelfCount;
    const yStep = stockinhZoneData.height / heightShelfCount;


    for (let i = 0; i < widthShelfCount; i++) {
        for (let j = 0; j < heightShelfCount; j++) {
            const x = i * xStep - (stockinhZoneData.width - shelf.width) / 2; // Adjust the spacing between instances
            const y = j * yStep - (stockinhZoneData.height - shelf.height) / 2;
            const color = (i + j) % 2 === 0 ? new THREE.Color(1, 0, 0) : new THREE.Color(0, 1, 0);
            matrix.makeTranslation(x, y, 0);
            instancedMesh.setMatrixAt(i * heightShelfCount + j, matrix);
            instancedMesh.setColorAt(i * heightShelfCount + j, color);
            instancedMesh.instanceColor.needsUpdate = true
        }
    }
    //instancedMesh.instanceColor.needsUpdate = true
    scene.add(instancedMesh);
    return instancedMesh;
}
createShelf();
const createTotalZone = () => {
    totalZone.geometry.dispose()
    totalZone.geometry = new THREE.BoxGeometry(
        stockinhZoneData.width+0.01, stockinhZoneData.height+0.01, stockinhZoneData.depth + 0.1
    )
    return createShelf();
}

// const cubeTweaks = gui.addFolder('Awesome cube')
// // cubeTweaks.close()

// cubeTweaks
//     .add(totalZone.position, 'y')
//     .min(- 3)
//     .max(3)
//     .step(0.01)
//     .name('elevation')

// cubeTweaks
//     .add(totalZone, 'visible')

// cubeTweaks
//     .add(material, 'wireframe')

// cubeTweaks
//     .addColor(debugObject, 'color')
//     .onChange(() => {
//         material.color.set(debugObject.color)
//     })

// debugObject.spin = () => {
//     gsap.to(totalZone.rotation, { duration: 1, y: totalZone.rotation.y + Math.PI * 2 })
// }
// cubeTweaks
//     .add(debugObject, 'spin')

// debugObject.subdivision = 2
// cubeTweaks
//     .add(debugObject, 'subdivision')
//     .min(1)
//     .max(20)
//     .step(1)
//     .onFinishChange(() => {
//         totalZone.geometry.dispose()
//         console.log("yo")
//         totalZone.geometry = new THREE.BoxGeometry(
//             1, 1, 1,
//             debugObject.subdivision, debugObject.subdivision, 1
//         )
//     })

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 10
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()