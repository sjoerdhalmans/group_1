import React, { Component } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import "./EditBar.css";

class EditBar extends Component {
  state = {
    barId: 0,
    barName: "",
    barAddress: "",
    barZipcode: "",
    barTel: "",
    barLng: "",
    barLat: "",
    barBeers: [],
    showModal: true,
    barInfoUpdated: false,
    tempBarName: "",
    tempBarAddress: "",
    tempBarZipcode: "",
    tempBarTel: "",
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
      .then((res) => {
        this.setState({
          barName: res.data.name,
          barAddress: res.data.adress,
          barZipcode: res.data.zipcode,
          barTel: res.data.telephoneNumber,
          barLng: res.data.longitude,
          barLat: res.data.latitude,
          barBeers: res.data.beers,
          tempBarName: res.data.name,
          tempBarAddress: res.data.adress,
          tempBarZipcode: res.data.zipcode,
          tempBarTel: res.data.telephoneNumber,
          barInfoUpdated: true,
        });
      });
  }

  handleModalClose = () => {
    this.setState({ showModal: false });
    this.props.callBack();
  };

  submitHandler = () => {
    const editBarBody = {
      adress: this.state.barAddress,
      beers: this.state.barBeers,
      id: this.state.barId,
      latitude: this.state.barLat,
      longitude: this.state.barLng,
      name: this.state.barName,
      telephoneNumber: this.state.barTel,
      zipcode: this.state.barZipcode,
    };

    axios
      .put("http://217.101.44.31:8084/api/public/bar/editBar", editBarBody)
      .then((res) => {
        console.log(res);

        this.setState({
          tempBarName: this.state.barName,
          tempBarAddress: this.state.barAddress,
          tempBarZipcode: this.state.barZipcode,
          tempBarTel: this.state.barTel,
        });

        this.handleModalClose();
      });
  };

  nameChangeHandler = (event) => {
    let tempString = event.target.value;

    if (tempString.length > 0 && tempString != null) {
      this.setState({ barName: tempString });
    } else {
      this.setState({ barName: this.state.tempBarName });
    }
  };

  addressChangeHandler = (event) => {
    let tempString = event.target.value;

    if (tempString.length > 0 && tempString != null) {
      this.setState({ barAddress: tempString });
    } else {
      this.setState({ barAddress: this.state.tempBarAddress });
    }
  };

  zipChangeHandler = (event) => {
    let tempString = event.target.value;

    if (tempString.length > 0 && tempString != null) {
      this.setState({ barZipcode: tempString });
    } else {
      this.setState({ barZipcode: this.state.tempBarZipcode });
    }
  };

  telChangeHandler = (event) => {
    let tempString = event.target.value;

    if (tempString.length > 0 && tempString != null) {
      this.setState({ barTel: tempString });
    } else {
      this.setState({ barTel: this.state.tempBarTel });
    }
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
            <Modal.Title>Edit bar {this.state.tempBarName}</Modal.Title>
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

                <Form.Group onChange={this.addressChangeHandler}>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    className="addressTextArea"
                    placeholder={this.state.barAddress}
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
