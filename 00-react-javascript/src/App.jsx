import React, { useContext } from 'react';
import axios from './util/axios.customize'
import { useEffect } from 'react'
import './style/global.css'
import Header from './component/layout/header';
//outlet goi noi dung tu cac route con(children)
import { Outlet } from 'react-router-dom';
import { AuthContext } from './component/context/auth.context';
import {Spin} from 'antd';
import '@fortawesome/fontawesome-free/css/all.min.css';
function App() { 
  const {setAuth,apploading, SetAppLoading} = useContext(AuthContext);
  useEffect(()=>{
    const fetchAccount = async() => {
      SetAppLoading(true);// //sử lý đồng bồ trang khi load mạng chậm
      const res = await axios.get(`/v1/api/account`)
      if(res && !res.message){
        setAuth({
          isAuthenticated : true,
          user:{
            phonenumber: res.phonenumber,
            name: res.name
          }
        })
      }else{
        console.log("thử res >>",res)
      }
      SetAppLoading(false);
    }
    fetchAccount()
  },[]) 

  return (
  <div>
    {apploading === true ? (
      <>
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        WebkitTransform: 'translate(-50%, -50%)',
      }}>
        <Spin/>
      </div>
      
      </>
    ) : (
      <>
        <Header />
        <Outlet />
      </>
    )}
  </div>
);

}
export default App
