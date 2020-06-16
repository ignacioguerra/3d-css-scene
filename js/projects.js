class Scene {

  constructor() {
    this.playState = 'paused'
    this.viewport = this.createElement('scene-viewport')
    this.unitValue = 35
    this.ambient = new SceneEmptyChild('scene-ambient')
    this.camera = new Camera(this)
    this.objects = []
    this.parentNode = null

    this.viewport.addEventListener('mousedown', this.mouseDownHandler, false)
    document.addEventListener('pointerlockchange', this.pointerLockChangeHandler, false)
    document.addEventListener('keypress', this.keyPressHandler, false)

    this.paused = true
    this.camera.place(this.ambient)
    this.render()
  }

  render = () => {
    
    this.camera.update()
    requestAnimationFrame(this.render)
  }

  createPlane = (className, scaleX, scaleY) => {
    const plane = new Plane(className, scaleX, scaleY)
    plane.unitValue = this.unitValue
    this.objects.push(plane)
    this.ambient.assemble(plane)
    return plane
  }

  createBox = (className, scaleX, scaleY, scaleZ) => {
    const box = new Box(className, scaleX, scaleY, scaleZ)
    box.unitValue = this.unitValue
    this.objects.push(box)
    this.ambient.assemble(box)
    return box
  }

  createRoom = (className, scaleX, scaleY, scaleZ) => {
    const room = new Room(className, scaleX, scaleY, scaleZ)
    room.unitValue = this.unitValue
    this.objects.push(room)
    this.ambient.assemble(room)
    return room
  }

  /**
   * Appends child of the scene element
   * @param {(Element|SceneEmptyChild)} child - Child node
   * @returns {(Element|SceneEmptyChild)} Same child node
   */
  append = (child) => {
    if(child instanceof Element) this.viewport.appendChild(child)
    else if(child instanceof SceneEmptyChild) this.viewport.appendChild(child.element)
    return child
  }

  mount = (parentId) => {
    const parent = document.getElementById(parentId)
    if(parent) {
      this.parentNode = parent
      this.parentNode.appendChild(this.viewport)
    }
  }

  /**
   * Creates and return an empty element
   * @param {string} className - Class name of created element
   */
  createElement = (className) => {
    let container = document.createElement('div')
    container.style = `
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    `
    container.className = 'scene-viewport'
    document.body.appendChild(container)
    return container
  }

  /**
   * @param {boolean} pause
   */
  set paused(pause) {
    if(pause) {
      this.playState = 'paused'
      this.camera.unlink()
    } else {
      this.playState = 'running'
      this.camera.link()
    }
  }

  pause = () => {
    this.pased = true
    this.camera.unlink()
  }

  /**
   * Mousedown Event
   * @event viewport~mousedown
   */
  mouseDownHandler = (e) => {
    this.viewport.requestPointerLock()
    this.paused = false
  }

  /**
   * Mousedown Event
   * @event viewport~mousedown
   */
  pointerLockChangeHandler = (e) => {
    if(document.pointerLockElement !== this.viewport) this.paused = true
  }

  /**
   * Keypress Event
   * @event document~keypress
   */
  keyPressHandler = (e) => {
    e.preventDefault()
    if(e.key.toLowerCase() === 'Escape') {
      this.paused = true
    }
  }

  /**
   * Element.classList of the Scene element
   * @readonly
   */
  get classList() { return this.viewport.classList }

  /**
   * Element.style of the Scene element
   * @readonly
   */
  get style() { return this.viewport.style }

  /**
   * Width of the Scene element
   * @readonly
   */
  get width() { return this.viewport.offsetWidth }

  /**
   * Height of the Scene element
   * @readonly
   */
  get height() { return this.viewport.offsetHeight }

}

/**
 * Creates a CSS3d Camera
 * @author Ignacio Guerra <ignacio.guerra@nayra.coop>
 */
class Camera {

  /**
   * @param {Scene} scene - The scene element
   * @todo localStorage to record position
   * @todo use gyroscope and touch interactions (only move forward)
   */
  constructor(scene) {
    this.cameraObject = new SceneEmptyChild('scene-camera')
    this.parentScene = scene
    this.worldArround = null
    this.viewerHeight = 1.75
    this.position = { x: 0, y: this.viewerHeight, z: 0 }
    this.rotation = { x: 0, y: 0, z: 0 }
    this.blank = { x: 0, y: 0, z: 0 }
    this.perspective = 600
    this.maxSpeed = 0.2
    this.speed = {
      front: 0,
      back: 0,
      left: 0,
      right: 0,
      top: 0
    }
    this.movingTo = {
      front: false,
      back: false,
      left: false,
      right: false
    }
    this.acceleration = 0.25
    this.settings = {
      mouseSensitivity: 0.1
    }
    this.paused = true

    this.parentScene.viewport.addEventListener('mousemove', this.mouseMoveHandler, false)
    document.addEventListener('keypress', this.keyPressHandler, false)
    document.addEventListener('keyup', this.keyUpHandler, false)
    document.addEventListener('visibilitychange', this.stopMoving, false)
    document.addEventListener('contextmenu', this.stopMoving, false)
    window.addEventListener('resize', this.updatePerspective, false)

    this.updatePerspective()
    this.cameraObject.unitValue = this.parentScene.unitValue
    this.parentScene.append(this.cameraObject)
  }

  move = () => {

    if(this.paused) {
      this.rotation.x += (this.blank.x-this.rotation.x)*0.05
      this.rotation.y += (this.blank.y-this.rotation.y)*0.05
      this.rotation.z += (this.blank.z-this.rotation.z)*0.05
    }

    const count = Number(this.movingTo.front) + Number(this.movingTo.back) + Number(this.movingTo.left) + Number(this.movingTo.right)
    let moveX = 0
    let moveZ = 0
    if(this.movingTo.front) this.speed.front += (this.maxSpeed-this.speed.front) * this.acceleration
    if(this.movingTo.back) this.speed.back += (this.maxSpeed-this.speed.back) * this.acceleration
    if(this.movingTo.left) this.speed.left += (this.maxSpeed-this.speed.left) * this.acceleration
    if(this.movingTo.right) this.speed.right += (this.maxSpeed-this.speed.right) * this.acceleration

    if(!this.movingTo.front) this.speed.front *= 1-this.acceleration
    if(!this.movingTo.back) this.speed.back *= 1-this.acceleration
    if(!this.movingTo.left) this.speed.left *= 1-this.acceleration
    if(!this.movingTo.right) this.speed.right *= 1-this.acceleration

    moveX += this.speed.front * Math.sin(Camera.radians(this.rotation.y))
    moveZ -= this.speed.front * Math.cos(Camera.radians(this.rotation.y))

    moveX -= this.speed.back * Math.sin(Camera.radians(this.rotation.y))
    moveZ += this.speed.back * Math.cos(Camera.radians(this.rotation.y))

    moveX -= this.speed.left * Math.cos(Camera.radians(this.rotation.y))
    moveZ -= this.speed.left * Math.sin(Camera.radians(this.rotation.y))

    moveX += this.speed.right * Math.cos(Camera.radians(this.rotation.y))
    moveZ += this.speed.right * Math.sin(Camera.radians(this.rotation.y))

    this.position.x += count > 0 ? moveX/count : moveX
    this.position.z += count > 0 ? moveZ/count : moveZ
    this.position.y += this.speed.top;

    this.speed.top -= 0.00625
    if(this.position.y < this.viewerHeight) {
      this.position.y = this.viewerHeight
      this.speed.top = 0
    }
  }

  update = () => {
    this.cameraObject.style.transform = `
      translate3d(0px,0px,${this.perspective}px) 
      rotateX(${this.rotation.x}deg) 
      rotateY(${this.rotation.y}deg) 
      rotateZ(${this.rotation.z}deg) 
      skewX(0) skewY(0)
    `
    this.move()
    if(this.worldArround) this.worldArround.style.transform = `translate3d(${-this.x}px,${this.y}px,${-this.z}px)`
  }

  updatePerspective = () => {
    this.perspective = (0.5 / Math.tan(6.981317)) * Math.min(innerWidth, innerHeight) // Math.min(this.parentScene.width, this.parentScene.height)
    this.parentScene.viewport.style.perspective = `${this.perspective}px`
  }

  static radians = (deg) => {
    return deg * (Math.PI/180)
  }

  stopMoving = () => {
    this.movingTo.front = this.movingTo.back = this.movingTo.left = this.movingTo.right = false
  }

  unlink = () => {
    this.paused = true
    this.stopMoving()
  }

  link = () => {
    this.paused = false
  }

  /**
   * Mousemove Event
   * @event viewport~mousemove
   */
  mouseMoveHandler = (e) => {
    if(this.paused) return false
    this.rotation.y += e.movementX * this.settings.mouseSensitivity
    this.rotation.x += -e.movementY * this.settings.mouseSensitivity
    if(this.rotation.x < -90) this.rotation.x = -90
    if(this.rotation.x > 90) this.rotation.x = 90
  }

  /**
   * Keypress Event
   * @event document~keypress
   */
  keyPressHandler = (e) => {
    e.preventDefault()
    if(this.paused) return false
    if(e.key.toLowerCase() === 'w' || e.keyCode === 'ArrowUp') this.movingTo.front = true
    if(e.key.toLowerCase() === 'a' || e.keyCode === 'ArrowLeft') this.movingTo.left = true
    if(e.key.toLowerCase() === 's' || e.keyCode === 'ArrowDown') this.movingTo.back = true
    if(e.key.toLowerCase() === 'd' || e.keyCode === 'ArrowRight') this.movingTo.right = true
    if(e.key === ' ' && this.position.y < this.viewerHeight + 0.01) {
      this.speed.top = 0.1
    }
  }

  /**
   * Keyup Event
   * @event document~keyup
   */
  keyUpHandler = (e) => {
    e.preventDefault()
    if(this.paused) return false
    if(e.key.toLowerCase() === 'w' || e.keyCode === 'ArrowUp') this.movingTo.front = false
    if(e.key.toLowerCase() === 'a' || e.keyCode === 'ArrowLeft') this.movingTo.left = false
    if(e.key.toLowerCase() === 's' || e.keyCode === 'ArrowDown') this.movingTo.back = false
    if(e.key.toLowerCase() === 'd' || e.keyCode === 'ArrowRight') this.movingTo.right = false
  }

  /**
   * Links the camera with an ambient
   * @param {SceneEmptyChild} ambient - Scene object that represents the ambient
   */
  place(ambient) {
    if(ambient instanceof SceneEmptyChild) {
      this.worldArround = ambient
      this.cameraObject.assemble(this.worldArround)
    }
  }

  get y() { return this.position.y * this.cameraObject.unitValue }

  get x() { return this.position.x * this.cameraObject.unitValue }

  get z() { return this.position.z * this.cameraObject.unitValue }
  
}

/**
 * Creates a scene element
 * @author Ignacio Guerra <ignacio.guerra@nayra.coop>
 */
class SceneEmptyChild {

  constructor(className) {
    this.currentUnitValue = 1
    this.pieces = []
    this.element = document.createElement('div')
    this.element.style = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform-style: preserve-3d;
    `
    if(className) this.element.className = className
  }

  assemble(sceneEmptyChild) {
    sceneEmptyChild.unitValue = this.unitValue
    this.element.appendChild(sceneEmptyChild.element)
    this.pieces.push(sceneEmptyChild)
  }
  
  /**
   * Element id
   */
  get id() {
    return this.element.id
  }

  /**
   * Unit value
   */
  get unitValue() {
    return this.currentUnitValue
  }

  /**
   * Element.classList of the SceneEmptyChild element
   * @readonly
   */
  get classList() {
    return this.element.classList
  }

  /**
   * Element.style of the SceneEmptyChild element
   * @readonly
   */
  get style() {
    return this.element.style
  }

  /**
   * @param {string} id
   */
  set id(id) {
    this.element.id = id
  }

  /**
   * @param {number} value
   */
  set unitValue(value) {
    this.currentUnitValue = value
    for(let i = 0; i < this.pieces.length; i++) this.pieces[i].unitValue = value
  }

}

class SceneObject extends SceneEmptyChild {

  constructor(className) {
    super(className)
    this.size = { x: 1, y: 1, z: 0 }
    this.position = { x: 0, y: 0, z: 0 }
    this.rotation = { x: 0, y: 0, z: 0 }

    this.classList.add('scene-object')
  }

  apply = () => {
    this.style.width = `${this.width}px`
    this.style.height = `${this.height}px`
    this.style.marginLeft = `${this.width/-2}px`
    this.style.marginTop = `${this.height/-2}px`
    this.style.transform = `
      rotateX(${this.rotation.x}deg) 
      rotateY(${this.rotation.y}deg) 
      rotateZ(${this.rotation.z}deg) 
      translate3d(${this.x}px,${this.y}px,${this.z}px) 
      skewX(0) skewY(0)
    `
  }
  
  update = () => {
    this.apply()
  }

  scale = (x = 1, y = 1, z = 0) => {
    this.scaleX(x)
    this.scaleY(y)
    this.scaleZ(z)
  }

  translate = (x = 1, y = 1, z = 0) => {
    this.translateX(x)
    this.translateY(y)
    this.translateZ(z)
  }

  rotate = (x = 1, y = 1, z = 0) => {
    this.rotateX(x)
    this.rotateY(y)
    this.rotateZ(z)
  }


  scaleX = (value) => { this.size.x = value }

  scaleY = (value) => { this.size.y = value }

  scaleZ = (value) => { this.size.z = value }

  translateX = (value) => { this.position.x = value }

  translateY = (value) => { this.position.y = value }

  translateZ = (value) => { this.position.z = value }

  rotateX = (value) => { this.rotation.x = value }

  rotateY = (value) => { this.rotation.y = value
  console.log(value) }

  rotateZ = (value) => { this.rotation.z = value }

  /**
   * Width in pixels
   * @readonly
   */
  get width() {
    return this.size.x * this.currentUnitValue
  }

  /**
   * Height in pixels
   * @readonly
   */
  get height() {
    return this.size.y * this.currentUnitValue
  }

  /**
   * Depth in pixels
   * @readonly
   */
  get depth() {
    return this.size.z * this.currentUnitValue
  }
  
  get x() { return this.position.x ? this.position.x * this.currentUnitValue : 0 }

  get y() { return this.position.y ? this.position.y * this.currentUnitValue : 0 }

  get z() { return this.position.z ? this.position.z * this.currentUnitValue : 0 }

  /**
   * @param {number} value
   */
  set unitValue(value) {
    this.currentUnitValue = value
    for(let i = 0; i < this.pieces.length; i++) this.pieces[i].unitValue = value
    this.update()
  }

}

class Room extends SceneObject {

  constructor(className, scaleX = 1, scaleY = 1, scaleZ = 1) {
    super(className)

    this.floor = new Plane('scene-object--room-floor', scaleX, scaleZ)
    this.east = new Plane('scene-object--room-wall', scaleZ, scaleY)
    this.west = new Plane('scene-object--room-wall', scaleZ, scaleY)
    this.north = new Plane('scene-object--room-wall', scaleX, scaleY)
    this.south = new Plane('scene-object--room-wall', scaleX, scaleY)

    this.east.classList.add('scene-object--room-wall--east')
    this.west.classList.add('scene-object--room-wall--west')
    this.north.classList.add('scene-object--room-wall--north')
    this.south.classList.add('scene-object--room-wall--south')

    this.assemble(this.east)
    this.assemble(this.floor)
    this.assemble(this.west)
    this.assemble(this.south)
    this.assemble(this.north)

    this.floor.rotateX(90)
    this.east.rotateY(90)
    this.west.rotateY(270)
    this.south.rotateY(180)

    this.scaleX(scaleX)
    this.scaleY(scaleY)
    this.scaleZ(scaleZ)
    this.translateY(scaleY/-2)

    this.classList.add('scene-object--room')
  }

  update = () => {
    this.floor.translate(0, 0, this.size.y/-2)
    this.east.translate(0, 0, this.size.x/-2)
    this.west.translate(0, 0, this.size.x/-2)
    this.north.translate(0, 0, this.size.z/-2)
    this.south.translate(0, 0, this.size.z/-2)

    this.floor.update()
    this.east.update()
    this.west.update()
    this.south.update()
    this.north.update()
    this.apply()
  }

}

class Plane extends SceneObject {
  constructor(className, scaleX = 1, scaleY = 1) {
    super(className)
    
    this.scaleX(scaleX)
    this.scaleY(scaleY)
    this.update()

    this.classList.add('scene-object--plane')
    this.style.pointerEvents = 'none'
  }

  insert = (child) => {
    this.element.appendChild(child)
  }
}

class Box extends SceneObject {
  constructor(className, scaleX = 1, scaleY = 1, scaleZ = 1) {
    super(className)

    this.top = new Plane('scene-object--box-face', scaleX, scaleZ)
    this.bottom = new Plane('scene-object--box-face', scaleX, scaleZ)
    this.left = new Plane('scene-object--box-face', scaleZ, scaleY)
    this.right = new Plane('scene-object--box-face', scaleZ, scaleY)
    this.front = new Plane('scene-object--box-face', scaleX, scaleY)
    this.back = new Plane('scene-object--box-face', scaleX, scaleY)

    this.left.classList.add('scene-object--box-face--side')
    this.right.classList.add('scene-object--box-face--side')
    this.front.classList.add('scene-object--box-face--side')
    this.back.classList.add('scene-object--box-face--side')
    this.top.classList.add('scene-object--box-face--top')
    this.bottom.classList.add('scene-object--box-face--bottom')
    this.left.classList.add('scene-object--box-face--left')
    this.right.classList.add('scene-object--box-face--right')
    this.front.classList.add('scene-object--box-face--front')
    this.back.classList.add('scene-object--box-face--back')

    this.assemble(this.top)
    this.assemble(this.left)
    this.assemble(this.bottom)
    this.assemble(this.right)
    this.assemble(this.back)
    this.assemble(this.front)

    this.top.rotateX(90)
    this.bottom.rotateX(270)
    this.left.rotateY(270)
    this.right.rotateY(90)
    this.back.rotateY(180)

    this.scaleX(scaleX)
    this.scaleY(scaleY)
    this.scaleZ(scaleZ)
    this.translateY(scaleY/-2)

    this.classList.add('scene-object--box')
  }

  update = () => {
    this.top.translate(0, 0, this.size.y/2)
    this.bottom.translate(0, 0, this.size.y/2)
    this.left.translate(0, 0, this.size.x/2)
    this.right.translate(0, 0, this.size.x/2)
    this.front.translate(0, 0, this.size.z/2)
    this.back.translate(0, 0, this.size.z/2)

    this.top.update()
    this.bottom.update()
    this.left.update()
    this.right.update()
    this.back.update()
    this.front.update()
    this.apply()
  }
}

let scene = new Scene()
let plane = scene.createPlane('floor', 4, 4)

plane.id = 'pruebaa'
plane.translate(-10, 0, -20)
plane.translateY(-6)
plane.update()

let h1 = document.getElementById('test-content')
plane.insert(h1)


let box = scene.createBox('box', 4, 1, 12)
box.translateZ(-20)
box.rotateY(35)
box.rotateZ(65)
box.id = 'pruebaa2'
box.update()


let room = scene.createRoom('room', 40, 22.5, 50)
room.translateZ(-22)
room.update()

let iframe = document.createElement('iframe')
iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ'
iframe.frameborder="0" 
iframe.allow="autoplay; encrypted-media;"
room.north.insert(iframe)

// room.floor.insert(h1)

let stage = scene.createBox('stage', 40, 1.65, 6)
stage.translateZ(-44)
stage.id = 'pruebaa2'
stage.update()

let step = scene.createBox('step', 5, 1.12, 1.5)
step.translateX(-17.5)
step.translateZ(-40)
step.update()

let step2 = scene.createBox('step', 5, 0.57, 1.5)
step2.translateX(-17.5)
step2.translateZ(-38)
step2.update()




/**
 * @todo Spacialized audio
 */
/*
const AudioContext = window.AudioContext || window.webkitAudioContext;



document.addEventListener('click', function() {
  const audioCtx = new AudioContext();
  const listener = audioCtx.listener;

  posX = scene.camera.position.x*scene.unitValue;
  posY = scene.camera.position.y*scene.unitValue;
  posZ = scene.camera.position.z*scene.unitValue;

  if(listener.positionX) {
    listener.positionX.value = posX;
    listener.positionY.value = posY;
    listener.positionZ.value = posZ-5;
  } else {
    listener.setPosition(posX, posY, posZ-5);
  }

  if(listener.forwardX) {
    listener.forwardX.value = Math.sin(scene.camera.position.x);
    listener.forwardY.value = Math.sin(scene.camera.position.y);
    listener.forwardZ.value = Math.sin(scene.camera.position.z);
    listener.upX.value = 0;
    listener.upY.value = 1;
    listener.upZ.value = 0;
  } else {
    listener.setOrientation(Math.sin(scene.camera.position.x), Math.sin(scene.camera.position.y), Math.sin(scene.camera.position.z), 0, 1, 0);
  }





const pannerModel = 'HRTF';
const innerCone = 60;
const outerCone = 90;
const outerGain = 0.3;

const distanceModel = 'linear';
const maxDistance = 10000;
const refDistance = 1;
const rollOff = 10;

const positionX = 0;//box.position.x*scene.unitValue;
const positionY = 0;//box.position.y*scene.unitValue;
const positionZ = 0;//box.position.z*scene.unitValue;

const orientationX = 0;//Math.sin(box.rotation.x);
const orientationY = 0;//Math.sin(box.rotation.y);
const orientationZ = -1;//Math.sin(box.rotation.z);

const panner = new PannerNode(audioCtx, {
  panningModel: pannerModel,
  distanceModel: distanceModel,
  positionX: positionX,
  positionY: positionY,
  positionZ: positionZ,
  orientationX: orientationX,
  orientationY: orientationY,
  orientationZ: orientationZ,
  refDistance: refDistance,
  maxDistance: maxDistance,
  rolloffFactor: rollOff,
  coneInnerAngle: innerCone,
  coneOuterAngle: outerCone,
  coneOuterGain: outerGain
})

setInterval(() => {
  posX = scene.camera.position.x*scene.unitValue;
posY = scene.camera.position.y*scene.unitValue;
posZ = scene.camera.position.z*scene.unitValue;

if(listener.positionX) {
  listener.positionX.value = posX;
  listener.positionY.value = posY;
  listener.positionZ.value = posZ-5;
} else {
  listener.setPosition(posX, posY, posZ-5);
}
if(listener.forwardX) {
  listener.forwardX.value = Math.sin(scene.camera.position.x);
  listener.forwardY.value = Math.sin(scene.camera.position.y);
  listener.forwardZ.value = Math.sin(scene.camera.position.z);
  listener.upX.value = 0;
  listener.upY.value = 1;
  listener.upZ.value = 0;
} else {
  listener.setOrientation(Math.sin(scene.camera.position.x), Math.sin(scene.camera.position.y), Math.sin(scene.camera.position.z), 0, 1, 0);
}
}, 100)

const audioElement = document.querySelector('audio');

const track = audioCtx.createMediaElementSource(audioElement);
const pannerOptions = {pan: 0};
	const stereoPanner = new StereoPannerNode(audioCtx, pannerOptions);
track.connect(panner).connect(audioCtx.destination);

  console.log("play!")
  audioElement.play();
})*/