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
        this.setState(new MyRoomState_1.MyRoomState());
        this.onMessage('type', (client, message) => {
            //
            // handle "type" message
            //
        });
    }
    onJoin(client, options) {
        console.log(client.sessionId, 'joined!');
        players[client.sessionId] = {
            id: client.sessionId,
            x: 14,
            y: 10,
        };
        this.broadcastToAllButMe(client, 'new-player', players[client.sessionId]);
        client.send('current-players', this.getAllPlayers());
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
        delete players[client.sessionId];
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
