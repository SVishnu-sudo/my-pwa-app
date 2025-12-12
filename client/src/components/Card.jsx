import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../context/ThemeContext';

const CardStyled = styled.div`
  background-color: ${props => props.colors.cardBg};
  color: ${props => props.colors.text};
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

export const Card = ({ children, className }) => {
  const { colors } = useContext(ThemeContext);
  return <CardStyled colors={colors} className={className}>{children}</CardStyled>;
};
