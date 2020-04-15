import React, { Component } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import "./styles/AddFriend.css";

class AddFriend extends Component {
  state = {
    showModal: true,
    friendName: "",
    inputError: false,
  };

  handleModalClose = () => {
    this.setState({ showModal: false });
    this.props.callBack();
  };

  addFriend() {
    if (this.state.friendName.length > 0 && this.state.friendName != null) {
      axios({
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
    } else {
      this.setState({ inputError: true });
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
            {this.state.inputError && (
              <div className="addFriendInputError">Username can't be empty</div>
            )}
            <Button
              className="addFriendOkButton"
              variant="primary"
              onClick={() => this.addFriend()}
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
