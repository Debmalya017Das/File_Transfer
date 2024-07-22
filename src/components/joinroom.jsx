import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function JoinRoom({ socket }) {
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (roomId) {
      socket.emit('joinRoom', roomId);
      navigate('/', { replace: true });
    }
  }, [roomId, socket, navigate]);

  return <div>Joining room...</div>;
}

export default JoinRoom;

