import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

const NavStyled = styled.nav`
  background-color: ${props => props.colors.primary};
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 15px;

  a {
    color: white;
    text-decoration: none;
    font-weight: bold;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ToggleBtn = styled.button`
  background: none;
  border: 1px solid white;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  padding: 5px 10px;
  margin-left: 10px;
`;

export const Navbar = () => {
  const { colors, toggleTheme, theme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <NavStyled colors={colors}>
      <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Puritec</div>
      <NavLinks>
        {user ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/tasks">Tasks</Link>
            <Link to="/chat">Chat</Link>
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            <ToggleBtn onClick={handleLogout}>Logout</ToggleBtn>
          </>
        ) : (
           <Link to="/login">Login</Link>
        )}
        <ToggleBtn onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </ToggleBtn>
      </NavLinks>
    </NavStyled>
  );
};
