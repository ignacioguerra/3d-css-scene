/**
 * Creates a scene element
 * @author Ignacio Guerra <ignacio.guerra@nayra.coop>
 */
export default class SceneEmptyChild {
  constructor(className) {
    this.collectionId = -1
    this.currentUnitValue = 1
    this.pieces = []
    this.pieceId = 0
    this.element = document.createElement('div')
    this.element.style = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform-style: preserve-3d;
    `
    if (className) this.element.className = className
  }

  assemble(sceneEmptyChild) {
    sceneEmptyChild.unitValue = this.unitValue
    sceneEmptyChild.collectionId = this.pieceId++
    this.element.appendChild(sceneEmptyChild.element)
    this.pieces.push(sceneEmptyChild)
  }

  unassemble(piece) {
    const child = this.pieces.find(el => el.collectionId === piece.collectionId)
    if(child) this.element.removeChild(child.element)
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
    for (let i = 0; i < this.pieces.length; i++)
      this.pieces[i].unitValue = value
  }
}
