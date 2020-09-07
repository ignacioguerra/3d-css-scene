import SceneEmptyChild from './SceneEmptyChild'
import throttle from 'lodash.throttle'

/**
 * Creates a CSS3d Camera
 * @author Ignacio Guerra <ignacio.guerra@nayra.coop>
 */
export default class Camera {
  /**
   * @param {Scene} scene - The scene element
   * @todo localStorage to record position
   * @todo use gyroscope and touch interactions (only move forward)
   */
  constructor(scene) {
    this.cameraObject = new SceneEmptyChild('scene-camera')
    this.parentScene = scene
    this.worldAround = null
    this.viewerHeight = 175
    this.position = { x: 0, y: this.viewerHeight, z: 0 }
    this.rotation = { x: 0, y: 0, z: 0 }
    this.blank = { x: 0, y: 0, z: 0 }
    this.perspective = 600
    this.maxSpeed = this.viewerHeight * 0.05
    this.isRotating = false
    this.rotationTimeout = null
    this.speed = {
      front: 0,
      back: 0,
      left: 0,
      right: 0,
      top: 0,
    }
    this.movingTo = {
      front: false,
      back: false,
      left: false,
      right: false,
    }
    this.acceleration = 0.25
    this.settings = {
      mouseSensitivity: 0.1,
    }
    this.paused = true

    this.parentScene.viewport.addEventListener(
      'mousemove',
      this.mouseMoveHandler,
      false,
    )
    document.addEventListener('keypress', this.keyPressHandler, false)
    document.addEventListener('keyup', this.keyUpHandler, false)
    document.addEventListener('visibilitychange', this.stopMoving, false)
    document.addEventListener('contextmenu', this.stopMoving, false)
    window.addEventListener('resize', this.updatePerspective, false)

    this.updatePerspective()
    this.cameraObject.unitValue = this.parentScene.unitValue
    this.parentScene.append(this.cameraObject)

    this._broadcastMovement = throttle(this.broadcastMovement, 100)
  }

  move = () => {
    if (this.paused) {
      this.rotation.x += (this.blank.x - (this.rotation.x % 360)) * 0.05
      this.rotation.y += (this.blank.y - (this.rotation.y % 360)) * 0.05
      this.rotation.z += (this.blank.z - (this.rotation.z % 360)) * 0.05
    }

    const count =
      Number(this.movingTo.front) +
      Number(this.movingTo.back) +
      Number(this.movingTo.left) +
      Number(this.movingTo.right)
    let moveX = 0
    let moveZ = 0
    if (this.movingTo.front)
      this.speed.front += (this.maxSpeed - this.speed.front) * this.acceleration
    if (this.movingTo.back)
      this.speed.back += (this.maxSpeed - this.speed.back) * this.acceleration
    if (this.movingTo.left)
      this.speed.left += (this.maxSpeed - this.speed.left) * this.acceleration
    if (this.movingTo.right)
      this.speed.right += (this.maxSpeed - this.speed.right) * this.acceleration

    if (!this.movingTo.front) this.speed.front *= 1 - this.acceleration
    if (!this.movingTo.back) this.speed.back *= 1 - this.acceleration
    if (!this.movingTo.left) this.speed.left *= 1 - this.acceleration
    if (!this.movingTo.right) this.speed.right *= 1 - this.acceleration

    moveX += this.speed.front * Math.sin(Camera.radians(this.rotation.y))
    moveZ -= this.speed.front * Math.cos(Camera.radians(this.rotation.y))

    moveX -= this.speed.back * Math.sin(Camera.radians(this.rotation.y))
    moveZ += this.speed.back * Math.cos(Camera.radians(this.rotation.y))

    moveX -= this.speed.left * Math.cos(Camera.radians(this.rotation.y))
    moveZ -= this.speed.left * Math.sin(Camera.radians(this.rotation.y))

    moveX += this.speed.right * Math.cos(Camera.radians(this.rotation.y))
    moveZ += this.speed.right * Math.sin(Camera.radians(this.rotation.y))

    this.position.x += count > 0 ? moveX / count : moveX
    this.position.z += count > 0 ? moveZ / count : moveZ
    this.position.y += this.speed.top

    this.speed.top -= this.maxSpeed * 0.0375
    if (this.position.y < this.viewerHeight) {
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
    this._broadcastMovement()
    if (this.worldAround)
      this.worldAround.style.transform = `translate3d(${-this.x}px,${
        this.y
      }px,${-this.z}px)`
  }

  isMoving = () => {
    return (
      this.movingTo.front ||
      this.movingTo.back ||
      this.movingTo.left ||
      this.movingTo.right ||
      this.isRotating
    )
  }

  broadcastMovement = () => {
    this.isMoving() &&
      this.cameraObject.element.dispatchEvent(
        new CustomEvent('move', {
          detail: {
            posX: this.position.x,
            posY: this.position.y,
            posZ: this.position.z,
            rotX: this.rotation.x,
            rotY: this.rotation.y,
            rotZ: this.rotation.z,
          },
        }),
      )
  }

  updatePerspective = () => {
    this.perspective = (0.5 / Math.tan(6.981317)) * Math.min(innerWidth, innerHeight) // Math.min(this.parentScene.width, this.parentScene.height)
    this.parentScene.viewport.style.perspective = `${this.perspective}px`
  }

  static radians = (deg) => {
    return deg * (Math.PI / 180)
  }

  stopMoving = () => {
    this.movingTo.front = this.movingTo.back = this.movingTo.left = this.movingTo.right = false
  }

  unlink = () => {
    this.paused = true
    this.blank = {
      x: 0, // Math.abs(this.rotation.x%360) > 180 ? 360*(this.rotation.x < 0 ? -1 : 1) : 0,
      y: (Math.atan2(0 - this.position.x, this.position.z - -883) * 180) / Math.PI, //Math.abs(this.rotation.y%360) > 180 ? 360*(this.rotation.y < 0 ? -1 : 1) : 0,
      z: 0, // Math.abs(this.rotation.z%360) > 180 ? 360*(this.rotation.z < 0 ? -1 : 1) : 0
    }
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
    if (this.paused) return false

    // Will inform rotation
    this.isRotating = true
    clearTimeout(this.rotationTimeout)
    this.rotationTimeout = setTimeout(() => {
      this.isRotating = false
    }, 500)

    this.rotation.y += e.movementX * this.settings.mouseSensitivity
    this.rotation.x += -e.movementY * this.settings.mouseSensitivity
    if (this.rotation.x < -90) this.rotation.x = -90
    if (this.rotation.x > 90) this.rotation.x = 90
  }

  /**
   * Keypress Event
   * @event document~keypress
   */
  keyPressHandler = (e) => {
    e.preventDefault()
    if (this.paused) return false
    if (e.key.toLowerCase() === 'w' || e.keyCode === 'ArrowUp')
      this.movingTo.front = true
    if (e.key.toLowerCase() === 'a' || e.keyCode === 'ArrowLeft')
      this.movingTo.left = true
    if (e.key.toLowerCase() === 's' || e.keyCode === 'ArrowDown')
      this.movingTo.back = true
    if (e.key.toLowerCase() === 'd' || e.keyCode === 'ArrowRight')
      this.movingTo.right = true
    if (e.key === ' ' && this.position.y < this.viewerHeight + 0.01) {
      this.speed.top = this.maxSpeed * 0.625
    }
  }

  /**
   * Keyup Event
   * @event document~keyup
   */
  keyUpHandler = (e) => {
    e.preventDefault()
    if (this.paused) return false
    if (e.key.toLowerCase() === 'w' || e.keyCode === 'ArrowUp')
      this.movingTo.front = false
    if (e.key.toLowerCase() === 'a' || e.keyCode === 'ArrowLeft')
      this.movingTo.left = false
    if (e.key.toLowerCase() === 's' || e.keyCode === 'ArrowDown')
      this.movingTo.back = false
    if (e.key.toLowerCase() === 'd' || e.keyCode === 'ArrowRight')
      this.movingTo.right = false
  }

  /**
   * Links the camera with an ambient
   * @param {SceneEmptyChild} ambient - Scene object that represents the ambient
   */
  place(ambient) {
    if (ambient instanceof SceneEmptyChild) {
      this.worldAround = ambient
      this.cameraObject.assemble(this.worldAround)
    }
  }

  get y() {
    return this.position.y * this.cameraObject.unitValue
  }

  get x() {
    return this.position.x * this.cameraObject.unitValue
  }

  get z() {
    return this.position.z * this.cameraObject.unitValue
  }
}
