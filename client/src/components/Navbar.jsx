import { useDispatch, useSelector } from 'react-redux';
import { motion } from "motion/react"
import { BsRobot, BsCoin } from 'react-icons/bs';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { FaUserAstronaut } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServerURL } from '../App';
import axios from 'axios';
import { setUserData } from '../redux/userSlice';
import AuthModel from './AuthModel';

function Navbar() {
  const { userData } = useSelector((state) => state.user);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showAuth, setShowAuth] = useState(false);


  const handleLogout = async () => {
    try {
      await axios.get(ServerURL + "/api/auth/logout", { withCredentials: true });
      dispatch(setUserData(null));
      setShowUserPopup(false);
      setShowCreditPopup(false);
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  return (
    <div className="bg-[#f3f3f3] flex justify-center px-4 pt-4">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-sm border border-gray-200 px-8 py-1 flex items-center justify-between relative"
      >
        <div className="flex items-center gap-3 cursor-pointer">
          <div className='bg-black text-white p-2 rounded-lg'>
            <BsRobot size={12} />
          </div>
          <h1 className='font-semibold hidden md:block text-lg'>IntervuIQ.AI</h1>
        </div>

        <div className="flex items-center gap-6 required">
          <div className="relative">
            <button onClick={() => {
              if (!userData) {
                setShowAuth(true);
                return;
              }
              setShowCreditPopup(!showCreditPopup); setShowUserPopup(false)
            }} className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-md hover:bg-gray-200 transition '>
              <BsCoin size={20} />
              {userData?.credits || 0}
            </button>

            {showCreditPopup && (
              <div className="absolute -right-12.5 mt-3 w-64 bg-white shadow-xl border border-gray-200 rounded-xl p-5 z-50">
                <p className="text-sm text-gray-700">Need more credits to continue interviews?</p>
                <button onClick={() => navigate('/pricing')}
                  className="w-full bg-black text-white py-2 rounded-lg text-sm">Buy more credits</button>
              </div>
            )}
          </div>

          <div className="relative">
            <button onClick={() => {
              if (!userData) {
                setShowAuth(true);
                return;
              }
              setShowUserPopup(!showUserPopup);
              setShowCreditPopup(false)
            }} className='w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-semibold'>
              {userData?.name?.slice(0, 1)?.toUpperCase() || <HiOutlineUserCircle size={20} />}
            </button>

            {showUserPopup && (
              <div className="absolute  right-0 mt-3 w-64 bg-white shadow-xl border border-gray-200 rounded-xl p-4 z-50">
                <p className="text-md text-blue-500 font-medium mb-1">{userData?.name}</p>
                <button onClick={() => navigate('/interview-history')}
                  className="w-full text-left text-sm py-2 hover:text-black text-gray-600">InterView History</button>
                <button onClick={handleLogout}
                  className="w-full text-left text-sm py-2 flex items-center gap-2 text-red-500 ">
                  <HiOutlineUserCircle size={20} />
                  Logout</button>
              </div>
            )}
          </div>

        </div>


      </motion.div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </div>
  );
}

export default Navbar;