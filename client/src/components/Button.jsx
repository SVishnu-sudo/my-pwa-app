import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../context/ThemeContext';

const ButtonStyled = styled.button`
  background-color: ${props => props.variant === 'secondary' ? props.colors.secondary : props.colors.primary};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.3s;
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const Button = ({ children, variant, fullWidth, onClick, disabled, type='button' }) => {
  const { colors } = useContext(ThemeContext);
  return (
    <ButtonStyled colors={colors} variant={variant} fullWidth={fullWidth} onClick={onClick} disabled={disabled} type={type}>
      {children}
    </ButtonStyled>
  );
};
