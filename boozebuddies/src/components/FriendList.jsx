import React, { Component } from "react";
import axios from "axios";
import { Button, Form, Row, Col, ListGroup } from "react-bootstrap";
import './FriendList.css';
import AddFriend from './addFriend';

class FriendList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      getFriendsCalled: false,
      friendListUpdated: false,

      userEmail: props.flist,

      friendId: [123],
      friendName: ["testNameForDebug"],
      friendEmail: ["testEmail@debug"],
      addFriendState: false
    };

    //this.state = {  }

    console.log("Friendlist props");
    console.log(props.flist);
    //console.log(typeof(this.state.userEmail));
  }

  //Functions
  async getFriends() {
    await axios
      .get("http://217.101.44.31:8081/api/public/user/getAllUsers")
      .then(res => {
        console.log(res);

        res.data.forEach(item => {
          this.state.friendId.push(item.id);
          this.state.friendName.push(item.name);
          this.state.friendEmail.push(item.email);

          console.log(item.id);
          console.log(item.name);
          console.log(item.email);

          this.setState({ friendListUpdated: true });
        });
      });
  }

  removeFriendHandler = i => {
    console.log(i);
  };

  hideButtonHandler = () => {
    this.props.callBack();
  };

  addFriendCallBack = () => {
    this.setState({ addFriendState: false })
  };

  addFriend = () => {
    this.setState({addFriendState: true});
  };

  //Render
  render() {
    if (this.state.userEmail !== "" && this.state.getFriendsCalled === false) {
      this.setState({ getFriendsCalled: true });

      this.getFriends();
    }

    return (
      <div>
        <h4 className="friendsHeader">Friends</h4>

        <Button className="removeButton" onClick={() => this.hideButtonHandler()}>
          Hide
        </Button>
        <ListGroup as="ul">
          {this.state.friendListUpdated &&
            this.state.friendName.map(item => (
              <ListGroup.Item action as="li" key={item}>{item}
                <Button
                  onClick={() => this.removeFriendHandler(item)}
                  variant="danger"
                  className="removeButton"
                >
                  XX
                </Button>
                </ListGroup.Item>
            ))}
                    <Button variant="success" type="submit" onClick={() => this.addFriend()}>
            Add Friend
          </Button>
        </ListGroup>

        {this.state.addFriendState && (
          <AddFriend
            callBack={this.addFriendCallback}
          />
        )}

      </div>
    );
  }
}

export default FriendList;
