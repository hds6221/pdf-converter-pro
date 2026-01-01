import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ModalProvider } from './context/ModalContext';
import GlobalModal from './components/GlobalModal';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ModalProvider>
      <GlobalModal />
      <App />
    </ModalProvider>
  </StrictMode>
);
