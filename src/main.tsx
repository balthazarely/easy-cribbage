import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// Lock to portrait when the Screen Orientation API is available (Android PWA, some browsers)
const orientation = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
if (orientation?.lock) {
  orientation.lock("portrait").catch(() => {});
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
