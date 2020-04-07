import React, { Component } from "react";
import axios from "axios";
import { Button, ListGroup } from "react-bootstrap";
import "./FriendList.css";
import AddFriend from "./AddFriend";

class FriendList extends Component {
  constructor(props) {
    super(props);

    

    this.state = {
      getFriendsCalled: false,
      friendListUpdated: false,

      userEmail: props.flist,

      relationshipId: [0],
      friendId: [0],
      friendName: [],
      friendEmail: [],
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
      .get("http://217.101.44.31:8082/api/public/friend/getFriendsByUserId/59")
      .then(res => {
        console.log(res);

        res.data.relationships.forEach(item => {
          this.state.relationshipId.push(item.id)
          this.state.friendId.push(item.userTwoId.id);
          this.state.friendName.push(item.userTwoId.name);
          this.state.friendEmail.push(item.userTwoId.email);

          console.log(item.id);
          console.log(item.userTwoId.id);
          console.log(item.userTwoId.name);
          console.log(item.userTwoId.email);

          this.setState({ friendListUpdated: true });
        });
      });
  }

  removeFriendHandler = i => {
    console.log(i);
    let deleteRelationshipBody = {
      id: this.state.relationshipId,
      status: "pending",
      userOneId: {
        email: this.props.userEmail,
        id: this.props.userId,
        name: this.props.userName
      },
      userTwoId: {
        email: this.state.friendEmail,
        id: this.state.friendId,
        name: this.state.friendName
      }
    };

    axios
      .delete("http://217.101.44.31:8082/api/public/friend/deleteRelationship", deleteRelationshipBody)
      .then(res => {
        console.log(res.data);
        console.log(deleteRelationshipBody);
      });
  };

  acceptFriendHandler = i => {
    console.log(i);
    let updateRelationshipStatusBody = {
      id: this.state.relationshipId,
      status: "accepted",
      userOneId: {
        email: this.props.userEmail,
        id: this.props.userId,
        name: this.props.userName
      },
      userTwoId: {
        email: this.state.friendEmail,
        id: this.state.friendId,
        name: this.state.friendName
      }
    };

    axios
      .put("http://217.101.44.31:8082/api/public/friend/updateRelationshipStatus", updateRelationshipStatusBody)
      .then(res => {
        console.log(res.data);
        console.log(updateRelationshipStatusBody);
      });
  };

  hideButtonHandler = () => {
    this.props.callBack();
  };

  addFriendCallBack = () => {
    this.setState({ addFriendState: false });
  };

  addFriend = () => {
    this.setState({ addFriendState: true });
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

        <Button className="hideButton" onClick={() => this.hideButtonHandler()}>
          Hide
        </Button>
        <ListGroup as="ul">
          {this.state.friendListUpdated &&
            this.state.friendName.map(item => (
              <ListGroup.Item
                className="friendListBG"
                action
                as="li"
                key={item}>
                {item}
                <Button
                  onClick={() => this.acceptFriendHandler(item)}
                  variant="success"
                  className="acceptButton">V</Button>
                <Button
                  onClick={() => this.removeFriendHandler(item)}
                  variant="danger"
                  className="removeButton">X</Button>
              </ListGroup.Item>
            ))}
          <Button
            className="addFriendButton"
            type="submit"
            onClick={() => this.addFriend()}
          >
            Add Friend
          </Button>
        </ListGroup>

        {this.state.addFriendState && (
          <AddFriend callBack={this.addFriendCallBack} />
        )}
      </div>
    );
  }
}

export default FriendList;
