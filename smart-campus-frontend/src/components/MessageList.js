import React, { useEffect, useRef, useState } from 'react';
import '../styles/ChatPage.css';

const MessageList = ({ messages }) => {
    const messageEndRef = useRef(null);
    const [autoplayVideoIds, setAutoplayVideoIds] = useState(new Set()); // Track which videos should autoplay

    useEffect(() => {
        const scrollToBottom = () => {
            messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        };
        scrollToBottom();
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
            // Check if the message is the specific SOS video
            const specificVideoUrl = 'https://www.youtube.com/watch?v=qf8GGfWZw5Q';
            const currentTime = new Date();
            const messageTime = new Date(message.timestamp.seconds * 1000);
            const timeDifference = (currentTime - messageTime) / 1000; // Time difference in seconds

            if (message.text === specificVideoUrl) {
                if (timeDifference <= 300) { // 5 minutes = 300 seconds
                    // Autoplay if within the 5-minute window
                    return (
                        <iframe
                            title="YouTube Video"
                            width="560"
                            height="315"
                            src={getYouTubeEmbedUrl(message.text) + "?autoplay=1"} // Auto play the specific video
                            frameBorder="0"
                            allowFullScreen
                            className="youtube-embed"
                        />
                    );
                } else {
                    // Render the video without autoplay after 5 minutes
                    return (
                        <iframe
                            title="YouTube Video"
                            width="560"
                            height="315"
                            src={getYouTubeEmbedUrl(message.text)} // Normal play without autoplay
                            frameBorder="0"
                            allowFullScreen
                            className="youtube-embed"
                        />
                    );
                }
            }

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

            if (message.text.includes('.gif')) {
                return <img src={message.text} alt="GIF" className="gif-message" />;
            }

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

            return <span>{parts}</span>;
        }

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

        return <span>Unsupported message format</span>;
    };

    return (
        <div className="message-list">
            {messages.map((message) => {
                // Check if the message is from 'System Alert' or is an SOS message
                const isSystemAlert = message.username === 'System Alert';
                const isSOS = message.isSOS || isSystemAlert;

                return (
                    <div
                        key={message.id}
                        className={`message ${message.isAdmin ? 'admin-message' : ''} ${
                            isSOS ? 'sos-alert' : ''
                        }`}
                    >
                        <span className="message-user">{message.username}</span>
                        <span className="message-timestamp">
                            {new Date(message.timestamp.seconds * 1000).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                        <div className={`message-text ${isSOS ? 'sos-alert-content' : ''}`}>
                            {renderMessageContent(message)}
                        </div>
                    </div>
                );
            })}
            <div ref={messageEndRef} />
        </div>
    );
};

export default MessageList;
