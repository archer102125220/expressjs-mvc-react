import userService from '@services/server/userService';

class testEvent {
  testEvent = async () => {
    return await userService.AllUsers();
  }
  clickEvent = async (socket, name, payload) => {
    const data = await userService.findUser(payload);
    socket.emit(name, data);
  }
}

export default new testEvent();