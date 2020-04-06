import React, { Component } from "react";
import axios from "axios";
import { Button, ListGroup, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import "./AddBeerToBar.css";

class AddBeerToBar extends Component {
  state = {
    showModal: false,
    beerListUpdated: false,
    beerId: [],
    beerName: [],
    beerBrand: [],
    beerAlcPct: [],
    addedBeerBrand: "",
    addedBeerName: "",
    addedBeerPrice: 0,
    lastAddedBeerPrice: 0,
    beerAdded: false,
  };

  componentDidMount() {
    this.getAllBeers();
  }

  async getAllBeers() {
    await axios
      .get("http://217.101.44.31:8083/api/public/beer/getAllBeers")
      .then((res) => {
        console.log(res);

        res.data.beers.forEach((item) => {
          this.state.beerId.push(item.id);
          this.state.beerName.push(item.name);
          this.state.beerBrand.push(item.brand);
          this.state.beerAlcPct.push(item.alcoholPercentage);

          this.setState({ beerListUpdated: true, showModal: true });
        });
      });
  }

  async addBeerToBar(beerIdParam, i) {
    const addBeerToBarBody = {
      barId: this.props.addBeerBarId,
      beerId: beerIdParam,
      price: this.state.addedBeerPrice,
    };

    await axios
      .post(
        "http://217.101.44.31:8084/api/public/bar/addBeerToBar",
        addBeerToBarBody
      )
      .then((res) => {
        console.log(res);
      });

    this.setState({
      beerAdded: true,
      addedBeerBrand: this.state.beerBrand[i],
      addedBeerName: this.state.beerName[i],
      lastAddedBeerPrice: this.state.addedBeerPrice,
    });
  }

  priceChangeHandler = (event) => {
    this.setState({ addedBeerPrice: event.target.value });
  };

  handleModalClose = () => {
    this.setState({ showModal: false });
    this.props.callBack();
  };

  render() {
    return (
      <>
        <Modal
          className="addBeerToBarModal"
          show={this.state.showModal}
          onHide={this.handleModalClose}
        >
          <Modal.Header className="addBeerToBarModalHeader" closeButton>
            <Modal.Title>Add beers</Modal.Title>
          </Modal.Header>

          <Modal.Body className="addBeerToBarModalBody"></Modal.Body>
          <ListGroup className="addBeerToBarList">
            {this.state.beerListUpdated &&
              this.state.beerId.map((item, i) => (
                <ListGroup.Item key={i} className="addBeerToBarListItem">
                  {this.state.beerBrand[i]} {this.state.beerName[i]},{" "}
                  {this.state.beerAlcPct[i]} %
                  <span className="addBeerToBarButtonSpan1">
                    <Form.Group onChange={this.priceChangeHandler}>
                      <Form.Control
                        className="addBeerToBarPriceInput"
                        placeholder="Price"
                      />
                    </Form.Group>
                  </span>
                  <span className="addBeerToBarButtonSpan2">
                    <Button
                      className="addBeerToBarButton"
                      onClick={() => this.addBeerToBar(item, i)}
                    >
                      Add
                    </Button>
                  </span>
                </ListGroup.Item>
              ))}
          </ListGroup>
          <Modal.Footer className="addBeerToBarModalFooter">
            {this.state.beerAdded && (
              <div className="addBeerToBarConfirm">
                {this.state.addedBeerBrand} {this.state.addedBeerName} added (
                {this.state.lastAddedBeerPrice} €)
              </div>
            )}
            <Button
              className="addBeerToBarOkButton"
              variant="primary"
              onClick={this.handleModalClose}
            >
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default AddBeerToBar;
