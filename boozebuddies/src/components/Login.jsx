import React from "react";
import { useAuth0 } from "../react-auth0-spa";
import { useState, useEffect } from "react";
import { useRef } from "react";

function Login(props) {
  const {
    loading,
    user,
    isAuthenticated,
    loginWithRedirect,
    logout
  } = useAuth0();

  const [total, setTotal] = useState(0);

  if (loading) {
    return <div>Loading...</div>;
  }

  const callBackFunction = () => {
    props.callBack(user.email);
  };

  if (isAuthenticated && total < 1) {
    setTotal(total + 1);
    callBackFunction();
  }

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
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default Login;
