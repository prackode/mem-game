import React, { useState, useEffect } from 'react';
import axios from 'axios';
import formatTime from '../../utils/formatTime';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(1);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/leaderboard/${currentLevel}`);
                setLeaderboard(response.data);
            } catch (error) {
                console.error('Failed to fetch leaderboard:', error);
            }
        };
        fetchLeaderboard();
    }, [currentLevel]);

    const handleLevelChange = (level) => {
        setCurrentLevel(level);
    };

    return (
        <div className="container text-center">
            <h2>Leaderboard</h2>
            <div className="btn-group d-flex justify-content-center mb-4" role="group">
                <button
                    type="button"
                    className={`btn ${currentLevel === 1 ? 'btn-primary' : 'btn-secondary'} active`}
                    onClick={() => handleLevelChange(1)}
                >
                    Level 1
                </button>
                <button
                    type="button"
                    className={`btn ${currentLevel === 2 ? 'btn-primary' : 'btn-secondary'} active`}
                    onClick={() => handleLevelChange(2)}
                    style={{ marginLeft: '10px' }}
                >
                    Level 2
                </button>
                <button
                    type="button"
                    className={`btn ${currentLevel === 3 ? 'btn-primary' : 'btn-secondary'} active`}
                    onClick={() => handleLevelChange(3)}
                    style={{ marginLeft: '10px' }}
                >
                    Level 3
                </button>
            </div><br />
            <div className="container">
                {leaderboard.length === 0 ? (
                    <p className="text-muted">No data to display</p>
                ) : (
                    <div className="row justify-content-center">
                        <div className="col">
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="text-center">User</th>
                                            <th className="text-center">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaderboard.map((entry, index) => (
                                            <tr key={index}>
                                                <td>{entry.user}</td>
                                                <td>{formatTime(entry.best_time)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Leaderboard;
