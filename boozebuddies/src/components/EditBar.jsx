import React, { Component } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import "./EditBar.css";

class EditBar extends Component {
  state = {
    barId: 0,
    barName: 0,
    barAdress: 0,
    barZipcode: 0,
    barTel: 0,
    barLng: 0,
    barLat: 0,
    barBeers: [],
    showModal: true,
    barInfoUpdated: false
  };

  componentDidMount() {
    this.setState({ barId: this.props.editBarId });
    this.getBarInfo();
  }

  async getBarInfo() {
    await axios
      .get(
        "http://217.101.44.31:8084/api/public/bar/getById/" +
          this.props.editBarId
      )
      .then(res => {
        this.setState({ barName: res.data.name });
        this.setState({ barAdress: res.data.adress });
        this.setState({ barZipcode: res.data.zipcode });
        this.setState({ barTel: res.data.telephoneNumber });
        this.setState({ barLng: res.data.longitude });
        this.setState({ barLat: res.data.latitude });
        this.setState({ barBeers: res.data.beers });

        this.setState({ barInfoUpdated: true });
      });
  }

  handleModalClose = () => {
    this.setState({ showModal: false });
    this.props.callBack();
  };

  submitHandler = event => {
    const editBarBody = {
      adress: this.state.barAdress,
      beers: this.state.barBeers,
      id: this.state.barId,
      latitude: this.state.barLat,
      longitude: this.state.barLng,
      name: this.state.barName,
      telephoneNumber: this.state.barTel,
      zipcode: this.state.barZipcode
    };

    axios
      .put("http://217.101.44.31:8084/api/public/bar/editBar", editBarBody)
      .then(res => {
        console.log(this.state.barBeers);
        console.log(res);
        this.handleModalClose();
      });
  };

  nameChangeHandler = event => {
    this.setState({ barName: event.target.value });
  };

  adressChangeHandler = event => {
    this.setState({ barAdress: event.target.value });
  };

  zipChangeHandler = event => {
    this.setState({ barZipcode: event.target.value });
  };

  telChangeHandler = event => {
    this.setState({ barTel: event.target.value });
  };

  lngChangeHandler = event => {
    this.setState({ barLng: event.target.value });
  };

  latChangeHandler = event => {
    this.setState({ barLat: event.target.value });
  };

  render() {
    return (
      <>
        <Modal
          className="modal-overlay"
          show={this.state.showModal}
          onHide={this.handleModalClose}
        >
          <Modal.Header className="editBarModalHeader" closeButton>
            <Modal.Title>Edit bar {this.state.barName}</Modal.Title>
          </Modal.Header>

          <Modal.Body className="editBarModalBody">
            {this.state.barInfoUpdated && (
              <Form className="editBarForm">
                <Form.Group onChange={this.nameChangeHandler}>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    className="nameTextArea"
                    placeholder={this.state.barName}
                  />
                </Form.Group>

                <Form.Group onChange={this.adressChangeHandler}>
                  <Form.Label>Adress</Form.Label>
                  <Form.Control
                    className="adressTextArea"
                    placeholder={this.state.barAdress}
                  />
                </Form.Group>

                <Form.Group onChange={this.zipChangeHandler}>
                  <Form.Label>Zipcode</Form.Label>
                  <Form.Control
                    className="zipTextArea"
                    placeholder={this.state.barZipcode}
                  />
                </Form.Group>

                <Form.Group onChange={this.telChangeHandler}>
                  <Form.Label>Telephone number</Form.Label>
                  <Form.Control
                    className="telTextArea"
                    placeholder={this.state.barTel}
                  />
                </Form.Group>

                <Form.Group onChange={this.lngChangeHandler}>
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control
                    className="lngTextArea"
                    placeholder={this.state.barLng}
                  />
                </Form.Group>

                <Form.Group onChange={this.latChangeHandler}>
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control
                    className="latTextArea"
                    placeholder={this.state.barLat}
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>

          <Modal.Footer className="editBarModalFooter">
            <Button
              className="editBarOkButton"
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

export default EditBar;
