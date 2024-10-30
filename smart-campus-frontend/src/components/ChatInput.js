import React, { useState } from 'react';
import GifPicker from './GifPicker';
import '../styles/ChatInput.css';

const ChatInput = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');
    const [showGifPicker, setShowGifPicker] = useState(false);

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const handleGifSelect = (gifUrl) => {
        onSendMessage(gifUrl); // Send the GIF URL as a message
        setShowGifPicker(false); // Close the picker after selecting a GIF
    };

    return (
        <div className="chat-input">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
            />
            <button onClick={() => setShowGifPicker(!showGifPicker)}>
                {showGifPicker ? 'Close GIFs' : 'GIF'}
            </button>
            <button onClick={handleSend}>Send</button>
            {showGifPicker && <GifPicker onGifSelect={handleGifSelect} />}
        </div>
    );
};

export default ChatInput;
