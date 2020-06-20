import SceneObject from './sceneObject'
import Plane from './plane'

export default class Box extends SceneObject {
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
    this.translateY(scaleY / -2)

    this.classList.add('scene-object--box')
  }

  update = () => {
    this.top.translate(0, 0, this.size.y / 2)
    this.bottom.translate(0, 0, this.size.y / 2)
    this.left.translate(0, 0, this.size.x / 2)
    this.right.translate(0, 0, this.size.x / 2)
    this.front.translate(0, 0, this.size.z / 2)
    this.back.translate(0, 0, this.size.z / 2)

    this.top.update()
    this.bottom.update()
    this.left.update()
    this.right.update()
    this.back.update()
    this.front.update()
    this.apply()
  }
}
