import './assets/css/reset.css'
import './assets/css/mini.css'
import throttle from 'lodash.throttle'
import Scene from './scene'


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

/**
 * Connection to sockets
 * docs: https://hexdocs.pm/phoenix/js/
 */
import { Socket, Presence } from 'phoenix'
import random_name from 'node-random-name'

// Connect to socket
// could bootstrap using initial camera position and rotation
// random_name assigns default username and input could be retrieved from user
// localhost:4000 is running https://github.com/pehuen-rodriguez/everlive
const socket = new Socket(
  'wss://develop.nayra.coop/ever-live-server/socket',
  {
    params: { username: random_name() },
  },
)
socket.connect()

// Join channel using video ID
const channel = socket.channel(`room:${'dQw4w9WgXcQ'}`)
channel
  .join()
  // User ID can be collected to this Camera's (me) internal properties
  .receive('ok', ({ userId }) => {
    currentId = userId
    console.log(`Received userId: ${userId}`)
  })
  // Collect and display errors
  .receive('error', ({ reason }) =>
    console.log('Failed join', reason),
  )
  .receive('timeout', () =>
    console.log('Networking issue. Still waiting...'),
  )

// Presence spawns events
// presence.onSync https://hexdocs.pm/phoenix/js/#syncing-state-from-the-server
// or individual events
// https://hexdocs.pm/phoenix/js/#handling-individual-presence-join-and-leave-events
const presence = new Presence(channel)
const avatars = new Map()

// detect if user has joined for the 1st time or from another tab/device
presence.onJoin((id, current, newPres) => {
  if (!current && id !== currentId) {
    console.log('somebody joined')
    let newAvatar = scene.createAvatar('user')
    newAvatar.update()
    avatars.set(id, newAvatar)
    displayUsers(presence.list())
  }
})

// detect if user has left from all tabs/devices, or is still present
presence.onLeave((id, current, leftPres) => {
  if (current.metas.length === 0) {
    console.log('somebody left')
    avatars.delete(id)
    displayUsers(presence.list())
  }
})

// receive presence data from server
presence.onSync(() => {
  displayUsers(presence.list())
})

const displayUsers = throttle((list) => {
  list.forEach((el) => {
    if (el.metas[0].user_id !== currentId) {
      let updateAvatar = avatars.get(el.metas[0].user_id)
      if (updateAvatar) {
        updateAvatar.translateX(el.metas[0].pos_x)
        updateAvatar.translateY(el.metas[0].pos_y)
        updateAvatar.translateZ(el.metas[0].pos_z)
        updateAvatar.rotateX(el.metas[0].rot_x)
        updateAvatar.rotateY(el.metas[0].rot_y)
        updateAvatar.rotateZ(el.metas[0].rot_z)
        updateAvatar.update()
      }
    }
  })
}, 200)
