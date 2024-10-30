import React, { useEffect, useRef } from 'react';
import '../styles/ChatPage.css';

const MessageList = ({ messages }) => {
    const messageEndRef = useRef(null);

    useEffect(() => {
        // Scroll to the bottom whenever messages change
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const isYouTubeUrl = (url) => {
        const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        return youtubeRegex.test(url);
    };

    const getYouTubeEmbedUrl = (url) => {
        const videoId = url.split("v=")[1]?.split("&")[0] || url.split("be/")[1]?.split("?")[0];
        return `https://www.youtube.com/embed/${videoId}`;
    };

    const renderMessageContent = (message) => {
        if (typeof message.text === 'string') {
            // Check for YouTube URL
            if (isYouTubeUrl(message.text)) {
                return (
                    <iframe
                        title="YouTube Video"
                        width="560"
                        height="315"
                        src={getYouTubeEmbedUrl(message.text)}
                        frameBorder="0"
                        allowFullScreen
                        className="youtube-embed"
                    />
                );
            }

            // Check for GIF URL
            if (message.text.includes('.gif')) {
                return <img src={message.text} alt="GIF" className="gif-message" />;
            }

            // Render text as clickable link if it's a URL
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const parts = message.text.split(urlRegex).map((part, index) => 
                urlRegex.test(part) ? (
                    <a key={index} href={part} target="_blank" rel="noopener noreferrer">
                        {part}
                    </a>
                ) : (
                    part
                )
            );

            return <span>{parts}</span>; // Render text with clickable links
        } 
        
        // Handle cases where message.text is an object
        if (message.text && typeof message.text === 'object') {
            return (
                <>
                    {message.text.gif && (
                        <img src={message.text.gif} alt="GIF" className="gif-message" />
                    )}
                    {message.text.image && (
                        <img src={message.text.image} alt="Image" className="image-message" />
                    )}
                    {message.text.text && <span>{message.text.text}</span>}
                </>
            );
        }

        return <span>Unsupported message format</span>; // Fallback for unsupported formats
    };

    return (
        <div className="message-list">
            {messages.map((message) => (
                <div key={message.id} className={`message`}>
                    <span className="message-user">{message.username}</span>
                    <span className="message-timestamp">
                        {new Date(message.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className="message-text">
                        {renderMessageContent(message)} {/* Render the message content */}
                    </div>
                </div>
            ))}
            <div ref={messageEndRef} />
        </div>
    );
};

export default MessageList;
