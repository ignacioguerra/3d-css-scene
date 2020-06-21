class Avatar extends SceneObject {
  constructor(className, scaleX = 1, scaleY = 1) {
    super(className)

    this.scaleX(scaleX)
    this.scaleY(scaleY)
    this.translateY(-1.7)
    this.update()

    this.classList.add('scene-avatar')
  }
}
