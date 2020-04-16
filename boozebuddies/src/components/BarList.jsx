import React, { Component } from "react";
import { Button, Accordion, Card, ListGroup } from "react-bootstrap";
import "./styles/BarList.css";
import axios from "axios";
import EditBar from "./EditBar";
import AddBeerToBar from "./AddBeerToBar";
import AddBar from "./AddBar";
import StarRatingComponent from "react-star-rating-component";

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
    beers: [],
    barRatings: [],
    barRated: false,
    lastBarRatingId: 0,
  };

  componentDidMount() {
    this.getBars();
  }

  async getBars() {
    await axios
      .get("http://217.101.44.31:8084/api/public/bar/getAllBars")
      .then((res) => {
        console.log(res);

        if (res.data.bars != null) {
          res.data.bars.forEach((item) => {
            this.state.bars.push(item);
          });
          this.setState({ barListUpdated: true });
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
          this.state.beers.push(item);
        });
        this.setState({ beerListUpdated: true });
      });
  }

  async rateBar(barIdParam, ratingParam) {
    const rateBarBody = {
      objectId: barIdParam,
      objectRating: ratingParam,
      userId: this.props.userId,
    };

    await axios
      .post("http://217.101.44.31:8086/api/public/bar/rateBar", rateBarBody)
      .then((res) => {
        console.log(res);
      });
  }

  async editBarRating(barIdParam, ratingParam, ratingIdParam) {
    const editBarRatingBody = {
      barId: barIdParam,
      id: ratingIdParam,
      rating: ratingParam,
      userId: this.props.userId,
    };

    await axios
      .put(
        "http://217.101.44.31:8086/api/public/bar/EditBarRating",
        editBarRatingBody
      )
      .then((res) => {
        console.log(res);
      });
  }

  async testIfBarRated(barIdParam, ratingParam) {
    let barRatingId;
    await axios
      .get(
        "http://217.101.44.31:8086/api/public/bar/getAllUserRatings/" +
          this.props.userId
      )
      .then((res) => {
        console.log(res);
        res.data.barRatings.forEach((item) => {
          if (item.barId === barIdParam) {
            this.setState({ barRated: true });
            barRatingId = item.id;
          }
        });

        if (!this.state.barRated) {
          this.rateBar(barIdParam, ratingParam);
        } else {
          this.editBarRating(barIdParam, ratingParam, barRatingId);
        }
      });
  }

  onStarClick(barIdParam, ratingParam) {
    this.setState({ barRated: false });
    this.testIfBarRated(barIdParam, ratingParam);
  }

  toggleButtonHandler = (barIdParam) => {
    if (
      this.state.toggleState === true &&
      this.state.lastToggleBarId !== barIdParam
    ) {
      this.setState({ beers: [] }, () => {
        this.getBarBeers(barIdParam);
      });
    } else {
      if (this.state.toggleState === false) {
        this.setState({ toggleState: true });
        this.getBarBeers(barIdParam);
      } else {
        this.setState({
          toggleState: false,
          beers: [],
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
      bars: [],
    });
    this.getBars();
  };

  addBeerCallBack = () => {
    this.setState({
      addBeerState: false,
      beers: [],
    });
    this.getBarBeers(this.state.lastToggleBarId);
  };

  addBarCallBack = () => {
    this.setState({
      addBarState: false,
      bars: [],
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
            this.state.bars.map((item, i) => (
              <Card key={i}>
                <Card.Header className="barListHeader">
                  <Accordion.Toggle
                    onClick={() => this.toggleButtonHandler(item.id)}
                    as={Card.Header}
                    eventKey={i}
                    className="barListToggle"
                  >
                    {item.name}
                  </Accordion.Toggle>
                  <StarRatingComponent
                    name={item.id}
                    className="barListRating"
                    starCount={5}
                    onStarClick={this.onStarClick.bind(this, item.id)}
                  />
                </Card.Header>
                <Accordion.Collapse eventKey={i}>
                  <Card.Body className="barListBody">
                    <div className="barListBodyText">
                      Address: {item.adress}
                    </div>
                    <div className="barListBodyText">
                      Tel: {item.telephoneNumber}
                    </div>
                    <div className="barListBodyText">Zip: {item.zipcode}</div>
                    <Button
                      className="barListEditButton"
                      onClick={() => this.showEditBar(item.id)}
                    >
                      Edit bar
                    </Button>
                    <Button
                      className="barListAddBeerButton"
                      onClick={() => this.showAddBeer(item.id)}
                    >
                      Add beers
                    </Button>
                    <div className="barListBeersHeader">Beers:</div>
                    <ListGroup className="barListBeersList">
                      {this.state.beerListUpdated &&
                        this.state.beers.map((item, i) => (
                          <ListGroup.Item
                            key={i}
                            className="barListBeersListItem"
                          >
                            {item.beer.brand} {item.beer.name},{" "}
                            {item.beer.alcoholPercentage} %
                            <span className="barListBeerPrice">
                              {item.price} €
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
