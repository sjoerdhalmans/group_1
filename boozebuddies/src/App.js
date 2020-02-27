import React, { Component } from "react";
import Login from "./components/Login";
import NewProfileForm from "./components/NewProfileForm";
import axios from "axios";

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

    console.log("alussa childData: " + childData);

    //if (this.state.newAccountEmail == childData) {

    //}
  };

  async getUserByEmail() {
    console.log("alussa newAccount: " + this.state.newAccountEmail);
    await axios
      .get(
        "http://217.101.44.31:8081/api/public/user/getUserByEmail/" +
          this.state.newAccountEmail
      )
      .then(res => {
        console.log(res);
        console.log("callin jälkeen res.email: " + res.data.email);
        this.setState({ getUserStatus: res.status });
        this.setState({ getUserEmail: res.data.email });
        console.log("callin jälkeen userEmail: " + this.state.getUserEmail);
        this.testIfNewAccount();
      });
    //.then(this.testIfNewAccount());
  }

  testIfNewAccount() {
    console.log("testissä newAccount: " + this.state.newAccountEmail);
    console.log("testissä userEmail: " + this.state.getUserEmail);

    if (this.state.newAccountEmail != this.state.getUserEmail) {
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
      </div>
    );
  }
}

export default App;
