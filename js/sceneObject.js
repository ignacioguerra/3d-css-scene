import SceneEmptyChild from './sceneEmptyChild'

export default class SceneObject extends SceneEmptyChild {
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
    this.style.marginLeft = `${this.width / -2}px`
    this.style.marginTop = `${this.height / -2}px`
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

  scaleX = (value) => {
    this.size.x = value
  }

  scaleY = (value) => {
    this.size.y = value
  }

  scaleZ = (value) => {
    this.size.z = value
  }

  translateX = (value) => {
    this.position.x = value
  }

  translateY = (value) => {
    this.position.y = value
  }

  translateZ = (value) => {
    this.position.z = value
  }

  rotateX = (value) => {
    this.rotation.x = value
  }

  rotateY = (value) => {
    this.rotation.y = value
  }
  // console.log(value) }

  rotateZ = (value) => {
    this.rotation.z = value
  }

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

  get x() {
    return this.position.x
      ? this.position.x * this.currentUnitValue
      : 0
  }

  get y() {
    return this.position.y
      ? this.position.y * this.currentUnitValue
      : 0
  }

  get z() {
    return this.position.z
      ? this.position.z * this.currentUnitValue
      : 0
  }

  /**
   * @param {number} value
   */
  set unitValue(value) {
    this.currentUnitValue = value
    for (let i = 0; i < this.pieces.length; i++)
      this.pieces[i].unitValue = value
    this.update()
  }
}
