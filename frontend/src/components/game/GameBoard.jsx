import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tile from './Tile';
import AxiosInstance from "../../utils/AxiosInstance";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import formatTime from '../../utils/formatTime';

const icons = [
    'fa fa-futbol-o',
    'fa fa-fire',
    'fa fa-hand-spock-o',
    'fa fa-gamepad',
    'fa fa-eye',
    'fa fa-diamond',
    'fa fa-leaf',
    'fa fa-key',
    'fa fa-plane',
    'fa fa-anchor',
    'fa fa-car',
    'fa fa-book',
    'fa fa-bolt',
    'fa fa-circle-o',
    'fa fa-coffee',
    'fa fa-heart',
    'fa fa-snowflake-o',
    'fa fa-cloud',
    'fa fa-briefcase',
    'fa fa-calculator',
    'fa fa-camera-retro',
    'fa fa-motorcycle',
    'fa fa-rocket',
    'fa fa-smile-o',
    'fa fa-space-shuttle',
    'fa fa-umbrella',
    'fa fa-tree',
    'fa fa-star',
    'fa fa-paper-plane',
    'fa fa-music',
    'fa fa-moon-o',
    'fa fa-square',
    'fa fa-suitcase',
    'fa fa-trophy',
    'fa fa-bicycle',
    'fa fa-scissors',
    'fa fa-floppy-o',
];

const getRandom = (min, max) => {
    const rmin = Math.ceil(min);
    const rmax = Math.floor(max);
    return Math.floor(Math.random() * (rmax - rmin)) + rmin;
};

const shuffle = (array) => {
    let counter = array.length;
    const arr = array;

    while (counter > 0) {
        const index = Math.floor(Math.random() * counter);
        counter -= 1;
        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
    return arr;
};

const GameBoard = ({ sideLength }) => {
    const [tiles, setTiles] = useState([]);
    const [prevTile, setPrevTile] = useState({ index: null, icon: null });
    const [resetNext, setResetNext] = useState(false);
    const [wait, setWait] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const navigate = useNavigate();

    const refreshPage = () => {
        navigate(0);
    }

    useEffect(() => {
        const initTiles = () => {
            const iconsNeeded = (sideLength * sideLength) / 2;
            let chosenIcons = [];

            if (iconsNeeded > icons.length) {
                return false;
            }

            for (let i = 0; i < iconsNeeded; i += 1) {
                let chosen = null;

                do {
                    const index = getRandom(0, icons.length);
                    chosen = icons[index];
                } while (chosenIcons.includes(chosen));

                chosenIcons.push(chosen);
            }

            chosenIcons = chosenIcons.concat(chosenIcons);
            chosenIcons = shuffle(chosenIcons);

            const newTiles = Array(sideLength * sideLength).fill(null).map(() => ({
                icon: chosenIcons.pop(),
                covered: true,
                matched: false,
            }));
            setTiles(newTiles);
        };

        initTiles();
        setStartTime(Date.now());

        return () => {
            // Clear timer if component unmounts
            setStartTime(null);
        };
    }, [sideLength]);

    useEffect(() => {
        // Update elapsed time every second
        const interval = setInterval(() => {
            if (startTime) {
                const endTime = Date.now();
                setElapsedTime((endTime - startTime) / 1000); // Convert to seconds
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    const handleClick = async (i) => {
        if (tiles[i].matched || wait || !tiles[i].covered) {
            return;
        }

        if (tiles[i].covered && !resetNext) {
            let newTiles = [...tiles];
            newTiles[i].covered = false;

            setResetNext(true);
            setPrevTile({ index: i, icon: tiles[i].icon });
            setTiles(newTiles);
        } else if (tiles[i].covered && resetNext) {
            let newTiles = [...tiles];
            newTiles[i].covered = false;

            setResetNext(false);
            setWait(true);
            setTiles(newTiles);

            if (newTiles[i].icon === prevTile.icon) {
                newTiles[i].matched = true;
                newTiles[prevTile.index].matched = true;

                setTiles(newTiles);
                setWait(false);
            } else {
                setTimeout(() => {
                    newTiles = [...tiles];
                    newTiles[i].covered = true;
                    newTiles[prevTile.index].covered = true;

                    setWait(false);
                    setTiles(newTiles);
                }, 750);
            }
        }

        let allMatched = true;
        for (let ind = 0; ind < tiles.length; ind += 1) {
            if (!tiles[ind].matched) {
                allMatched = false;
                break;
            }
        }

        if (allMatched === true) {
            try {
                const level = sideLength / 2 - 1;
                const response = await AxiosInstance.post("/game/records/", { level: level, time_taken: elapsedTime.toFixed(0) });
                console.log(response.data.data);
                toast.success(response.data.message);
            } catch (error) {
                console.error('Failed to save data', error);
                toast.error('Failed to save data');
            }
            refreshPage();
        }
    };

    const tileRender = (key, ind) => (
        <Tile
            key={key}
            tileIndex={ind}
            tileState={tiles[ind]}
            onClick={() => handleClick(ind)}
        />
    );

    const renderBoard = () => {
        if (!tiles.length) {
            return <div>Sidelength too long</div>;
        }

        const board = [];
        let tileIndex = 0;

        for (let i = 0; i < sideLength; i += 1) {
            const row = [];
            for (let j = 0; j < sideLength; j += 1) {
                row.push(tileRender(j, tileIndex));
                tileIndex += 1;
            }
            board.push(<div className="row" key={i}>{row}</div>);
        }

        return board;
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col">
                    <h4>Time: {formatTime(elapsedTime.toFixed(0))}</h4>
                </div>
            </div>
            {renderBoard()}
        </div>
    );
};

GameBoard.propTypes = {
    sideLength: PropTypes.number.isRequired,
};

export default GameBoard;
