import React, { Component } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";

class NewProfileForm extends Component {
  state = {
    newAccountName: "",
    showModal: false
  };

  nameChangeHandler = event => {
    this.setState({ newAccountName: event.target.value });
  };

  submitHandler = event => {
    const addUserBody = {
      id: 0,
      name: this.state.newAccountName,
      email: this.props.newEmail
    };

    axios
      .post("http://217.101.44.31:8081/api/public/user/addUser", addUserBody)
      .then(res => {
        console.log(res.data);
      });

    this.props.callBack();
    this.setState({ showModal: false});
  };

  handleModalClose = () => {
    this.setState({ showModal: false });
    this.props.callBack();
  };

  render() {
    return (
      <>
        <Modal show={this.state.showModal} onHide={this.handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>New user</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form>
              <p>Enter your new username:</p>
              <input type="text" onChange={this.nameChangeHandler} />
            </form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={() => this.submitHandler()}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default NewProfileForm;
