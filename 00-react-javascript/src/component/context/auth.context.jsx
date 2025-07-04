import { createContext, useState } from 'react';


export const AuthContext = createContext({
    isAuthenticated :false,
    user:{
        email:"",
        name:""
    }
});

export const AuthWrapper = (props) => {
  const [auth, setAuth] = useState({
    isAuthenticated :false,
    user:{
        email:"",
        name:""
    }
  });
  const [apploading, SetAppLoading]= useState(true);


//chuyền động giá trị từ AuthWrapper sang AuthContext
  return (
    <AuthContext.Provider value={{auth, setAuth, apploading, SetAppLoading}}> 
      {props.children }
    </AuthContext.Provider>
  );
}