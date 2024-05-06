import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import AxiosInstance from "../utils/AxiosInstance";
import bgImg from '../assets/bg-img.jpeg'

const Home = () => {
    const refresh = JSON.parse(localStorage.getItem('refresh_token'))
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const navigate = useNavigate();

    const jwt = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        if (jwt === null && !user) {
            setIsAuthenticated(false);
        } else {
            setIsAuthenticated(true);
        }
    }, [jwt, user])

    const handleLogout = async () => {
        const res = await AxiosInstance.post('logout/', { 'refresh_token': refresh })
        if (res.status === 204) {
            localStorage.removeItem('token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('user')
            navigate('/')
            toast.success("Logout successful")
        }
    }
    return (
        <div className='container'>
            <h2>Hey {isAuthenticated ? <span style={{ backgroundColor: '#8a8bc0', color: 'white', padding: '5px' }}>{user && user.username}</span> : 'there'}!! Welcome to the arena ;)</h2>
            <p className="blink" style={{ textAlign: 'center', fontSize: '2.1vh' }}>Victory is just a few clicks away...</p>
            <div className="bg-container">
                <img src={bgImg} alt="background" className="bg-image" />
            </div>
            {isAuthenticated ? <button href='' onClick={handleLogout} className='logout-btn'>Logout</button> : <></>}
        </div>
    )
}

export default Home;