import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../context/ThemeContext';

const InputStyled = styled.input`
  padding: 10px;
  border: 1px solid ${props => props.colors.border};
  border-radius: 5px;
  font-size: 16px;
  width: 100%;
  margin-bottom: 15px;
  background-color: ${props => props.colors.cardBg};
  color: ${props => props.colors.text};
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.colors.primary};
  }
`;

export const Input = (props) => {
  const { colors } = useContext(ThemeContext);
  return <InputStyled colors={colors} {...props} />;
};
