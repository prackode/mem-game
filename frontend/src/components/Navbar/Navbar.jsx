import { useState, useEffect } from 'react'
import styles from './Navbar.module.css';

function Navbar() {
    const [isActive, setIsActive] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const jwt = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        if (jwt === null && !user) {
            setIsAuthenticated(false);
        } else {
            setIsAuthenticated(true);
        }
    }, [jwt, user])

    const toggleActiveClass = () => {
        setIsActive(!isActive);
    };

    const removeActive = () => {
        setIsActive(false)
    }

    return (
        <div className="App">
            <header className="App-header">
                <nav className={`${styles.navbar}`}>
                    <a className={`${styles.logo}`}>MTG. </a>
                    <ul className={`${styles.navMenu} ${isActive ? styles.active : ''}`}>
                        <li onClick={removeActive}>
                            <a href='/' className={`${styles.navLink}`}>Home</a>
                        </li>
                        {isAuthenticated ?
                            <li onClick={removeActive}>
                                <a href='/game' className={`${styles.navLink}`}>Game</a>
                            </li> : <></>
                        }
                        <li onClick={removeActive}>
                            <a href='/leaderboard' className={`${styles.navLink}`}>Leaderboard</a>
                        </li>
                        {!isAuthenticated ?
                            <>
                                <li onClick={removeActive}>
                                    <a href='/register' className={`${styles.navLink}`}>Register</a>
                                </li>
                                <li onClick={removeActive}>
                                    <a href='/login' className={`${styles.navLink}`}>Login</a>
                                </li>
                            </> : <></>
                        }

                    </ul>
                    <div className={`${styles.hamburger} ${isActive ? styles.active : ''}`} onClick={toggleActiveClass}>
                        <span className={`${styles.bar}`}></span>
                        <span className={`${styles.bar}`}></span>
                        <span className={`${styles.bar}`}></span>
                    </div>
                </nav>
            </header>
        </div>
    );
}
export default Navbar;