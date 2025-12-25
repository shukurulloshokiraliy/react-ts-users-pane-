import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import HomePage from './components/HomePage';
import '@mantine/core/styles.css';
import './index.css';
import UserDetail from './components/UserDetail';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface AppState {
  page: 'home' | 'detail';
  selectedUserId: number | null;
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    page: 'home',
    selectedUserId: null,
  });

  const handleUserSelect = (userId: number): void => {
    setAppState({
      page: 'detail',
      selectedUserId: userId,
    });
  };

  const handleBack = (): void => {
    setAppState({
      page: 'home',
      selectedUserId: null,
    });
  };

  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        {appState.page === 'home' ? (
          <HomePage onUserSelect={handleUserSelect} />
        ) : (
          <UserDetail userId={appState.selectedUserId!} onBack={handleBack} />
        )}
      </QueryClientProvider>
    </MantineProvider>
  );
};

export default App;