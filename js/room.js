class Room {
  
  constructor(width = 1680, depth = 1050, height = 500, x = 0, z = 0) {

    this.width = width
    this.height = height
    this.depth = depth
    this.x = x
    this.z = z

    this.el = document.createElement('section')
    this.floor = document.createElement('div')
    this.walls = {
      north: document.createElement('div'),
      south: document.createElement('div'),
      east: document.createElement('div'),
      west: document.createElement('div')
    }

    this.el.classList.add('room')
    
    this.floor.classList.add('floor')
    this.floor.style.width = `${this.width}px`
    this.floor.style.height = `${this.depth}px`
    this.floor.style.marginLeft = `${this.width/-2}px`
    this.floor.style.marginTop = `${this.depth/-2}px`
    this.floor.style.transform = `rotateX(90deg) translate3d(0,${this.depth/-2}px,0)`
    this.el.appendChild(this.floor)

    for(let key in this.walls) {
      this.walls[key].classList.add('wall')
      this.walls[key].classList.add('wall-' + key.substr(0,1))
      this.walls[key].style.height = `${this.height}px`
      this.walls[key].style.marginTop = `${this.height/-2}px`
      this.el.appendChild(this.walls[key])
    }

    this.walls.north.style.width = this.walls.south.style.width = `${this.width}px`
    this.walls.north.style.marginLeft = this.walls.south.style.marginLeft = `${this.width/-2}px`
    this.walls.east.style.width = this.walls.west.style.width = `${this.depth}px`
    this.walls.east.style.marginLeft = this.walls.west.style.marginLeft = `${this.depth/-2}px`
    
    this.walls.north.style.transform = `translate3d(0,${this.height/-2}px,-${this.depth}px)`
    this.walls.south.style.transform = `rotateY(180deg) translate3d(0,${this.height/-2}px,0)`
    this.walls.east.style.transform = `rotateY(90deg) translate3d(${this.depth/2}px,${this.height/-2}px,${this.width/-2}px)`
    this.walls.west.style.transform = `rotateY(270deg) translate3d(${this.depth/-2}px,${this.height/-2}px,${this.width/-2}px)`

    this.moveTo(this.x, this.z)

  }

  moveTo(x = 0, z = 0) {
    this.x = x
    this.z = z
    this.el.style.transform = `translate3d(${this.x}px, 0, ${this.z}px)`
  }

  write(text) {
    this.floor.textContent = text
  }

  isInside(object) {
    if(!object) return false
    
    if(object.z > this.z -this.depth
      && object.z < this.z
      && object.x > this.x + this.width/-2
      && object.x < this.x + this.width/2) {
      this.el.classList.add('active')
      return true
    }
    this.el.classList.remove('active')
    return false
  }
}