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
    beers: [],
    addedBeerBrand: "",
    addedBeerName: "",
    addedBeerPrice: 0,
    lastAddedBeerPrice: 0,
    beerAdded: false,
    selectedBeerId: 0,
    selectedBeerIndex: 0,
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
          this.state.beers.push(item);
        });
        this.setState({ beerListUpdated: true, showModal: true });
      });
  }

  async addBeerToBar() {
    const addBeerToBarBody = {
      barId: this.props.addBeerBarId,
      beerId: this.state.selectedBeerId,
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
      addedBeerBrand: this.state.beers[this.state.selectedBeerIndex].brand,
      addedBeerName: this.state.beers[this.state.selectedBeerIndex].name,
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

  onClickHandler = (beerIdParam, beerIndex) => {
    this.setState({
      selectedBeerId: beerIdParam,
      selectedBeerIndex: beerIndex,
    });
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

          <Modal.Body className="addBeerToBarModalBody1">
            <span className="addBeerToBarTextSpan">
              <Form.Group onChange={this.priceChangeHandler}>
                <Form.Control
                  className="addBeerToBarPriceInput"
                  placeholder="Price"
                />
              </Form.Group>
            </span>
            <span className="addBeerToBarButtonSpan">
              <Button
                className="addBeerToBarButton"
                onClick={() => this.addBeerToBar()}
              >
                Add beer
              </Button>
            </span>
          </Modal.Body>

          <Modal.Body className="addBeerToBarModalBody2">
            <ListGroup className="addBeerToBarList">
              {this.state.beerListUpdated &&
                this.state.beers.map((item, i) => (
                  <ListGroup.Item
                    key={i}
                    className="addBeerToBarListItem"
                    action
                    href={"#beer" + item.id}
                    onClick={() => this.onClickHandler(item.id, i)}
                  >
                    {item.brand} {item.name}, {item.alcoholPercentage} %
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </Modal.Body>
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
