import { Room } from 'colyseus.js';

export class EventListener {
  room!: Room;
  constructor(room: Room) {
    this.room = room;
  }

  onMessage(message: string, callback: (data: any) => void) {
    this.room.onMessage(message, callback);
  }
}
