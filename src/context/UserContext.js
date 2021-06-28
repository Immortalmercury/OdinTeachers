import React, { useContext, useReducer } from "react";
import API from "./../services/API";
import { getAccessToken } from '../services/JWT';

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function useUserState() {
  var context = useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

function userReducer(state, action) {
  // if (action.type != null) action = action.type;
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    case "LOGOUT_SUCCESS":
    case "UNAUTHENTICATED":
      return { ...state, isAuthenticated: false };
    case "LOGIN_ERROR":
    default: {
      return state;
      // commented for development
      // throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] =
    useReducer(
      userReducer,
      {
        isAuthenticated: !!getAccessToken(),
      }
    );

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}



export { UserProvider, useUserState, useUserDispatch, loginUser, logoutUser };

// ###########################################################

function loginUser(dispatch, login, password, remember, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  console.log(login.toString().lenght);
  console.log(password.toString().lenght);
  if (!!login && !!password ) {
    API.login(login, password, remember).then(result => {
      console.log(result);
      setIsLoading(false);
      if (result.success) {
        dispatch({ type: result.status })
      } else {
        setError(result.message);
      }
    }); 
    
  } else {
    setError('Неправильный логин или пароль');
    setIsLoading(false);
  }
}

function logoutUser(dispatch, history) {
  API.logout().then((result) => {
    console.log(result);
    if (result.success) { 
      dispatch({ type: result.status });
      history.push("/login");
    } else {
      if (result.status === "UNAUTHENTICATED"){
        history.push("/login");
      }
    }
  });
}
