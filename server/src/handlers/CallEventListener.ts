import { Client } from 'colyseus';
import { MyRoom } from '../rooms/MyRoom';

export default class CallEventListener {
  room: MyRoom;

  constructor(room: MyRoom) {
    this.room = room;
    console.log('CallEventListenerClass instance created');
    this.room.onMessage('chat-message', this.handleCallEvent.bind(this));
  }

  private handleCallEvent(client: Client, callData: any) {
    // Handle call-related events here
    console.log('Call event received: FROM HERE', callData);
    // Do something with the call event data
  }
}
