import React from 'react'
import { useSelector } from 'react-redux';
import { useGetMeQuery } from './features/auth/authApi';
import { selectAuthChecked } from './features/auth/authSlice';
import AppRoutes from './routes/AppRoutes';
const App = () => {

  useGetMeQuery();
  const authChecked = useSelector(selectAuthChecked);
  console.log("App render — authChecked is:", authChecked);
  if(!authChecked){
    return <div
    className='d-flex justify-content-center align-items-center vh-100'>Loading...</div>
  }
  return <AppRoutes/>
}

export default App