import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ApplicationProvider from './components/application-provider.tsx';
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApplicationProvider>
      <App />
      <Toaster position="top-right" />
    </ApplicationProvider>
  </StrictMode>,
)
