// function WaitingRoom({ roomId, userName }) {
//   const roomUrl = `${window.location.origin}?room=${roomId}`;

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(roomUrl);
//   };

//   return (
//     <div className="text-center">
//       <h1 className="text-2xl font-bold mb-4">Welcome, {userName}!</h1>
//       <h2 className="text-xl mb-4">Waiting for a Peer to Join</h2>
//       <div className="flex justify-center space-x-2 mb-4">
//         <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
//         <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
//         <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
//       </div>
//       <p className="mb-2">Your Room URL: (Share with Anyone in World)</p>
//       <input
//         type="text"
//         value={roomUrl}
//         readOnly
//         className="w-full p-2 mb-2 border rounded"
//       />
//       <button
//         onClick={copyToClipboard}
//         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//       >
//         Copy to Clipboard
//       </button>
//     </div>
//   );
// }

// export default WaitingRoom;


function WaitingRoom({ roomId, userName }) {
  const roomUrl = `${window.location.origin}?room=${roomId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomUrl);
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome, {userName}!</h1>
      <h2 className="text-xl mb-4">Waiting for a Peer to Join</h2>
      <div className="flex justify-center space-x-2 mb-4">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
        <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
      </div>
      <p className="mb-2">Your Room URL: (Share with Another User)</p>
      <input
        type="text"
        value={roomUrl}
        readOnly
        className="w-full p-2 mb-2 border rounded"
      />
      <button
        onClick={copyToClipboard}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Copy to Clipboard
      </button>
      <p className="mt-4 text-red-500">
        Note: The other user must log in with a different account to join this room.
      </p>
    </div>
  );
}

export default WaitingRoom;

