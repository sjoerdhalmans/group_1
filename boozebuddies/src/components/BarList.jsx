import React, { Component } from "react";
import { Button, Accordion, Card, ListGroup } from "react-bootstrap";
import "./BarList.css";
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
    selectedBarRating: 0,
    barListUpdated: false,
    beerListUpdated: false,
    ratingsUpdated: false,
    toggleState: false,
    lastToggleBarId: 0,
    bars: [],
    beers: [],
    barRatingsObjects: [],
    barRatings: [],
    checkedIn: [],
    checkInButtonClassName: [],
  };

  componentDidMount() {
    this.getBars();
  }

  async getBars() {
    await axios
      .get("http://217.101.44.31:8084/api/public/bar/getAllBars")
      .then((res) => {
        console.log("getAllBars:");
        console.log(res);
        console.log(res.data);
        if (res.data.bars !== null) {
          res.data.bars.forEach((item) => {
            this.state.bars.push(item);
          });
          this.setupCheckInButtons();
          this.getAllRatings();
        } else {
          this.getBars();
        }
      });
  }

  setupCheckInButtons() {
    this.state.bars.forEach(() => {
      this.state.barRatings.push(0);
      this.state.checkedIn.push("Check-in");
      this.state.checkInButtonClassName.push("barListCheckInButton");
    });
  }

  async getAllRatings() {
    await axios
      .get(
        "http://217.101.44.31:8086/api/public/bar/getAllUserRatings/" +
          this.props.userId
      )
      .then((res) => {
        res.data.barRatings.forEach((item) => {
          this.state.barRatingsObjects.push(item);
        });
        this.sortRatings();
      });
  }

  sortRatings() {
    this.state.bars.forEach((barItem, index) => {
      this.state.barRatingsObjects.forEach((ratingItem) => {
        if (barItem.id === ratingItem.barId) {
          let a = this.state.barRatings;
          a[index] = ratingItem.rating;
          this.setState({ barRatings: a });
        }
      });
    });
    this.setState({ barListUpdated: true });
  }

  async getBarAverageRating(barIdParam) {
    await axios
      .get(
        "http://217.101.44.31:8086/api/public/bar/getBarAverage/" + barIdParam
      )
      .then((res) => {
        if (res.data.numberOfRatings !== 0) {
          let r = +res.data.average.toFixed(2);
          this.setState({ selectedBarRating: r });
        } else {
          this.setState({ selectedBarRating: 0 });
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
        this.getAllRatings();
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
        this.getAllRatings();
      });
  }

  testIfBarRated(barIdParam, ratingParam) {
    let barRated = false;
    let barRatingId = 0;

    this.state.barRatingsObjects.forEach((item) => {
      if (item.barId === barIdParam) {
        barRated = true;
        barRatingId = item.id;
      }
    });

    if (barRated) {
      this.editBarRating(barIdParam, ratingParam, barRatingId);
    } else {
      this.rateBar(barIdParam, ratingParam);
    }
  }

  async checkIntoBar(barIdParam) {
    const checkIntoBarBody = {
      bar_id: barIdParam,
      user_id: this.props.userId,
    };

    await axios
      .post(
        "http://217.101.44.31:8085/api/public/activity/postActivity",
        checkIntoBarBody
      )
      .then((res) => {
        console.log(res);
      });
  }

  checkInButtonHandler = (barIdParam, index) => {
    if (this.state.checkedIn[index] === "Check-in") {
      this.checkIntoBar(barIdParam);
    }

    this.state.checkedIn.fill("Check-in");
    this.state.checkInButtonClassName.fill("barListCheckInButton");
    this.state.checkedIn[index] = "Checked-in";
    this.state.checkInButtonClassName[index] = "barListCheckedInButton";
    this.forceUpdate();
  };

  toggleButtonHandler = (barIdParam) => {
    if (
      this.state.toggleState === true &&
      this.state.lastToggleBarId !== barIdParam
    ) {
      this.setState(
        {
          beers: [],
          selectedBarRating: null,
        },
        () => {
          this.getBarBeers(barIdParam);
          this.getBarAverageRating(barIdParam);
        }
      );
    } else {
      if (this.state.toggleState === false) {
        this.setState({ toggleState: true, selectedBarRating: null });
        this.getBarBeers(barIdParam);
        this.getBarAverageRating(barIdParam);
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

  onStarClick(barIdParam, index, ratingParam) {
    let a = this.state.barRatings;
    a[index] = ratingParam;
    this.setState({ barRatings: a });

    this.testIfBarRated(barIdParam, ratingParam);
  }

  editBarCallBack = () => {
    this.setState({
      editBarState: false,
      bars: [],
      barRatings: [],
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
      barRatings: [],
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
                    name={item.name}
                    className="barListRating"
                    starCount={5}
                    value={this.state.barRatings[i]}
                    onStarClick={this.onStarClick.bind(this, item.id, i)}
                  />
                  <Button
                    className={this.state.checkInButtonClassName[i]}
                    onClick={() => this.checkInButtonHandler(item.id, i)}
                    style={{ backgroundColor: this.state.bgColor }}
                  >
                    {this.state.checkedIn[i]}
                  </Button>
                </Card.Header>
                <Accordion.Collapse eventKey={i}>
                  <Card.Body className="barListBody">
                    <div className="barListBodyText">
                      Average Star-rating: {this.state.selectedBarRating}
                    </div>
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
