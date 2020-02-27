import { useAuth0 } from "../react-auth0-spa";
import axios from "axios";
import React, { useState } from "react";

function Login(props) {
  const {
    loading,
    user,
    isAuthenticated,
    loginWithRedirect,
    logout
  } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  const loggedIn = () => {
    props.callBack(user.email);
  };

  return (
    <div className="App">
      <header>
        <div>
          {!isAuthenticated && (
            <button onClick={() => loginWithRedirect({})}>Log in</button>
          )}
          {isAuthenticated && (
            <div>
              <button onClick={() => logout()}>Log out</button>
              <button onClick={loggedIn}>check for new login</button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default Login;
