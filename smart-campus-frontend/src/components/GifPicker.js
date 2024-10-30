// src/components/GifPicker.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/GifPicker.css';

const GifPicker = ({ onGifSelect }) => {
    const [gifs, setGifs] = useState([]);
    const [search, setSearch] = useState('');

    const fetchGifs = async (query) => {
        try {
            const apiKey = process.env.REACT_APP_GIPHY_API_KEY;

            if (!apiKey) {
                console.error('API Key is missing');
                return;
            }

            const response = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
                params: {
                    api_key: apiKey,
                    q: query,
                    limit: 10,
                },
            });

            // Extract GIF URLs properly
            const gifData = response.data.data.map(gif => {
                return {
                    id: gif.id,
                    url: gif.images.original.url, // This should point to the actual GIF
                    thumbnail: gif.images.fixed_height.url, // Use for display purposes
                    title: gif.title,
                };
            });

            setGifs(gifData);
        } catch (error) {
            console.error('Error fetching GIFs:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (search.trim()) {
            fetchGifs(search);
        }
    };

    const handleGifClick = (url) => {
        onGifSelect(url); // This should now send the original GIF URL
    };

    return (
        <div className="gif-picker">
            <form onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search for GIFs"
                />
                <button type="submit">Search</button>
            </form>
            <div className="gif-grid">
                {gifs.map((gif) => (
                    <img
                        key={gif.id}
                        src={gif.thumbnail} // This will show the thumbnail in the picker
                        alt={gif.title}
                        onClick={() => handleGifClick(gif.url)} // Send the original GIF URL
                        className="gif-thumbnail"
                    />
                ))}
            </div>
        </div>
    );
};

export default GifPicker;
