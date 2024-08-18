import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './css/client.css';

const socket = io('http://192.168.43.179:8000');

function Client() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log(socket.id);
    });

    // Handle receiving text messages
    socket.on('resmsg', (msg) => {
      setMessages((prevMessages) => [...prevMessages, { text: msg, sender: 'friend' }]);
    });

    // Handle receiving media (images and videos)
    socket.on('resmedia', (data) => {
      const { buffer, type } = data;
      const blob = new Blob([buffer], { type });
      const mediaUrl = URL.createObjectURL(blob);

      setMessages((prevMessages) => [...prevMessages, { mediaUrl, sender: 'friend', type }]);
    });
  }, []);

  const sendMessage = () => {
    if (files.length > 0) {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const arrayBuffer = reader.result;
          const mimeType = file.type || 'application/octet-stream'; // Default to 'application/octet-stream' if type is not available
          socket.emit('media', { buffer: arrayBuffer, type: mimeType });
          setMessages((prevMessages) => [
            ...prevMessages,
            { mediaUrl: URL.createObjectURL(file), sender: 'you', type: mimeType },
          ]);
        };
        reader.readAsArrayBuffer(file);
      });
      setFiles([]); // Clear the file input after sending
    } else if (message.trim()) {
      // If no file is selected, send a text message
      socket.emit('massage', message);
      setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'you' }]);
      setMessage(''); // Clear the message input
    }
  };

  return (
    <div className='container'>
      <h1 className='header'>Friend CHATS</h1>
      <div className='chatContainer'>
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === 'friend' ? 'message' : 'message2'}>
            <h6>{msg.sender === 'friend' ? 'Friend :' : 'You :'}</h6>
            {msg.text && <h5 className='text'>{msg.text}</h5>}
            {msg.mediaUrl && (msg.type.startsWith('image/') ? (
              <img src={msg.mediaUrl} alt='Sent' className='image' />
            ) : msg.type.startsWith('video/') ? (
              <video src={msg.mediaUrl} controls className='video' />
            ) : null)}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className='input'
        placeholder='Type your message...'
      />
      <input
        type="file"
        onChange={(e) => setFiles(Array.from(e.target.files))}
        className='input'
        multiple
      />
      <button onClick={sendMessage} className='button'>
        Send
      </button>
    </div>
  );
}

export default Client;
