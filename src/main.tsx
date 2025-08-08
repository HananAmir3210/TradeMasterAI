import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const TorchEffect = () => {
  const location = useLocation();

  useEffect(() => {
    const torch = document.createElement('div');
    torch.className = 'torch-cursor';
    document.body.appendChild(torch);

    const onMouseMove = (e: MouseEvent) => {
      torch.style.setProperty('--torch-x', `${e.clientX}px`);
      torch.style.setProperty('--torch-y', `${e.clientY}px`);
    };

<<<<<<< HEAD
    if (location.pathname.startsWith('/dashboard')) {
=======
    if (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin')) {
>>>>>>> 74acc0a (Initial commit of my project)
      torch.style.display = 'none';
      document.removeEventListener('mousemove', onMouseMove);
    } else {
      torch.style.display = 'block';
      document.addEventListener('mousemove', onMouseMove);
    }

    return () => {
      document.body.removeChild(torch);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [location.pathname]);

  return null;
};

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
    <TorchEffect />
  </BrowserRouter>
);
