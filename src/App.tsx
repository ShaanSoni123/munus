import { FC } from 'react';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { JobProvider } from './contexts/JobContext';
import AppRouter from './router/AppRouter';
import { Analytics } from '@vercel/analytics/react';
import './styles/themes.css';

const App: FC = () => {
  console.log('🚀 App component initializing with React Router...'); // DEBUG LINE
  
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <JobProvider>
            <AppRouter />
            <Analytics />
          </JobProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;