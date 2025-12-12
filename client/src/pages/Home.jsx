import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ThemeContext } from '../context/ThemeContext';
import styled from 'styled-components';

const SOSButton = styled.button`
  background-color: #dc3545;
  color: white;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: none;
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 20px;
`;

export const Home = () => {
  const [quote, setQuote] = useState(null);
  const [sosNumber, setSosNumber] = useState('');
  const [location, setLocation] = useState(null);
  const { colors } = useContext(ThemeContext);

  useEffect(() => {
    // Fetch Quote
    axios.get('/api/quote').then(res => {
      setQuote(res.data[0]);
    }).catch(err => console.error(err));

    // Fetch SOS Number
    axios.get('/api/config/sos').then(res => {
        setSosNumber(res.data.number);
    }).catch(err => console.error(err));
  }, []);

  const handleSOS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const message = `SOS! I need help. My location: https://www.google.com/maps?q=${latitude},${longitude}`;
      
      // Open SMS app
      window.open(`sms:${sosNumber}?body=${encodeURIComponent(message)}`, '_self');
    }, (error) => {
      alert('Unable to retrieve location: ' + error.message);
    });
  };

  return (
    <Container>
       {quote && (
        <Card style={{ width: '100%', maxWidth: '600px', textAlign: 'center', fontStyle: 'italic' }}>
          "{quote.q}" <br/> - <strong>{quote.a}</strong>
        </Card>
      )}

      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h3>Emergency</h3>
        <SOSButton onClick={handleSOS}>SOS</SOSButton>
        <p style={{ marginTop: '10px', color: colors.text }}>
           Click to send GPS coordinates to Admin
        </p>
      </div>

    </Container>
  );
};
