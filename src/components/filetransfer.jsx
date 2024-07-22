import { useState, useRef, useEffect } from 'react';

function FileTransfer({ socket, roomId }) {
  const [file, setFile] = useState(null);
  const [receivedFiles, setReceivedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const sendFile = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        socket.emit('sendFile', { roomId, fileName: file.name, data: e.target.result });
      };
      reader.readAsArrayBuffer(file);
      setFile(null);
      fileInputRef.current.value = '';
    }
  };

  const downloadFile = (file) => {
    const blob = new Blob([file.data]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    socket.on('receiveFile', (fileData) => {
      setReceivedFiles(prev => [...prev, fileData]);
    });

    return () => {
      socket.off('receiveFile');
    };
  }, [socket]);

  return (
    <div>
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="bg-slate-300 text-black px-4 py-2 rounded mr-2"
        >
          Choose File
        </button>
        <span>{file ? file.name : 'No file chosen'}</span>
      </div>
      <button
        onClick={sendFile}
        disabled={!file}
        className="bg-blue-900 hover:bg-blue-300 hover:text-black text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        Send file
      </button>
      {receivedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Received Files:</h3>
          <ul>
            {receivedFiles.map((file, index) => (
              <li key={index} className="mb-2">
                {file.fileName}
                <button
                  onClick={() => downloadFile(file)}
                  className="ml-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FileTransfer;