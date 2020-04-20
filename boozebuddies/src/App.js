import React, { Component } from "react";
import axios from "axios";
import { Navbar, Nav, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import NewProfileForm from "./components/NewProfileForm";
import ChangeUsername from "./components/ChangeUsername";
import FriendList from "./components/FriendList";
import Login from "./components/Login";
import BarList from "./components/BarList";
import BeerList from "./components/BeerList";
import Timeline from "./components/Timeline";

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
    barListState: false,
    beerListState: false,
    timelineState: false,
    barId: 0,
  };

  async testApi() {
    await axios
      .get("http://217.101.44.31:8081/api/public/user/getUserByEmail/test")
      .then((res) => {
        console.log("getUserByEmail:");
        console.log(res);
        console.log(res.data);
        if (res.data.name === "dontDelete") {
          this.getUserByEmail();
        } else {
          this.testApi();
        }
      });
  }

  async getUserByEmail() {
    await axios
      .get(
        "http://217.101.44.31:8081/api/public/user/getUserByEmail/" +
          this.state.newAccountEmail
      )
      .then((res) => {
        console.log("real user: " + res);
        this.setState(
          {
            getUserStatus: res.status,
            getUserEmail: res.data.email,
            getUserId: res.data.id,
            getUserName: res.data.name,
          },
          () => {
            this.testIfNewAccount();
          }
        );
      });
  }

  testIfNewAccount() {
    if (this.state.newAccountEmail !== this.state.getUserEmail) {
      this.setState({ isNewAccount: true });
    }
  }

  loginCallBack = (childData) => {
    this.setState({ newAccountEmail: childData }, () => this.testApi());
    this.setState({ loggedIn: true });
    this.setState({ timelineState: true });
  };

  newProfileFormCallBack = () => {
    this.setState({ isNewAccount: false }, () => this.testApi());
  };

  changeUsernameCallBack = () => {
    this.setState({ changeUsernameState: false }, () => this.testApi());
  };

  hideButtonCallBack = () => {
    this.setState({ showFriendsState: false });
  };

  barListCallBack = () => {
    this.setState({ barListState: false });
  };

  timelineCallBack = () => {
    this.setState({ timelineState: false });
  };

  showFriends = () => {
    if (this.state.showFriendsState === false) {
      this.setState({ showFriendsState: true });
    } else {
      this.setState({ showFriendsState: false });
    }
  };

  changeUsername = () => {
    this.setState({ changeUsernameState: true });
  };

  showBarList = () => {
    if (this.state.barListState === false) {
      this.setState({
        barListState: true,
        timelineState: false,
        beerListState: false,
      });
    } else {
      this.setState({ barListState: false });
    }
  };

  showTimeline = () => {
    if (this.state.timelineState === false) {
      this.setState({
        timelineState: true,
        barListState: false,
        beerListState: false,
      });
    } else {
      this.setState({ timelineState: false });
    }
  };

  showBeerList = () => {
    if (this.state.beerListState === false) {
      this.setState({
        beerListState: true,
        timelineState: false,
        barListState: false,
      });
    } else {
      this.setState({ beerListState: false });
    }
  };

  hideBeerList = () => {
    this.setState({ beerListState: false });
  };

  render() {
    return (
      <div className="flexContainer">
        <Navbar className="navBar" expand="lg">
          <h2 className="navBarTitle" href="#home">
            Boozebuddies
          </h2>
          {this.state.loggedIn && (
            <div>
              <Nav.Link href="#timeline" onClick={() => this.showTimeline()}>
                Timeline
              </Nav.Link>
              <Nav.Link href="#bars" onClick={() => this.showBarList()}>
                Bars
              </Nav.Link>
              <Nav.Link href="#beers" onClick={() => this.showBeerList()}>
                Beers
              </Nav.Link>
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
              {this.state.loggedIn && (
                <Nav.Link href="#profile">{this.state.getUserName}</Nav.Link>
              )}
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

        {this.state.barListState && (
          <div className="barList">
            <BarList
              callBack={this.barListCallBack}
              userId={this.state.getUserId}
            />
          </div>
        )}

        <div className="friendList">
          {this.state.showFriendsState && (
            <FriendList
              userId={this.state.getUserId}
              userName={this.state.getUserName}
              userEmail={this.state.getUserEmail}
              callBack={this.hideButtonCallBack}
            />
          )}
        </div>

        {this.state.beerListState && (
        <div className="beerList">
          <BeerList
            hideBeerListCallBack={this.hideBeerList}
            barid={this.barId}
            userId={this.state.getUserId}
          />
        </div>
        )}

        {this.state.changeUsernameState && (
          <ChangeUsername
            userId={this.state.getUserId}
            callBack={this.changeUsernameCallBack}
          />
        )}

        {this.state.timelineState && (
          <Timeline
            userId={this.state.getUserId}
            callBack={this.timelineCallBack}
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
