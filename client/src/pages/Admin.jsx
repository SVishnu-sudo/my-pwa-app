import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const Admin = () => {
  const [sosNumber, setSosNumber] = useState('');
  
  useEffect(() => {
    axios.get('/api/config/sos').then(res => setSosNumber(res.data.number));
  }, []);

  const handleUpdate = async () => {
      try {
          await axios.put('/api/config/sos', { number: sosNumber });
          alert('SOS Number updated successfully');
      } catch (err) {
          alert('Error updating number');
      }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Dashboard</h2>
      
      <Card style={{ maxWidth: '400px' }}>
          <h3>Global SOS Configuration</h3>
          <p>Set the phone number that receives SOS messages from all users.</p>
          <Input 
             value={sosNumber}
             onChange={e => setSosNumber(e.target.value)}
             placeholder="+1234567890"
          />
          <Button onClick={handleUpdate}>Update Number</Button>
      </Card>
    </div>
  );
};
