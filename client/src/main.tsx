import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { RoomProvider } from './store/RoomProvider.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RoomProvider>
    <App />
  </RoomProvider>
);
