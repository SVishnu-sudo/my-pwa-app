import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AuthContext } from '../context/AuthContext';
import styled from 'styled-components';

const TaskItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  
  &:last-child { border-bottom: none; }
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  background-color: ${props => {
      switch(props.status) {
          case 'completed': return '#28a745';
          case 'in_progress': return '#ffc107';
          default: return '#6c757d';
      }
  }};
  color: white;
`;

const CalendarContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  
  .react-calendar {
      width: 100%;
      border: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border-radius: 8px;
  }
`;

export const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', assignedToId: '' });
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchTasks();
    if (user.role === 'team_leader' || user.role === 'admin') {
        fetchUsers();
    }
  }, [user]);

  const fetchTasks = async () => {
    const res = await axios.get('/api/tasks');
    setTasks(res.data);
  };

  const fetchUsers = async () => {
      const res = await axios.get('/api/users');
      setUsers(res.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
        await axios.post('/api/tasks', newTask);
        setNewTask({ title: '', description: '', dueDate: '', assignedToId: '' });
        fetchTasks();
    } catch (err) {
        alert(err.response?.data?.message || 'Error creating task');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
      try {
          await axios.put(`/api/tasks/${id}`, { status: newStatus });
          fetchTasks();
      } catch (err) {
          alert('Error updating status');
      }
  };

  // Filter tasks for calendar view
  const getTasksForDate = (date) => {
      return tasks.filter(task => {
          if (!task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          return taskDate.getDate() === date.getDate() &&
                 taskDate.getMonth() === date.getMonth() &&
                 taskDate.getFullYear() === date.getFullYear();
      });
  };

  const tileContent = ({ date, view }) => {
      if (view === 'month') {
          const dayTasks = getTasksForDate(date);
          if (dayTasks.length > 0) {
              return <div style={{ fontSize: '0.6rem', color: 'blue' }}>{dayTasks.length} task(s)</div>;
          }
      }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Tasks & Calendar</h2>
          <div>
              <Button onClick={() => setView('list')} variant={view === 'list' ? 'primary' : 'secondary'}>List</Button>
              <Button onClick={() => setView('calendar')} variant={view === 'calendar' ? 'primary' : 'secondary'} style={{ marginLeft: '10px' }}>Calendar</Button>
          </div>
      </div>
      
      {(user.role !== 'subordinate') && (
        <Card>
            <h3>Assign Task</h3>
            <form onSubmit={handleCreate}>
                <Input 
                    placeholder="Title" 
                    value={newTask.title} 
                    onChange={e => setNewTask({...newTask, title: e.target.value})} 
                    required
                />
                <Input 
                    placeholder="Description" 
                    value={newTask.description} 
                    onChange={e => setNewTask({...newTask, description: e.target.value})} 
                />
                <Input 
                    type="date"
                    value={newTask.dueDate} 
                    onChange={e => setNewTask({...newTask, dueDate: e.target.value})} 
                />
                
                {user.role === 'team_leader' && (
                    <select 
                        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                        value={newTask.assignedToId}
                        onChange={e => setNewTask({...newTask, assignedToId: e.target.value})}
                    >
                        <option value="">Assign to (Optional - Self)</option>
                        {users.filter(u => u.teamLeaderId === user.id).map(u => (
                            <option key={u.id} value={u.id}>{u.username}</option>
                        ))}
                    </select>
                )}

                <Button type="submit">Create Task</Button>
            </form>
        </Card>
      )}

      {view === 'calendar' && (
          <>
            <CalendarContainer>
                <Calendar 
                    onChange={setSelectedDate} 
                    value={selectedDate} 
                    tileContent={tileContent}
                />
            </CalendarContainer>
            <Card>
                <h3>Tasks for {selectedDate.toDateString()}</h3>
                {getTasksForDate(selectedDate).map(task => (
                    <TaskItem key={task.id}>
                        <div>
                             <strong>{task.title}</strong>
                             <small> ({task.status.replace('_', ' ')})</small>
                        </div>
                    </TaskItem>
                ))}
                {getTasksForDate(selectedDate).length === 0 && <p>No tasks for this date.</p>}
            </Card>
          </>
      )}

      {view === 'list' && (
          <Card>
              {tasks.map(task => (
                  <TaskItem key={task.id}>
                      <div>
                          <strong>{task.title}</strong>
                          <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>{task.description}</p>
                          <small>Due: {task.dueDate || 'No date'} | Owner: {task.Owner?.username}</small>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' }}>
                          <StatusBadge status={task.status}>{task.status.replace('_', ' ')}</StatusBadge>
                          
                          <select 
                            value={task.status} 
                            onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                            style={{ padding: '2px' }}
                          >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                          </select>
                      </div>
                  </TaskItem>
              ))}
              {tasks.length === 0 && <p>No tasks found.</p>}
          </Card>
      )}
    </div>
  );
};
