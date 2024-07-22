import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';
import Room from './components/Room';
import WaitingRoom from './components/waitingroom';

const socket = io('http://localhost:3001'); // Replace with your server URL

function App() {
  const [roomId, setRoomId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState('');
  const [peerName, setPeerName] = useState('');
  const [isJoining, setIsJoining] = useState(true);

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

  const handleJoinRoom = (name) => {
    setUserName(name);
    setIsJoining(false);
    
    if (roomId) {
      socket.emit('joinRoom', { roomId, userName: name });
    } else {
      const newRoomId = uuidv4();
      setRoomId(newRoomId);
      socket.emit('createRoom', { roomId: newRoomId, userName: name });
    }
  };

  if (isJoining) {
    return (
      <div className="container mx-auto justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Enter Your Name</h1>
        <input
          type="text"
          placeholder="Your Name"
          className="border p-2 mr-2"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleJoinRoom(e.target.value);
            }
          }}
        />
        <button
          onClick={() => handleJoinRoom(document.querySelector('input').value)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Join Room
        </button>
      </div>
    );
  }

  return (  
    <div className="container mx-auto p-4">
      {isConnected ? (
        <Room socket={socket} roomId={roomId} userName={userName} peerName={peerName} />
      ) : (
        <WaitingRoom roomId={roomId} userName={userName} />
      )}
    </div>
  );
}

export default App;