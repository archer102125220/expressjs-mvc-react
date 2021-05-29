import Io from 'socket.io-client';
import { socket as socketURL } from '@config/apiConfig';

const nodeEnv = process.env.NODE_ENV;

class socketIoClient extends Io {
  constructor(props) {
    super(props);
    const log = (nodeEnv !== 'production');
    if (log) {
      this.on('connect', () => console.log('socketIoClient is connected'));
      this.on('disconnect', () => console.log('socketIoClient is disconnected'));
    }
  }

  eventInit = (events = []) => {
    events.forEach(({ name, event }) => {
      this[name + 'Send'] = (data = null) => this.emit(name, data);
      this.on(name, (data) => event(data));
    });
  }
}


export default new socketIoClient(socketURL);