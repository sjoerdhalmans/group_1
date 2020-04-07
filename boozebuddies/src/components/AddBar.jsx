import React, { Component } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import "./AddBar.css";

class AddBar extends Component {
  state = {
    showModal: true,
    inputError: false,
    newBarName: "",
    newBarAddress: "",
    newBarZip: "",
    newBarTel: "",
  };

  handleModalClose = () => {
    this.setState({ showModal: false });
    this.props.callBack();
  };

  submitHandler = (event) => {
    const addBarBody = {
      adress: this.state.newBarAddress,
      beers: [],
      id: 0,
      latitude: 0,
      longitude: 0,
      name: this.state.newBarName,
      telephoneNumber: this.state.newBarTel,
      zipcode: this.state.newBarZip,
    };

    if (
      this.state.newBarName.length > 0 &&
      this.state.newBarName != null &&
      this.state.newBarAddress.length > 0 &&
      this.state.newBarAddress != null &&
      this.state.newBarZip.length > 0 &&
      this.state.newBarZip != null &&
      this.state.newBarTel.length > 0 &&
      this.state.newBarTel != null
    ) {
      axios
        .post("http://217.101.44.31:8084/api/public/bar/addBar", addBarBody)
        .then((res) => {
          console.log(res);
          this.handleModalClose();
        });
    } else {
      this.setState({ inputError: true });
    }
  };

  nameChangeHandler = (event) => {
    this.setState({ newBarName: event.target.value });
  };

  addressChangeHandler = (event) => {
    this.setState({ newBarAddress: event.target.value });
  };

  zipChangeHandler = (event) => {
    this.setState({ newBarZip: event.target.value });
  };

  telChangeHandler = (event) => {
    this.setState({ newBarTel: event.target.value });
  };

  render() {
    return (
      <>
        <Modal
          className="modal-overlay"
          show={this.state.showModal}
          onHide={this.handleModalClose}
        >
          <Modal.Header className="addBarModalHeader" closeButton>
            <Modal.Title>Add new bar</Modal.Title>
          </Modal.Header>

          <Modal.Body className="addBarModalBody">
            <Form className="addBarForm">
              <Form.Group onChange={this.nameChangeHandler}>
                <Form.Label>Name</Form.Label>
                <Form.Control className="addBarNameTextArea" />
              </Form.Group>

              <Form.Group onChange={this.addressChangeHandler}>
                <Form.Label>Address</Form.Label>
                <Form.Control className="addBarAddressTextArea" />
              </Form.Group>

              <Form.Group onChange={this.zipChangeHandler}>
                <Form.Label>Zipcode</Form.Label>
                <Form.Control className="addBarZipTextArea" />
              </Form.Group>

              <Form.Group onChange={this.telChangeHandler}>
                <Form.Label>Telephone number</Form.Label>
                <Form.Control className="addBarTelTextArea" />
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer className="addBarModalFooter">
            {this.state.inputError && (
              <div className="addBarInputError">Some fields are empty</div>
            )}
            <Button
              className="addBarOkButton"
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

export default AddBar;
