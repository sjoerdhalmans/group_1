import React, { Component } from "react";
import { Button, Accordion, Card, ListGroup } from "react-bootstrap";
import "./BarList.css";
import axios from "axios";
import EditBar from "./EditBar";
import AddBeerToBar from "./AddBeerToBar";
import AddBar from "./AddBar";

class BarList extends Component {
  state = {
    editBarState: false,
    addBarState: false,
    addBeerState: false,
    selectedBarId: 0,
    barListUpdated: false,
    beerListUpdated: false,
    toggleState: false,
    lastToggleBarId: 0,
    bars: [],
    barId: [],
    barName: [],
    barAddress: [],
    barTel: [],
    barZip: [],
    beerId: [],
    beerName: [],
    beerPrice: [],
    beerBrand: [],
    beerAlcPct: [],
  };

  componentDidMount() {
    this.getBars();
  }

  async getBars() {
    await axios
      .get("http://217.101.44.31:8084/api/public/bar/getAllBars")
      .then((res) => {
        console.log(res);

        this.setState({ bars: res.data.bars });

        if (res.data.bars != null) {
          res.data.bars.forEach((item) => {
            this.state.barId.push(item.id);
            this.state.barName.push(item.name);
            this.state.barAddress.push(item.adress);
            this.state.barTel.push(item.telephoneNumber);
            this.state.barZip.push(item.zipcode);

            this.setState({ barListUpdated: true });
          });
        } else {
          this.getBars();
        }
      });
  }

  async getBarBeers(barIdParam) {
    await axios
      .get("http://217.101.44.31:8084/api/public/bar/getById/" + barIdParam)
      .then((res) => {
        res.data.beers.forEach((item) => {
          this.state.beerId.push(item.beer.id);
          this.state.beerName.push(item.beer.name);
          this.state.beerBrand.push(item.beer.brand);
          this.state.beerAlcPct.push(item.beer.alcoholPercentage);
          this.state.beerPrice.push(item.price);

          this.setState({ beerListUpdated: true });
        });
      });
  }

  toggleButtonHandler = (barIdParam) => {
    if (
      this.state.toggleState === true &&
      this.state.lastToggleBarId !== barIdParam
    ) {
      this.setState(
        {
          beerId: [],
          beerName: [],
          beerPrice: [],
          beerBrand: [],
          beerAlcPct: [],
        },
        () => {
          this.getBarBeers(barIdParam);
        }
      );
    } else {
      if (this.state.toggleState === false) {
        this.setState({ toggleState: true });
        this.getBarBeers(barIdParam);
      } else {
        this.setState({
          toggleState: false,
          beerId: [],
          beerName: [],
          beerPrice: [],
          beerBrand: [],
          beerAlcPct: [],
          beerListUpdated: false,
        });
      }
    }

    this.setState({ lastToggleBarId: barIdParam });
  };

  hideButtonHandler = () => {
    this.props.callBack();
  };

  editBarCallBack = () => {
    this.setState({
      editBarState: false,
      barId: [],
      barName: [],
      barAddress: [],
      barTel: [],
      barZip: [],
    });
    this.getBars();
  };

  addBeerCallBack = () => {
    this.setState({
      addBeerState: false,
      beerId: [],
      beerName: [],
      beerPrice: [],
      beerBrand: [],
      beerAlcPct: [],
    });
    this.getBarBeers(this.state.lastToggleBarId);
  };

  addBarCallBack = () => {
    this.setState({
      addBarState: false,
      barId: [],
      barName: [],
      barAddress: [],
      barTel: [],
      barZip: [],
    });
    this.getBars();
  };

  showEditBar = (param) => {
    this.setState({ selectedBarId: param });
    this.setState({ editBarState: true });
  };

  showAddBeer = (param) => {
    this.setState({ selectedBarId: param });
    this.setState({ addBeerState: true });
  };

  showAddBar = () => {
    this.setState({ addBarState: true });
  };

  render() {
    return (
      <div>
        <h4 className="barsHeader">Bars</h4>
        <Button className="addBarButton" onClick={() => this.showAddBar()}>
          Add new bar
        </Button>
        <Button
          className="barsHideButton"
          onClick={() => this.hideButtonHandler()}
        >
          Hide
        </Button>
        <Accordion>
          {this.state.barListUpdated &&
            this.state.barId.map((item, i) => (
              <Card key={i}>
                <Card.Header
                  className="barListHeader"
                  onClick={() => this.toggleButtonHandler(item)}
                >
                  <Accordion.Toggle
                    as={Card.Header}
                    eventKey={i}
                    className="barListToggle"
                  >
                    {this.state.barName[i]}
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={i}>
                  <Card.Body className="barListBody">
                    <div className="barListBodyText">
                      Address: {this.state.barAddress[i]}
                    </div>
                    <div className="barListBodyText">
                      Tel: {this.state.barTel[i]}
                    </div>
                    <div className="barListBodyText">
                      Zip: {this.state.barZip[i]}
                    </div>
                    <Button
                      className="barListEditButton"
                      onClick={() => this.showEditBar(item)}
                    >
                      Edit bar
                    </Button>
                    <Button
                      className="barListAddBeerButton"
                      onClick={() => this.showAddBeer(item)}
                    >
                      Add beers
                    </Button>
                    <div className="barListBeersHeader">Beers:</div>
                    <ListGroup className="barListBeersList">
                      {this.state.beerListUpdated &&
                        this.state.beerId.map((item, i) => (
                          <ListGroup.Item
                            key={i}
                            className="barListBeersListItem"
                          >
                            {this.state.beerBrand[i]} {this.state.beerName[i]},{" "}
                            {this.state.beerAlcPct[i]} %
                            <span className="barListBeerPrice">
                              {this.state.beerPrice[i]} €
                            </span>
                          </ListGroup.Item>
                        ))}
                    </ListGroup>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            ))}
        </Accordion>
        {this.state.editBarState && (
          <EditBar
            editBarId={this.state.selectedBarId}
            callBack={this.editBarCallBack}
          />
        )}

        {this.state.addBeerState && (
          <AddBeerToBar
            addBeerBarId={this.state.selectedBarId}
            callBack={this.addBeerCallBack}
          />
        )}

        {this.state.addBarState && <AddBar callBack={this.addBarCallBack} />}
      </div>
    );
  }
}

export default BarList;
