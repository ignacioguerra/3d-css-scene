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

let iframe = document.createElement('iframe')
// iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ'
// iframe.frameborder = '0'
// iframe.allow = 'autoplay; encrypted-media;'

iframe.src = 'https://player.twitch.tv/?channel=buenosairesoutrun'
iframe.frameborder = '0'
iframe.allowfullscreen = 'true'
iframe.scrolling = 'no'
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
