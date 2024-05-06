import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import AxiosInstance from "../../utils/AxiosInstance";
import GameBoard from './GameBoard';
import formatTime from '../../utils/formatTime';
import convertTime from '../../utils/convertTime';

const Game = () => {
    const jwt = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))
    const navigate = useNavigate();
    const [pastPerformances, setPastPerformances] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState(4);
    const [toggleGame, setToggleGame] = useState(false);

    useEffect(() => {
        if (jwt === null && !user) {
            toast.error("User must be logged in");
            navigate('/login');
        } else {
            getSomeData();
        }
    }, [jwt, user])

    const getSomeData = async () => {
        const res = await AxiosInstance.get('get-something/')
        console.log(res.data)
    }

    useEffect(() => {
        fetchPastPerformances();
    }, []);

    const fetchPastPerformances = async () => {
        try {
            const response = await AxiosInstance.get("/game/records/");
            setPastPerformances(response.data.data.reverse());
            console.log(response.data.data);
        } catch (error) {
            console.error('Failed to fetch past performances:', error.response.data);
            toast.error('Failed to fetch past performances');
        }
    };

    const handleStartGame = (sideLength) => {
        setToggleGame(true);
        setSelectedLevel(sideLength);
    };

    const renderPastPerformances = (level) => {
        level = level / 2 - 1;
        const performances = pastPerformances.filter(performance => performance.level === level);

        if (performances.length === 0) {
            return (
                <div className="container mt-4 text-muted">
                    <h3 className="p-8 text-center">Past Performance</h3>
                    <h5 className="text-center">No data to display</h5>
                </div>
            );
        }

        return (
            <div className="container mt-4">
                <h3 className="p-8 text-center">Past Performance</h3>
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th className="text-center">Time Taken</th>
                                <th className="text-center">Played At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {performances.map((performance, index) => (
                                <tr key={index}>
                                    <td>{formatTime(performance.time_taken)}</td>
                                    <td>{convertTime(performance.date_played)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="container text-center">
            {!toggleGame && (
                <>
                    <h2>Game Level</h2>
                    <div className="btn-group" role="group">
                        <button
                            type="button"
                            className={`btn ${selectedLevel === 4 ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setSelectedLevel(4)}
                        >
                            Level 1
                        </button>
                        <button
                            type="button"
                            className={`btn ${selectedLevel === 6 ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setSelectedLevel(6)}
                            style={{ marginLeft: '10px' }}
                        >
                            Level 2
                        </button>
                        <button
                            type="button"
                            className={`btn ${selectedLevel === 8 ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setSelectedLevel(8)}
                            style={{ marginLeft: '10px' }}
                        >
                            Level 3
                        </button>
                    </div><br />
                    <button
                        type="button"
                        className="btn btn-danger mt-4"
                        onClick={() => handleStartGame(selectedLevel)}
                    >
                        Start
                    </button><br /><br />
                    {renderPastPerformances(selectedLevel)}
                </>
            )}

            {toggleGame && (
                <div>
                    <GameBoard sideLength={selectedLevel} />
                </div>
            )}
        </div>
    );
}

export default Game;
