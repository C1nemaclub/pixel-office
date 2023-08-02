import ReactDOM from 'react-dom/client';
// import App from './App.tsx';
import { RoomProvider } from './store/RoomProvider.tsx';
import { lazy, Suspense } from 'react';
import './index.css';
import Loader from './components/Loader/Loader.tsx';

const App = lazy(() => import('./App.tsx'));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RoomProvider>
    <Suspense fallback={<Loader text="Loading Application..." centered />}>
      <App />
    </Suspense>
  </RoomProvider>
);
