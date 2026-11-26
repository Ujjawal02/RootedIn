import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './app/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/theme.css';
import App from './App.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{ success: { iconTheme: { primary: '#1B4332', secondary: '#fff' } } }}
        />
      </ErrorBoundary>
    </BrowserRouter>
  </Provider>
);