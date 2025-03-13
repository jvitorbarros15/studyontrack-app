import React, { useState } from 'react';
import './App.css';

const UpdateScores = ({ onUpdateScores }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target.result;
                const scores = text.split('\n').map(line => {
                    const [type, score] = line.split(',');
                    return { type: type.trim(), score: Number(score.trim()) };
                });
                onUpdateScores(scores);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="update-scores-container">
            <h1>Update Scores</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" accept=".txt" onChange={handleFileChange} required />
                <button type="submit">Upload Scores</button>
            </form>
        </div>
    );
};

export default UpdateScores; 