import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { IssueProvider } from './context/IssueContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>                   {/* React Router gives us the ability to navigate between different pages without reloading the entire page */}
      <ThemeProvider>                 {/* ThemeProvider is a React Context that provides theme-related functionality like---->>light or dark mood*/}
        <AuthProvider>                {/* AuthProvider is a React Context that provides authentication-related functionality---->> like register, login, logout */}
          <IssueProvider>             {/* IssueProvider is a React Context that provides issue-related functionality */}
            <NotificationProvider>    {/* NotificationProvider is a React Context that provides notification-related functionality */}
              <AppRoutes />           {/* AppRoutes is a React Component that handles routing-->> It decides which page should open for a particular URL*/}
            </NotificationProvider>
          </IssueProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

