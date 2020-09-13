import SceneObject from './SceneObject'
import Plane from './Plane'

export default class Avatar extends SceneObject {
  constructor(className, scaleX = 1, scaleY = 1) {
    super(className)

    this.base = new Plane('scene-avatar--base', scaleX/2, scaleY/2)
    this.face = new Plane('scene-avatar--face', scaleX, scaleY)

    this.assemble(this.base)
    this.assemble(this.face)

    // this.scaleX(scaleX)
    // this.scaleY(scaleY)
    this.face.translateY(-175)
    // this.face.update()

    this.base.rotateX(90)
    // this.face.update()

    this.classList.add('scene-avatar')
  }

  faceTo = (sceneObject) => {
    this.face.rotateY(-sceneObject.rotation.y)
    this.face.update()
  }
}
