import React, { Component } from "react";
import axios from "axios";
import { Navbar, Nav, Form, } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './style.css';

import AddFriend from "./components/AddFriend";
import NewProfileForm from "./components/NewProfileForm";
import ChangeUsername from "./components/ChangeUsername";
import FriendList from "./components/FriendList";
import Login from "./components/Login";

class App extends Component {
  state = {
    loggedIn: false,
    newAccountEmail: "",
    getUserEmail: "",
    getUserId: 0,
    getUserName: "",
    getUserStatus: 0,
    isNewAccount: false,
    showFriendsState: false,
    changeUsernameState: false,
    addFriendState: false
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
        this.setState({ getUserId: res.data.id });
        this.setState({ getUserName: res.data.name });
        console.log(this.state);
        this.testIfNewAccount();
      });
  }

  testIfNewAccount() {
    if (this.state.newAccountEmail !== this.state.getUserEmail) {
      this.setState({ isNewAccount: true });
    }
  }

  loginCallBack = childData => {
    this.setState({ newAccountEmail: childData }, () => this.getUserByEmail());
    this.setState({ loggedIn: true });
  };

  newProfileFormCallBack = () => {
    this.setState({ isNewAccount: false }, () => this.getUserByEmail());
  };

  changeUsernameCallBack = () => {
    this.setState({ changeUsernameState: false }, () => this.getUserByEmail());
  };

  hideButtonCallBack = () => {
    this.setState({ showFriendsState: false });
  };

  showFriends = () => {
    this.setState({ showFriendsState: true });
  };

  changeUsername = () => {
    this.setState({ changeUsernameState: true });
  };

  render() {
    return (
      <div className="flexContainer">
        <Navbar className="navBar" expand="lg">
          <h2 className="navBarTitle" href="#home">Boozebuddies</h2>
          {this.state.loggedIn && (
            <div>
              <Nav.Link href="#friends" onClick={() => this.showFriends()}>
                Friends
              </Nav.Link>
              <Nav.Link
                href="#changeName"
                onClick={() => this.changeUsername()}
              >
                Change Username
              </Nav.Link>
            </div>
          )}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto"></Nav>
            <Form inline>
              <Nav.Link href="#profile">{this.state.getUserName}</Nav.Link>
              <Login callBack={this.loginCallBack} />
            </Form>
          </Navbar.Collapse>
        </Navbar>

        {this.state.isNewAccount && (
          <NewProfileForm
            newEmail={this.state.newAccountEmail}
            callBack={this.newProfileFormCallBack}
          />
        )}

        <div className="friendList">
        {this.state.showFriendsState && (
          <FriendList
            userId={this.state.getUserId}
            userName={this.state.getUserName}
            userStatus={this.state.getUserStatus}
            flist={this.state.getUserEmail}
            callBack={this.hideButtonCallBack}
          />
        )}
        </div>

        {this.state.changeUsernameState && (
          <ChangeUsername
            userId={this.state.getUserId}
            callBack={this.changeUsernameCallBack}
          />
        )}

        {this.state.addFriendState && (
          <AddFriend
            userId={this.state.getUserId}
            userName={this.state.getUserName}
            userEmail={this.state.getUserEmail}
          />
        )}

        {!this.state.loggedIn && (
          <div>
            <h1 className="mainHeader1">Welcome to Boozebuddies!</h1>
            <h2 className="mainHeader2">Log in to proceed.</h2>
          </div>
        )}
      </div>
    );
  }
}

export default App;