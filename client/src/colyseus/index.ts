import * as Colyseus from 'colyseus.js';

const environment = import.meta.env.VITE_NODE_ENV
const serverURL = environment === 'production' ? 'wss://colyseus-pong.herokuapp.com' : 'ws://localhost:2567'

export const client = new Colyseus.Client(serverURL);
