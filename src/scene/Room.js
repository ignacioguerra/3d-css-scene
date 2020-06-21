import SceneObject from './SceneObject'
import Plane from './Plane'

export default class Room extends SceneObject {
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
    this.translateY(scaleY / -2)

    this.classList.add('scene-object--room')
  }

  update = () => {
    this.floor.translate(0, 0, this.size.y / -2)
    this.east.translate(0, 0, this.size.x / -2)
    this.west.translate(0, 0, this.size.x / -2)
    this.north.translate(0, 0, this.size.z / -2)
    this.south.translate(0, 0, this.size.z / -2)

    this.floor.update()
    this.east.update()
    this.west.update()
    this.south.update()
    this.north.update()
    this.apply()
  }
}
