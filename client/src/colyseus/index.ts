import * as Colyseus from 'colyseus.js';

const environment = import.meta.env.VITE_NODE_ENV
const serverURL = environment === 'production' ? 'https://magenta-lovebird-kit.cyclic.app/' : 'ws://localhost:8080'

export const client = new Colyseus.Client(serverURL);
