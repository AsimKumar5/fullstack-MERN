import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store/store.js'
import './index.css'
import App from './App.jsx'

try {
  const preferences = JSON.parse(localStorage.getItem("appPreferences") || "{}");
  document.documentElement.dataset.theme = preferences.theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.motion = preferences.reducedMotion ? "reduced" : "full";
} catch {
  document.documentElement.dataset.theme = "light";
  document.documentElement.dataset.motion = "full";
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
