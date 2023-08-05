"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyRoom = void 0;
const core_1 = require("@colyseus/core");
const MyRoomState_1 = require("./schema/MyRoomState");
const players = {};
class MyRoom extends core_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 4;
    }
    onCreate(options) {
        console.log('MyRoom created!', options);
        // if(options && options.password){
        //   // this.setPrivate(true)
        //   this.setMetadata({password: true , ...options})
        //   //Name the room
        // }
        this.setState(new MyRoomState_1.MyRoomState());
        this.onMessage('type', (client, message) => {
            //
            // handle "type" message
            //
        });
    }
    onJoin(client, options) {
        // if(!options.password){
        //   client.leave()
        //   return
        // }
        // if(options && options.password && this.metadata.password){
        //   if(options.password !== this.metadata.password){
        //     client.send('wrong-password')
        //     client.leave()
        //     return
        //   }
        // }
        console.log(client.sessionId, 'joined!', options);
        client.send('welcome', "Welcome to the room!");
        this.onMessage('join-game', (client, playerData) => {
            console.log("join game", playerData);
            players[client.sessionId] = {
                id: client.sessionId,
                x: 14,
                y: 10,
                ...playerData
            };
            this.broadcastToAllButMe(client, 'new-player', players[client.sessionId]);
            client.send('current-players', this.getAllPlayers());
            this.broadcast('chat-event', { id: client.sessionId, message: `${playerData.name} joined the room`, type: "event" });
        });
        this.onMessage('chat-message', (client, message) => {
            console.log("chat message", message);
            const [_, currentTime] = new Date().toLocaleDateString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).split(",");
            const { selectedChar, name } = players[client.sessionId];
            this.broadcast('chat-message', { id: client.sessionId, message, time: currentTime, name, type: "message", selectedChar });
        });
        this.onMessage('move', (client, movementData) => {
            console.log(movementData, client.sessionId);
            players[client.sessionId] = { ...players[client.sessionId], x: movementData.x, y: movementData.y };
            this.broadcastToAllButMe(client, 'player-moved', {
                id: client.sessionId,
                ...movementData
            });
        });
    }
    onLeave(client, consented) {
        console.log(client.sessionId, 'left!');
        const name = players[client.sessionId].name;
        delete players[client.sessionId];
        this.broadcast('chat-event', { id: client.sessionId, message: `${name} left the room`, type: "event" });
        this.broadcast('player-left', client.sessionId);
    }
    onDispose() {
        console.log('room', this.roomId, 'disposing...');
    }
    broadcastToAllButMe(client, type, message) {
        const otherClients = this.clients.filter((c) => c.sessionId !== client.sessionId);
        otherClients.forEach((client) => client.send(type, message));
    }
    getOtherPlayers(client) {
        return Object.values(players).filter((player) => player.id !== client.sessionId);
    }
    getAllPlayers() {
        return Object.values(players);
    }
}
exports.MyRoom = MyRoom;
