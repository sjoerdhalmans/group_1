import React, { Component } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import "./ChangeUsername.css";

class ChangeUsername extends Component {
  state = {
    showModal: true,
    newUsernameInput: ""
  };

  handleModalClose = () => {
    this.setState({ showModal: false });
    this.props.callBack();
  };

  nameChangeHandler = event => {
    this.setState({ newUsernameInput: event.target.value });
  };

  submitHandler = event => {
    const updateUserBody = {
      id: this.props.userId,
      newUsername: this.state.newUsernameInput
    };

    axios
      .put(
        "http://217.101.44.31:8081/api/public/user/UpdateUsername",
        updateUserBody
      )
      .then(res => {
        console.log(res.data);
        this.handleModalClose();
      });
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
            <Button
              className="changeUsernameOkButton"
              variant="primary"
              onClick={() => this.submitHandler()}
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
