import React, { Component } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import "./NewProfileForm.css";

class NewProfileForm extends Component {
  state = {
    newAccountName: "",
    showModal: true,
    inputErrorText: "",
  };

  async addUser() {
    const addUserBody = {
      id: 0,
      name: this.state.newAccountName,
      email: this.props.newEmail,
    };

    await axios
      .post("http://217.101.44.31:8081/api/public/user/addUser", addUserBody)
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
        console.log(res);
        if (res.data.name !== null) {
          res.data.forEach((item) => {
            if (item.name === this.state.newAccountName) {
              usernameTaken = true;
            }
          });

          if (usernameTaken === false) {
            if (
              this.state.newAccountName.length > 0 &&
              this.state.newAccountName != null
            ) {
              this.addUser();
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

  nameChangeHandler = (event) => {
    this.setState({ newAccountName: event.target.value });
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
            <div className="newProfileFormInputError">
              {this.state.inputErrorText}
            </div>
            <Button
              className="newProfileFormOkButton"
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

export default NewProfileForm;
