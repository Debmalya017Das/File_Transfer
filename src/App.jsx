import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';
import Room from './components/Room';
import WaitingRoom from './components/waitingroom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

const socket = io('https://file-transfer-2.onrender.com');

function App() {
  const [roomId, setRoomId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState('');
  const [peerName, setPeerName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('room');
    if (id) {
      setRoomId(id);
    } else {
      const newRoomId = uuidv4();
      setRoomId(newRoomId);
    }
  }, []);

  useEffect(() => {
    socket.on('peerConnected', (peerName) => {
      setIsConnected(true);
      setPeerName(peerName);
    });

    return () => {
      socket.off('peerConnected');
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn && userName) {
      if (roomId) {
        socket.emit('joinRoom', { roomId, userName });
      } else {
        const newRoomId = uuidv4();
        setRoomId(newRoomId);
        socket.emit('createRoom', { roomId: newRoomId, userName });
      }
    }
  }, [isLoggedIn, userName, roomId]);

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('https://file-transfer-2.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        setUserName(username);
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRegister = async (username, password) => {
    try {
      const response = await fetch('https://file-transfer-2.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        alert('Registration successful');
        setShowRegister(false);
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserName('');
    setIsConnected(false);
    setPeerName('');
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto p-4">
        {showRegister ? (
          <RegisterForm onRegister={handleRegister} onSwitch={() => setShowRegister(false)} />
        ) : (
          <LoginForm onLogin={handleLogin} onSwitch={() => setShowRegister(true)} />
        )}
      </div>
    );
  }

  return (  
    <div className="container mx-auto ">
      <nav className="flex justify-between items-center p-4 bg-gray-100 mb-5">
        <h1 className="text-4xl font-monteserat text-slate-900">File Transfer</h1>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </nav>
     
       
      {isConnected ? (
        <Room socket={socket} roomId={roomId} userName={userName} peerName={peerName} />
      ) : (
        <WaitingRoom roomId={roomId} userName={userName} />
      )}
    </div>
  );
}

export default App;
