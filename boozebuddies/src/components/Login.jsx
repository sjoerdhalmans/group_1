import React from "react";
import { useAuth0 } from "../react-auth0-spa";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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
            <Button variant="outline-success" onClick={() => loginWithRedirect({})}>Log in</Button>
          )}
          {isAuthenticated && (
            <div>
              <Button variant="outline-success" onClick={() => logout()}>Log out</Button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default Login;
