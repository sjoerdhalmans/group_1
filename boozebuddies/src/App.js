import React, { Component } from "react";
import Login from "./components/Login";
import NewProfileForm from "./components/NewProfileForm";
import ChangeUsername from "./components/ChangeUsername";
import axios from "axios";
import FriendList from "./components/FriendList";
import { Navbar, Nav, Form, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './style.css';

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
    changeUsernameState: false
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
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#home">Boozebuddies</Navbar.Brand>
          {this.state.loggedIn && (
            <>
              <Nav.Link href="#friends" onClick={() => this.showFriends()}>
                Friends
              </Nav.Link>
              <Nav.Link
                href="#changeName"
                onClick={() => this.changeUsername()}
              >
                Change Username
              </Nav.Link>
            </>
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

        {!this.state.loggedIn && (
          <>
            <h1 className="mainHeader1">Welcome to Boozebuddies!</h1>
            <h2 className="mainHeader2">log in to proceed</h2>
          </>
        )}
      </div>
    );
  }
}

export default App;
