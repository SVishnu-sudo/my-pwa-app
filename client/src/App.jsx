import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Tasks } from './pages/Tasks';
import { Chat } from './pages/Chat';
import { Admin } from './pages/Admin';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    margin: 0;
    padding: 0;
    transition: background-color 0.3s, color 0.3s;
  }
`;

const ThemedApp = () => {
    const { colors } = useContext(ThemeContext);
    return <GlobalStyle theme={colors} />;
};

const PrivateRoute = ({ children, roles }) => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) return <div>Loading...</div>;
    
    if (!user) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" />; // Unauthorized
    }

    return children;
};

const App = () => {
  return (
    <ThemeProvider>
      <ThemedApp />
      <AuthProvider>
        <Router>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route path="/" element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                } />
                
                <Route path="/tasks" element={
                    <PrivateRoute>
                        <Tasks />
                    </PrivateRoute>
                } />
                
                <Route path="/chat" element={
                    <PrivateRoute>
                        <Chat />
                    </PrivateRoute>
                } />
                
                <Route path="/admin" element={
                    <PrivateRoute roles={['admin']}>
                        <Admin />
                    </PrivateRoute>
                } />

            </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
