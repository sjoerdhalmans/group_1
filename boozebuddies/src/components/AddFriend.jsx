import React, { Component } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import "./AddFriend.css";

class AddFriend extends Component {
  state = {
    showModal: true,
    friendName: "",
    inputErrorText: "",
  };

  handleModalClose = () => {
    this.setState({ showModal: false });
    this.props.callBack();
  };

  async addFriend() {
    await axios({
      method: "post",
      url: "http://217.101.44.31:8082/api/public/friend/addRelationship",
      headers: {},
      data: {
        friendUsername: this.state.friendName,
        you: {
          email: this.props.userEmail,
          id: this.props.userId,
          name: this.props.userName,
        },
      },
    }).then((res) => {
      console.log(res);
      this.handleModalClose();
    });
  }

  testIfUserExists() {
    let userNameExists = false;
    axios
      .get("http://217.101.44.31:8081/api/public/user/getAllUsers")
      .then((res) => {
        if (res.data.name !== null) {
          res.data.forEach((item) => {
            if (item.name === this.state.friendName) {
              userNameExists = true;
            }
          });

          if (userNameExists === true) {
            this.addFriend();
          } else {
            this.setState({ inputErrorText: "User doesn't exist" });
          }
        } else {
          this.testIfUserExists();
        }
      });
  }

  testInput() {
    if (this.state.friendName !== this.props.userName) {
      if (this.state.friendName.length > 0 && this.state.friendName != null) {
        this.testIfUserExists();
      } else {
        this.setState({ inputErrorText: "Username can't be empty" });
      }
    } else {
      this.setState({
        inputErrorText: this.state.friendName + " will never be your friend",
      });
    }
  }

  friendNameChangeHandler = (event) => {
    this.setState({ friendName: event.target.value });
  };

  render() {
    return (
      <div>
        <Modal show={this.state.showModal} onHide={this.handleModalClose}>
          <Modal.Header className="addFriendModalHeader" closeButton>
            <Modal.Title>Add a friend</Modal.Title>
          </Modal.Header>

          <Modal.Body className="addFriendModalBody">
            <Form.Label>Enter friends username:</Form.Label>
            <Form.Group
              onChange={this.friendNameChangeHandler}
              placeholder="Username"
            >
              <Form.Control className="addFriendTextArea" />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer className="addFriendModalFooter">
            <div className="addFriendInputError">
              {this.state.inputErrorText}
            </div>
            <Button
              className="addFriendOkButton"
              variant="primary"
              onClick={() => this.testInput()}
            >
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default AddFriend;
