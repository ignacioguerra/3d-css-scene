import SceneObject from './SceneObject'

export default class Plane extends SceneObject {
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
