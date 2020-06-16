localStorage.clear()

let viewport = document.querySelector('.viewport')
let camera = document.querySelector('.camera')
let assembly = document.querySelector('.assembly')
let eyesPosition = 250
let cam = JSON.parse(localStorage.getItem('camera')) || {
  x: 0,
  y: eyesPosition,
  z: -150,
  ax: 0,
  ay: 0,
  az: 0,
  vy: 0
}
let movements = {
  w: false,
  a: false,
  s: false,
  d: false,
  speed: {
    base: 30,
    w: 0,
    a: 0,
    s: 0,
    d: 0
  }
}
let perspective = (0.5 / Math.tan(6.981317)) * Math.min(innerWidth, innerHeight)
let mousePressed = false
let gameMode = true

viewport.requestPointerLock = viewport.requestPointerLock || viewport.mozRequestPointerLock || viewport.webkitRequestPointerLock
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock

cam.ax = 0
update()

// window.addEventListener('mousemove', function(e) {

//   cam.ay = -180+e.pageX/window.innerWidth*360
//   cam.ax = 180+e.pageY/window.innerHeight*-360
//   if(cam.ax < -90) cam.ax = -90
//   if(cam.ax > 90) cam.ax = 90
//   update()

// })

let touchY = 0
let touchX = 0

function activateSensors(event) {

  if((event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma)) {
    let gyroscope = new Gyroscope({frequency: 60})
    gyroscope.addEventListener('reading', () => {
      cam.ay += -gyroscope.y
      cam.ax += gyroscope.x
      cam.az += gyroscope.z
    })
  
    gyroscope.start()
    window.removeEventListener("devicemotion", activateSensors, false)
    document.body.addEventListener("touchstart", function(e) {
      e.preventDefault()
      touchX = e.touches[0].clientX
      touchY = e.touches[0].clientY
    }, false)
    document.body.addEventListener("touchmove", function(e) {
      let moveX = 0
      let moveZ = 0
      // No funciona del todo bien
      moveX += (e.touches[0].clientY-touchY)*0.5*Math.sin(radians(cam.ay))
      moveZ += (e.touches[0].clientY-touchY)*0.5*Math.cos(radians(cam.ay))

      moveX += (e.touches[0].clientX-touchX)*0.5*Math.cos(radians(cam.ay))
      moveZ += (e.touches[0].clientX-touchX)*0.5*Math.sin(radians(cam.ay))

      moveX /= 2
      moveZ /= 2


      if(moveX > movements.speed.base) moveX = movements.speed.base
      else if(moveX < -movements.speed.base) moveX = -movements.speed.base
      if(moveZ > movements.speed.base) moveZ = movements.speed.base
      else if(moveZ < -movements.speed.base) moveZ = -movements.speed.base

      cam.x += moveX
      cam.z += moveZ
    }, false)
    document.body.addEventListener("touchend", function (){
      document.clearTimeout(timer)
    }, false)

  }
}

window.addEventListener("devicemotion", activateSensors, false)

document.addEventListener('mousemove', function(e) {
  if(!mousePressed && !gameMode) return false

  //   cam.ay = -180+e.pageX/window.innerWidth*360
  //   cam.ax = 180+e.pageY/window.innerHeight*-360
  let movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0
  let movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0

  cam.ay += movementX * (gameMode ? 0.25 : -0.05)
  cam.ax += -movementY * (gameMode ? 0.25 : -0.05)
  if(cam.ax < -90) cam.ax = -90
  if(cam.ax > 90) cam.ax = 90
  
  return false
}, false)

viewport.addEventListener("mousedown", function() {
  viewport.requestPointerLock()
  mousePressed = true
})

viewport.addEventListener("mouseup", function() {
  // document.exitPointerLock()
  mousePressed = false
})

window.addEventListener('keypress', function(e) {
  let vel = 10;
  let key = e.key.toLowerCase()
  if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
    movements[key] = true
  }

  if(e.key.toLowerCase() === ' ' && cam.y < eyesPosition + 1) {
    console.log('jump')
    cam.vy = 30
  }

})

window.addEventListener('keyup', function(e) {
  let key = e.key.toLowerCase()
  if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
    movements[key] = false
  }
})

// function goForward() {
//   movements.speed.w += (movements.speed.base-movements.speed.w) * 0.5
//   cam.x += movements.speed.w*Math.sin(radians(cam.ay))
//   cam.z -= movements.speed.w*Math.cos(radians(cam.ay))

//   timer = setTimeout(goForward, 20);
// }

function move() {
  let moveX = 0
  let moveZ = 0
  let movesCount = 0
  
  if(movements.w) {
    movements.speed.w += (movements.speed.base-movements.speed.w) * 0.5
    movesCount++
  }
    moveX += movements.speed.w*Math.sin(radians(cam.ay))
    moveZ -= movements.speed.w*Math.cos(radians(cam.ay))
  if(!movements.w) movements.speed.w *= 0.85
  if(movements.s) {
    movements.speed.s += (movements.speed.base-movements.speed.s) * 0.2
    movesCount++
  }
    moveX -= movements.speed.s*Math.sin(radians(cam.ay))
    moveZ += movements.speed.s*Math.cos(radians(cam.ay))
  if(!movements.a) movements.speed.a *= 0.85
  if(movements.a) {
    movements.speed.a += (movements.speed.base-movements.speed.a) * 0.2
    movesCount++
  }
    moveX -= movements.speed.a*Math.cos(radians(cam.ay))
    moveZ -= movements.speed.a*Math.sin(radians(cam.ay))
  if(!movements.s) movements.speed.s *= 0.85
  if(movements.d) {
    movements.speed.d += (movements.speed.base-movements.speed.d) * 0.2
    movesCount++
  }
    moveX += movements.speed.d*Math.cos(radians(cam.ay))
    moveZ += movements.speed.d*Math.sin(radians(cam.ay))
  if(!movements.d) movements.speed.d *= 0.85

  if(movesCount > 0) {
    moveX /= movesCount
    moveZ /= movesCount
  }
  cam.x += moveX
  cam.z += moveZ

  for(let i = 0; i < rooms.length; i++) {
    rooms[i].isInside(cam)
  }
}

function update() {
  camera.style.transform = `translate3d(0px,0px,${perspective}px) rotateX(${cam.ax}deg) rotateY(${cam.ay}deg) skewX(0) skewY(0)`
  assembly.style.transform = `translate3d(${-cam.x}px,${cam.y}px,${-cam.z}px) rotateX(${0*cam.ax}deg) rotateY(${0*cam.ay}deg) rotateZ(${0*cam.az}deg)` //
  viewport.style.perspective = perspective + 'px'
  // camera.style.transformOrigin = `${cam.x}px ${cam.y}px ${cam.z}px`
}

function radians(deg) {
  return deg * (Math.PI/180)
}

function frame() {
  cam.y += cam.vy;
  cam.vy -= 3;
  if(cam.y < eyesPosition) {
    cam.y = eyesPosition
    cam.vy = 0
  }
  move()
  update()
  setTimeout(frame, 30)
}


// function save() {
//   localStorage.setItem('camera', JSON.stringify(cam))
//   setTimeout(save, 15000)
// }
// save()

function cancelMovement() {
  movements.w = movements.a = movements.s = movements.d = false
}

window.addEventListener('beforeunload', function() {
  localStorage.setItem('camera', JSON.stringify(cam))
})

document.addEventListener("visibilitychange", cancelMovement)
document.addEventListener('contextmenu', cancelMovement)

let roomsWidth = 1680
let roomsDepth = 1050
let gap = 500
let rooms = []
let cols = 4
let rows = 3

for(let j = 0; j < rows; j++) {
  for(let i = 0; i < cols; i++) {
    let room = new Room(roomsWidth, roomsDepth) 
    room.moveTo(i*(roomsWidth+gap), j*(roomsDepth+gap))
    room.write(`Sala ${cols*j+i+1}`)
    assembly.appendChild(room.el)
    rooms.push(room)
  }
}

frame()