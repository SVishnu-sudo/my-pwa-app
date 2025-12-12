import React, { useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import styled from 'styled-components';

const ChatContainer = styled.div`
  display: flex;
  height: calc(100vh - 80px); /* Adjust for navbar */
`;

const Sidebar = styled.div`
  width: 250px;
  border-right: 1px solid #ccc;
  overflow-y: auto;
  background: ${props => props.theme === 'dark' ? '#1e1e1e' : '#f8f9fa'};
`;

const UserItem = styled.div`
  padding: 15px;
  cursor: pointer;
  background-color: ${props => props.active ? 'rgba(0, 141, 210, 0.1)' : 'transparent'};
  &:hover { background-color: rgba(0,0,0,0.05); }
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MessagesBox = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 10px;
  border-radius: 10px;
  align-self: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  background-color: ${props => props.isOwn ? '#008DD2' : '#e0e0e0'};
  color: ${props => props.isOwn ? 'white' : 'black'};
`;

export const Chat = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    // Connect Socket
    socketRef.current = io({
        path: '/socket.io'
    });
    
    socketRef.current.emit('join_user', user.id);

    socketRef.current.on('receive_message', (msg) => {
        setMessages(prev => [...prev, msg]);
    });

    // Fetch Users
    axios.get('/api/users').then(res => setUsers(res.data));

    return () => socketRef.current.disconnect();
  }, [user.id]);

  useEffect(() => {
    if (selectedUser) {
        // Fetch history
        axios.get(`/api/users/messages/${selectedUser.id}`).then(res => {
            setMessages(res.data);
        });
    }
  }, [selectedUser]);

  const handleSend = () => {
      if (!newMessage.trim() || !selectedUser) return;

      const payload = {
          senderId: user.id,
          receiverId: selectedUser.id,
          content: newMessage,
          type: 'text'
      };

      socketRef.current.emit('send_message', payload);
      setNewMessage('');
  };

  // Filter messages for current view
  const currentMessages = messages.filter(m => 
      (m.senderId === user.id && m.receiverId === selectedUser?.id) ||
      (m.senderId === selectedUser?.id && m.receiverId === user.id)
  );

  return (
    <ChatContainer>
        <Sidebar>
            {users.map(u => (
                <UserItem 
                    key={u.id} 
                    active={selectedUser?.id === u.id}
                    onClick={() => setSelectedUser(u)}
                >
                    {u.username} <small>({u.role})</small>
                </UserItem>
            ))}
        </Sidebar>
        <ChatArea>
            {selectedUser ? (
                <>
                    <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                        <strong>Chat with {selectedUser.username}</strong>
                    </div>
                    <MessagesBox>
                        {currentMessages.map((msg, idx) => (
                            <MessageBubble key={idx} isOwn={msg.senderId === user.id}>
                                {msg.content}
                            </MessageBubble>
                        ))}
                    </MessagesBox>
                    <div style={{ padding: '10px', display: 'flex', gap: '10px' }}>
                        <Input 
                            value={newMessage} 
                            onChange={e => setNewMessage(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            style={{ marginBottom: 0 }}
                        />
                        <Button onClick={handleSend}>Send</Button>
                    </div>
                </>
            ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                    Select a user to start chatting
                </div>
            )}
        </ChatArea>
    </ChatContainer>
  );
};
