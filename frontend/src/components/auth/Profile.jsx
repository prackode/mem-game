import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import AxiosInstance from "../../utils/AxiosInstance";

const Profile = () => {
    const jwt = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))
    console.log(user);
    const navigate = useNavigate();

    useEffect(() => {
        if (jwt === null && !user) {
            toast.error("User must be logged in");
            navigate('/login');
        } else {
            getSomeData()
        }

    }, [jwt, user])

    const getSomeData = async () => {
        const res = await AxiosInstance.get('get-something/')
        console.log(res.data)
    }
    const refresh = JSON.parse(localStorage.getItem('refresh_token'))

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
            <h2>Hi, {user && user.username}</h2>
            <p style={{ textAlign: 'center', }}>Welcome to the profile</p>
            <button onClick={handleLogout} className='logout-btn'>Logout</button>
        </div>
    )
}

export default Profile;