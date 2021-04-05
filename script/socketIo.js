import socketIO from 'socket.io';
import testEvent from '@/socket/testEvent';

class SocketIo extends socketIO {
  io = {}
  state = ''

  init = (server) => {
    this.io = this.listen(server);
    this.state = 'connection';
    this.io.on('connection', this.onConnection);
  }

  sender = [
    { name: 'testEvent', data: testEvent.testEvent },
  ]

  receiver = [
    { name: 'clickEvent', response: testEvent.clickEvent },
  ]

  onConnection = (socket) => {
    console.log('a user connected');
    const io = this.io;
    this.sender.forEach(async ({ name, data }) => {
      if (typeof (data) !== 'function') {
        this.io.emit(name, data);//io.emit(事件名稱,變數(物件、陣列或字串、數字)) → 向前端傳送資料
      } else {
        this.io.emit(name, await data(io, name));//io.emit(事件名稱,變數(物件、陣列或字串、數字)) → 向前端傳送資料
      }
    });
    this.receiver.forEach(({ name, response }) => {
      socket.on(name, async (paylod) => {//socket.on(事件名稱,function(data)) → 接受前端傳來的資料
        await response(io, name, paylod);
      });
    });
    socket.on('disconnect', this.onDisconnect);
    this.state = 'connected';
  }

  onDisconnect = () => {
    console.log('a user go out');
  }
}

export default new SocketIo();

