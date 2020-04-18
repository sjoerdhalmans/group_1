import React, { Component } from "react";
import { Button, Accordion, Card, ListGroup } from "react-bootstrap";
import "./styles/BarList.css";
import axios from "axios";
import EditBar from "./EditBar";
import AddBeerToBar from "./AddBeerToBar";
import AddBar from "./AddBar";
import StarRatingComponent from "react-star-rating-component";

/*TODO:
+check-in buttons
-make bar ratings undertandable
-better timeline
-fix api bugs
-bar/beer search and sorting
*/

class BarList extends Component {
  state = {
    editBarState: false,
    addBarState: false,
    addBeerState: false,
    selectedBarId: 0,
    barListUpdated: false,
    beerListUpdated: false,
    ratingsUpdated: false,
    toggleState: false,
    lastToggleBarId: 0,
    bars: [],
    beers: [],
    barRatings: [],
    barRated: false,
    lastBarRatingId: 0,
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
        console.log(res);
        if (res.data.bars != null) {
          res.data.bars.forEach((item) => {
            this.state.bars.push(item);
          });
          this.setState({ barListUpdated: true }, () =>
            this.getBarRatingsLoop()
          );
        } else {
          this.getBars();
        }
      });
  }

  getBarRatingsLoop() {
    this.state.bars.forEach((item, i) => {
      this.state.barRatings.push(0);
      this.state.checkedIn.push("Check-in");
      this.state.checkInButtonClassName.push("barListCheckInButton");
      this.getBarRatings(item.id, i);
    });
  }

  async getBarRatings(barIdParam, index) {
    await axios
      .get(
        "http://217.101.44.31:8086/api/public/bar/getBarAverage/" + barIdParam
      )
      .then((res) => {
        let a = this.state.barRatings;
        a[index] = Math.round(res.data.average);
        this.setState({ barRatings: a });

        if (index === this.state.bars.length - 1) {
          this.setState({ ratingsUpdated: true });
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

  onStarClick(barIdParam, index, ratingParam) {
    this.state.barRatings[index] = ratingParam;
    this.setState({ barRated: false });
    this.testIfBarRated(barIdParam, ratingParam);
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
                  {this.state.ratingsUpdated && (
                    <>
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
                    </>
                  )}
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
