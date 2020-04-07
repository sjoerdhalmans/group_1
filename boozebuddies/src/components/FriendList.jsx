import React, { Component } from "react";
import axios from "axios";
import { Button, ListGroup } from "react-bootstrap";
import "./FriendList.css";
import AddFriend from "./AddFriend";

class FriendList extends Component {
  state = {
    friendListUpdated: false,
    userId: this.props.userId,
    userName: this.props.userName,
    userEmail: this.props.userEmail,
    acceptedFriendsId: [],
    acceptedFriends: [],
    youAdded: [],
    requestedFriendNames: [],
    friendRequestId: [],
    friendRequest: [],
    deleteFriendBody: {},
    addFriendState: false,
  };

  componentDidMount() {
    this.getFriends();
  }

  async getFriends() {
    await axios
      .get(
        "http://217.101.44.31:8082/api/public/friend/getFriendsByUserId/" +
          this.state.userId
      )
      .then((res) => {
        res.data.relationships.forEach((item) => {
          if (item.status === "accepted") {
            if (item.userOneId.id === this.state.userId) {
              this.state.acceptedFriendsId.push(item.id);
              this.state.acceptedFriends.push(item.userTwoId);
              this.state.youAdded.push(true);
            } else {
              this.state.acceptedFriendsId.push(item.id);
              this.state.acceptedFriends.push(item.userOneId);
              this.state.youAdded.push(false);
            }
          } else if (item.status === "pending") {
            if (item.userOneId.id === this.state.userId) {
              this.state.requestedFriendNames.push(item.userTwoId.name);
            } else {
              this.state.friendRequestId.push(item.id);
              this.state.friendRequest.push(item.userOneId);
            }
          }
        });
        this.setState({ friendListUpdated: true });
      });
  }

  deleteFriend(i) {
    if (this.state.youAdded[i] === true) {
      this.setState(
        {
          deleteFriendBody: {
            id: this.state.acceptedFriendsId[i],
            status: "accepted",
            userOneId: {
              email: this.state.userEmail,
              id: this.state.userId,
              name: this.state.userName,
            },
            userTwoId: {
              email: this.state.acceptedFriends[i].email,
              id: this.state.acceptedFriends[i].id,
              name: this.state.acceptedFriends[i].name,
            },
          },
        },
        () => this.deleteFriendCall()
      );
    } else {
      this.setState(
        {
          deleteFriendBody: {
            id: this.state.acceptedFriendsId[i],
            status: "accepted",
            userOneId: {
              email: this.state.acceptedFriends[i].email,
              id: this.state.acceptedFriends[i].id,
              name: this.state.acceptedFriends[i].name,
            },
            userTwoId: {
              email: this.state.userEmail,
              id: this.state.userId,
              name: this.state.userName,
            },
          },
        },
        () => this.deleteFriendCall()
      );
    }
  }

  deleteFriendCall() {
    axios({
      method: "delete",
      url: "http://217.101.44.31:8082/api/public/friend/deleteRelationship",
      headers: {},
      data: this.state.deleteFriendBody,
    }).then((res) => {
      console.log(res);
      this.resetFriendList();
    });
  }

  acceptFriendRequest(i) {
    axios({
      method: "put",
      url:
        "http://217.101.44.31:8082/api/public/friend/updateRelationshipStatus",
      headers: {},
      data: {
        id: this.state.friendRequestId[i],
        status: "accepted",
        userOneId: {
          email: this.state.friendRequest[i].email,
          id: this.state.friendRequest[i].id,
          name: this.state.friendRequest[i].name,
        },
        userTwoId: {
          email: this.state.userEmail,
          id: this.state.userId,
          name: this.state.userName,
        },
      },
    }).then((res) => {
      console.log(res);
      this.resetFriendList();
    });
  }

  resetFriendList = () => {
    this.setState(
      {
        friendListUpdated: false,
        acceptedFriendsId: [],
        acceptedFriends: [],
        youAdded: [],
        requestedFriendNames: [],
        friendRequestId: [],
        friendRequest: [],
      },
      () => {
        this.getFriends();
      }
    );
  };

  hideButtonHandler = () => {
    this.props.callBack();
  };

  addFriendCallBack = () => {
    this.setState({ friendListUpdated: false, addFriendState: false }, () => {
      this.resetFriendList();
    });
  };

  showAddFriend = () => {
    this.setState({ addFriendState: true });
  };

  render() {
    return (
      <div>
        <h4 className="friendsHeader">Friends</h4>

        <Button className="hideButton" onClick={() => this.hideButtonHandler()}>
          Hide
        </Button>
        {this.state.friendListUpdated &&
          this.state.acceptedFriendsId.map((item, i) => (
            <ListGroup key={item}>
              <ListGroup.Item className="friendListItem" key={item}>
                {this.state.acceptedFriends[i].name}
                <Button
                  onClick={() => this.deleteFriend(i)}
                  variant="danger"
                  className="friendListRemoveButton"
                >
                  Delete
                </Button>
              </ListGroup.Item>
            </ListGroup>
          ))}
        <div className="friendRequestsHeader">Friend requests:</div>
        {this.state.friendListUpdated &&
          this.state.friendRequestId.map((item, i) => (
            <ListGroup key={item}>
              <ListGroup.Item className="friendListItem" key={item}>
                {this.state.friendRequest[i].name}
                <Button
                  onClick={() => this.acceptFriendRequest(i)}
                  variant="success"
                  className="friendListAcceptButton"
                >
                  Accept
                </Button>
              </ListGroup.Item>
            </ListGroup>
          ))}
        <div className="sentRequestsHeader">Your sent requests:</div>
        {this.state.friendListUpdated &&
          this.state.requestedFriendNames.map((item) => (
            <ListGroup key={item}>
              <ListGroup.Item className="friendListItem" key={item}>
                {item}
              </ListGroup.Item>
            </ListGroup>
          ))}
        <Button
          className="addFriendButton"
          onClick={() => this.showAddFriend()}
        >
          Add Friend
        </Button>

        {this.state.addFriendState && (
          <AddFriend
            userId={this.state.userId}
            userName={this.state.userName}
            userEmail={this.state.userEmail}
            callBack={this.addFriendCallBack}
          />
        )}
      </div>
    );
  }
}

export default FriendList;
