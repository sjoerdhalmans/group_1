import React, { Component } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import "./styles/NewProfileForm.css";

class NewProfileForm extends Component {
  state = {
    newAccountName: "",
    showModal: true,
    inputError: false,
  };

  nameChangeHandler = (event) => {
    this.setState({ newAccountName: event.target.value });
  };

  submitHandler = (event) => {
    const addUserBody = {
      id: 0,
      name: this.state.newAccountName,
      email: this.props.newEmail,
    };

    if (
      this.state.newAccountName.length > 0 &&
      this.state.newAccountName != null
    ) {
      axios
        .post("http://217.101.44.31:8081/api/public/user/addUser", addUserBody)
        .then((res) => {
          console.log(res.data);
          this.handleModalClose();
        });
    } else {
      this.setState({ inputError: true });
    }
  };

  handleModalClose = () => {
    this.setState({ showModal: false });
    this.props.callBack();
  };

  render() {
    return (
      <>
        <Modal show={this.state.showModal} onHide={this.handleModalClose}>
          <Modal.Header className="newProfileFormModalHeader" closeButton>
            <Modal.Title>New user</Modal.Title>
          </Modal.Header>

          <Modal.Body className="newProfileFormModalBody">
            <Form.Group onChange={this.nameChangeHandler}>
              <Form.Label>Enter your new username:</Form.Label>
              <Form.Control
                className="newProfileFormTextArea"
                placeholder="new username"
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer className="newProfileFormModalFooter">
            {this.state.inputError && (
              <div className="newProfileFormInputError">
                Username can't be empty
              </div>
            )}
            <Button
              className="newProfileFormOkButton"
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

export default NewProfileForm;
