import React from 'react'
import { useSelector } from 'react-redux';
import { useGetMeQuery } from './features/auth/authApi';
import { selectAuthChecked } from './features/auth/authSlice';
import AppRoutes from './routes/AppRoutes';
import TreeLoader from './components/common/loaders/TreeLoader';
import PageLoader from './components/common/loaders/PageLoader';
const App = () => {

  useGetMeQuery();
  const authChecked = useSelector(selectAuthChecked);
  console.log("App render — authChecked is:", authChecked);
  if(!authChecked){
    return <TreeLoader />;  
  }
  // return <TreeLoader />;  
  return <AppRoutes/>
}

export default App