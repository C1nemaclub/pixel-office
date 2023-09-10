import ReactDOM from 'react-dom/client';
import { RoomProvider } from './store/RoomProvider.tsx';
import { lazy, Suspense } from 'react';
import Loader from './components/Loader/Loader.tsx';
import './index.css';

const App = lazy(() => import('./App.tsx'));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RoomProvider>
    <Suspense fallback={<Loader text='Loading Application...' centered />}>
      <App />
    </Suspense>
  </RoomProvider>
);
