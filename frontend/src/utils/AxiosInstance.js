import axios from "axios"
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";

// localStorage.removeItem('token');
// localStorage.removeItem('refresh_token');
// console.log(localStorage.getItem('token'))
let accessToken = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : "";
let refresh_token = localStorage.getItem('refresh_token') ? JSON.parse(localStorage.getItem('refresh_token')) : "";

const baseURL = 'http://localhost:8000/api/'

const AxiosInstance = axios.create({
    baseURL: baseURL,
    'Content-type': 'application/json',
    headers: { Authorization: localStorage.getItem('token') ? `Bearer ${accessToken}` : "" },
});

AxiosInstance.interceptors.request.use(async req => {
    if (accessToken) {
        req.headers.Authorization = localStorage.getItem('token') ? `Bearer ${accessToken}` : "";
        const user = jwt_decode(accessToken);
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
        if (!isExpired) return req;
        const resp = await axios.post(`${baseURL}token/refresh/`, {
            refresh: refresh_token
        })
        localStorage.setItem('token', JSON.stringify(resp.data.access));
        req.headers.Authorization = `Bearer ${resp.data.access}`;
        return req;
    } else {
        req.headers.Authorization = localStorage.getItem('token') ? `Bearer ${JSON.parse(localStorage.getItem('token'))}` : "";
        return req;
    }

})

export default AxiosInstance;