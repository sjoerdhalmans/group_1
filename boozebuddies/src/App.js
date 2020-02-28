import React, { Component } from "react";
import Login from "./components/Login";
import NewProfileForm from "./components/NewProfileForm";
import axios from "axios";
import FriendList from "./components/FriendList"

class App extends Component {
  state = {
    loggedIn: false,
    newAccountEmail: "",
    getUserEmail: "",
    getUserStatus: 0,
    isNewAccount: false
  };

  callBackFunction = childData => {
    this.setState({ newAccountEmail: childData }, () => this.getUserByEmail());
    this.setState({ loggedIn: true });
  };

  async getUserByEmail() {
    await axios
      .get(
        "http://217.101.44.31:8081/api/public/user/getUserByEmail/" +
          this.state.newAccountEmail
      )
      .then(res => {
        this.setState({ getUserStatus: res.status });
        this.setState({ getUserEmail: res.data.email });
        this.testIfNewAccount();
      });
  }

  testIfNewAccount() {
    if (this.state.newAccountEmail !== this.state.getUserEmail) {
      this.setState({ isNewAccount: true });
    }
  }

  render() {
    return (
      <div>
        <Login callBack={this.callBackFunction} />
        {this.state.isNewAccount && (
          <NewProfileForm newEmail={this.state.newAccountEmail} />
        )}


        {this.state.getUserEmail !="" && (
          <FriendList flist ={this.state.getUserEmail } />
        )}

      </div>
    );
  }
}

export default App;
