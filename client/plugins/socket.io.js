import io from 'socket.io-client'
const socket = io(process.env.serverUrlIo)

export default socket
