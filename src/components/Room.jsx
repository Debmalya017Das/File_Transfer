import FileTransfer from './filetransfer';

function Room({ socket, roomId, userName, peerName }) {
  return (
        <>
     
       <div className="min-h-full flex items-center justify-center w-full space-y-8"> 
        <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">
            Connected With Peer: {peerName}
        </h1>
        <p className="mb-4">You are: {userName}</p>
        <FileTransfer socket={socket} roomId={roomId} />
        </div>
        
     </div>
    </>
  );
}

export default Room;