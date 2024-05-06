import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const darkGray = '#333333';

const style = {
    backgroundColor: 'white',
    borderColor: darkGray,
    borderStyle: 'solid',
    margin: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2vw', // Adjust font size based on viewport width
};

const Tile = ({ tileIndex, tileState, onClick }) => {
    const [squareSize, setSquareSize] = useState('50px');

    useEffect(() => {
        const updateSquareSize = () => {
            const screenWidth = window.innerWidth;
            const squareSize = screenWidth <= 768 ? `${screenWidth / 12}px` : '64px';
            setSquareSize(squareSize);
        };

        updateSquareSize();
        window.addEventListener('resize', updateSquareSize);

        return () => {
            window.removeEventListener('resize', updateSquareSize);
        };
    }, []);

    const renderIcon = () => {
        if (tileState.covered) {
            return <i />;
        }
        return <i className={tileState.icon} />;
    };

    const styleClone = {
        ...style,
        width: squareSize,
        height: squareSize,
        backgroundColor: tileState.covered ? darkGray : 'transparent'
    };

    return (
        <div
            className="tile col-xs-3"
            style={styleClone}
            onClick={onClick}
            role="button"
            tabIndex="-1"
        >
            {renderIcon()}
        </div>
    );
};

Tile.propTypes = {
    tileIndex: PropTypes.number.isRequired,
    tileState: PropTypes.shape({
        icon: PropTypes.string.isRequired,
        covered: PropTypes.bool.isRequired,
        matched: PropTypes.bool.isRequired,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
};

export default Tile;
