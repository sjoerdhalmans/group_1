import React, { Component } from "react";
import axios from "axios";
import { Button, Form, Row, Col } from "react-bootstrap";

class FriendList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      getFriendsCalled: false,
      friendListUpdated: false,

      userEmail: props.flist,

      friendId: [123],
      friendName: ["testNameForDebug"],
      friendEmail: ["testEmail@debug"]
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

  //Render
  render() {
    if (this.state.userEmail !== "" && this.state.getFriendsCalled === false) {
      this.setState({ getFriendsCalled: true });

      this.getFriends();
    }

    return (
      <>
        <p> {this.state.userEmail} </p>
        <ul>
          {this.state.friendListUpdated &&
            this.state.friendName.map(item => (
              <li key={item}>
                {item}
                <Button
                  onClick={() => this.removeFriendHandler(item)}
                  variant="danger"
                >
                  Remove friend
                </Button>
              </li>
            ))}
        </ul>
        <Form>
          <Form.Label>Add friends</Form.Label>
          <Form.Control type="email" placeholder="friends username" />
          <Button variant="success" type="submit">
            Add
          </Button>
        </Form>

        <Button onClick={() => this.hideButtonHandler()}>
          Hide friendlist
        </Button>
      </>
    );
  }
}

export default FriendList;
