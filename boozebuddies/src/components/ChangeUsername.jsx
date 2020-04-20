import React, { Component } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import "./ChangeUsername.css";

class ChangeUsername extends Component {
  state = {
    showModal: true,
    newUsernameInput: "",
    inputError: false,
    inputErrorText: "",
  };

  async updateUsername() {
    const updateUserBody = {
      id: this.props.userId,
      newUsername: this.state.newUsernameInput,
    };

    await axios
      .put(
        "http://217.101.44.31:8081/api/public/user/UpdateUsername",
        updateUserBody
      )
      .then((res) => {
        console.log(res.data);
        this.handleModalClose();
      });
  }

  async testIfUsernameTaken() {
    let usernameTaken = false;
    await axios
      .get("http://217.101.44.31:8081/api/public/user/getAllUsers")
      .then((res) => {
        console.log("getAllUsers:");
        console.log(res);
        console.log(res.data);
        if (res.data.name !== null) {
          res.data.forEach((item) => {
            if (item.name === this.state.newUsernameInput) {
              usernameTaken = true;
            }
          });

          if (usernameTaken === false) {
            if (
              this.state.newUsernameInput.length > 0 &&
              this.state.newUsernameInput != null
            ) {
              this.updateUsername();
            } else {
              this.setState({ inputErrorText: "Username can't be empty" });
            }
          } else {
            this.setState({ inputErrorText: "Username already taken" });
          }
        } else {
          this.testIfUsernameTaken();
        }
      });
  }

  handleModalClose = () => {
    this.setState({ showModal: false });
    this.props.callBack();
  };

  nameChangeHandler = (event) => {
    this.setState({ newUsernameInput: event.target.value });
  };

  render() {
    return (
      <>
        <Modal
          className="modal-overlay"
          show={this.state.showModal}
          onHide={this.handleModalClose}
        >
          <Modal.Header className="changeUsernameModalHeader" closeButton>
            <Modal.Title>Change username</Modal.Title>
          </Modal.Header>

          <Modal.Body className="changeUsernameModalBody">
            <Form.Group onChange={this.nameChangeHandler}>
              <Form.Label>Enter your new username:</Form.Label>
              <Form.Control
                className="changeUsernameTextArea"
                placeholder="new username"
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer className="changeUsernameModalFooter">
            <div className="changeUsernameInputError">
              {this.state.inputErrorText}
            </div>
            <Button
              className="changeUsernameOkButton"
              variant="primary"
              onClick={() => this.testIfUsernameTaken()}
            >
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default ChangeUsername;
