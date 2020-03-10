import React, { Component, Fragment } from "react";
import Login from "./components/Login";
import NewProfileForm from "./components/NewProfileForm";
import axios from "axios";
import FriendList from "./components/FriendList"
import { Navbar, Nav, Button, Form, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      <Fragment>
      <Navbar bg="Light" expand="lg">
      <Navbar.Brand href="#home">Boozebuddies</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          
        </Nav>
        <Form inline>
          <Login callBack={this.callBackFunction} />
        </Form>
      </Navbar.Collapse>
    </Navbar>


      <div>
        {this.state.isNewAccount && (
          <NewProfileForm newEmail={this.state.newAccountEmail} />
        )}


        {this.state.getUserEmail !="" && (
          <FriendList flist ={this.state.getUserEmail } />
        )}

      </div>
      </Fragment>
    );
  }
}

export default App;
