import React, { useState } from "react";
import { useAuth0 } from "./react-auth0-spa";
import axios from "axios";

function App() {
  const {
    loading,
    user,
    isAuthenticated,
    loginWithRedirect,
    logout
  } = useAuth0();

  const [accountName, setAccountName] = useState("eses");

  if (loading) {
    return <div>Loading...</div>;
  }

  const submitHandler = event => {
    event.preventDefault();

    const newUser = {
      id: 0,
      name: accountName,
      email: user.email
    };

    axios
      .post("http://217.101.44.31:8081/api/public/user/addUser", newUser)
      .then(res => {
        console.log(res);
        console.log(res.data);
      });
  };

  const nameChangeHandler = event => {
    setAccountName(event.target.value);
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
              <form onSubmit={submitHandler}>
                <h1>New Login</h1>
                <p>Enter your name:</p>
                <input type="text" onChange={nameChangeHandler} />
                <input type="submit" />
              </form>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
