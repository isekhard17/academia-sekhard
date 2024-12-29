import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import '@fontsource-variable/inter';
import { AuthProvider } from './contexts/auth.context';
import { AuthRouter } from './components/auth/auth-router';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthRouter />
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
