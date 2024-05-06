import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from './components/auth/Profile';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import Home from './components/Home';
import Game from './components/game/Game';
import Leaderboard from './components/game/Leaderboard';
import Navbar from "./components/Navbar/Navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <div className='App'>
      <Router>
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/game' element={<Game />} />
          <Route path='/leaderboard' element={<Leaderboard />} />
          <Route path='/register' element={<Signup />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </Router>
    </div >
  );
}

export default App;
