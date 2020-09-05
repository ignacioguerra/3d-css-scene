import './assets/css/reset.css'
import './assets/css/mini.css'
import Scene from './scene'
import IO from './io'

let scene = new Scene()
// let plane = scene.createPlane('floor', 4, 4)

// plane.id = 'pruebaa'
// plane.translate(-10, 0, -20)
// plane.translateY(-6)
// plane.update()

// let h1 = document.getElementById('test-content')
// plane.insert(h1)

// let box = scene.createBox('box', 4, 1, 12)
// box.translateZ(-20)
// box.rotateY(35)
// box.rotateZ(65)
// box.id = 'pruebaa2'
// box.update()

let room = scene.createRoom('room', 3600, 1080, 3000)
room.translateZ(-200)
room.update()

// let table = scene.createBox('stage', 500, 40, 200)
// // table.translateX(733)
// table.translateZ(483)
// table.id = 'pruebaa2'
// table.update()

// let table2 = scene.createBox('stage', 1366, 1400, 1366)
// table2.translateY(-1100)
// table2.translateZ(-200)
// // table2.rotateY(32)
// table2.id = 'pruebaa3'
// table2.update()

// let column1 = scene.createBox('colum', 70, 400, 70)
// column1.translateX(613)
// column1.translateZ(413)
// column1.update()

// let column2 = scene.createBox('colum', 70, 400, 70)
// column2.translateX(-613)
// column2.translateZ(413)
// column2.update()

let avtr = scene.createAvatar('me')
avtr.translateZ(-7)
avtr.update()
scene.removeAvatar(avtr)

const params = new URLSearchParams(window.location.search)
const y = params.get('y')
const t = params.get('t')
let videoId = t

const iframe = document.createElement('iframe')

iframe.frameborder = '0'
if (t) {
  iframe.src = `https://player.twitch.tv/?channel=${t}&parent=${window.location.hostname}`
  iframe.allowfullscreen = 'true'
  iframe.scrolling = 'no'
  iframe.height = '1080'
  iframe.width = '1920'
} else if (y) {
  videoId = y
  iframe.src = `https://www.youtube.com/embed/${y}`
  iframe.allow = 'autoplay; encrypted-media;'
}
room.north.insert(iframe)

let h1 = document.getElementById('test-content')
room.east.insert(h1)

// let stage = scene.createBox('stage', 40, 1, 6)
// stage.translateZ(-44)
// stage.id = 'pruebaa2'
// stage.update()

// let step = scene.createBox('step', 5, 1.12, 1.5)
// step.translateX(-17.5)
// step.translateZ(-40)
// step.update()

// let step2 = scene.createBox('step', 5, 0.57, 1.5)
// step2.translateX(-17.5)
// step2.translateZ(-38)
// step2.update()
IO.init(null, videoId, scene)

scene.onUpdate(() => {
  avtr.faceTo(scene.camera)
})
