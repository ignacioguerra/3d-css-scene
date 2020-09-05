/**
 * Connection to sockets
 * docs: https://hexdocs.pm/phoenix/js/
 */
import { Socket, Presence } from 'phoenix'
import random_name from 'node-random-name'
import throttle from 'lodash.throttle'

let socket = null
let channel = null

// Connect to socket
// could bootstrap using initial camera position and rotation
// random_name assigns default username and input could be retrieved from user
// localhost:4000 is running https://github.com/pehuen-rodriguez/everlive
const init = (username, roomId, scene) => {
  socket = new Socket('wss://develop.nayra.coop/ever-live-server/socket', {
    params: { username: username || random_name() },
  })
  socket.connect()

  // Join channel using video ID
  channel = socket.channel(`room:${roomId || "default_room"}`)
  let me = null

  channel
    .join()
    // User ID can be collected to this Camera's (me) internal properties
    .receive('ok', ({ userId }) => {
      me = userId
      console.log(`Received userId: ${userId}`)
    })
    // Collect and display errors
    .receive('error', ({ reason }) =>
      console.error(`Error joining room ${roomId}`, reason),
    )
    .receive('timeout', () => console.log('Networking issue. Still waiting...'))

  // Presence spawns events
  // presence.onSync https://hexdocs.pm/phoenix/js/#syncing-state-from-the-server
  // or individual events
  // https://hexdocs.pm/phoenix/js/#handling-individual-presence-join-and-leave-events
  const presence = new Presence(channel)
  const avatars = new Map()

  // detect if user has joined for the 1st time or from another tab/device
  presence.onJoin((id, current, newPres) => {
    if (!current && id !== me) {
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
      if (el.metas[0].user_id !== me) {
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
}

const getInstances = () => {
  return { socket, channel }
}

export default {
  init,
  getInstances
}
