import './assets/css/reset.css'
import './assets/css/mini.css'
import throttle from 'lodash.throttle'
import Scene, { Avatar } from './scene'

let scene = new Scene()
let plane = scene.createPlane('floor', 4, 4)

plane.id = 'pruebaa'
plane.translate(-10, 0, -20)
plane.translateY(-6)
plane.update()

let h1 = document.getElementById('test-content')
plane.insert(h1)

let box = scene.createBox('box', 4, 1, 12)
box.translateZ(-20)
box.rotateY(35)
box.rotateZ(65)
box.id = 'pruebaa2'
box.update()

let room = scene.createRoom('room', 40, 22.5, 50)
room.translateZ(-22)
room.update()

let avtr = scene.createAvatar('me')
avtr.translateZ(-7)
avtr.update()
scene.removeAvatar(avtr)

const params = new URLSearchParams(window.location.search)
const y = params.get('y')
const t = params.get('t')

let iframe = document.createElement('iframe')

iframe.frameborder = '0'
if(t) {
  iframe.src = `https://player.twitch.tv/?channel=${t}&parent=${window.location.hostname}`
  iframe.allowfullscreen = 'true'
  iframe.scrolling = 'no'
  iframe.height="1080"
  iframe.width="1920"
} else if(y) {
  iframe.src = `https://www.youtube.com/embed/${y}`
  iframe.allow = 'autoplay; encrypted-media;'
}
room.north.insert(iframe)

let stage = scene.createBox('stage', 40, 1.65, 6)
stage.translateZ(-44)
stage.id = 'pruebaa2'
stage.update()

let step = scene.createBox('step', 5, 1.12, 1.5)
step.translateX(-17.5)
step.translateZ(-40)
step.update()

let step2 = scene.createBox('step', 5, 0.57, 1.5)
step2.translateX(-17.5)
step2.translateZ(-38)
step2.update()

let currentId

scene.onUpdate(() => {
  avtr.faceTo(scene.camera)
})
