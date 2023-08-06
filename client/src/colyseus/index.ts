import * as Colyseus from 'colyseus.js';

const environment = import.meta.env.VITE_NODE_ENV
const serverURL = environment === 'production' ? 'https://pixel-office-backend-60b13454427a.herokuapp.com/' : 'ws://localhost:2567'

export const client = new Colyseus.Client(serverURL);
