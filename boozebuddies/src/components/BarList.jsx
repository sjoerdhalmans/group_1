import React, { Component } from "react";
import { Button, Accordion, Card } from "react-bootstrap";
import "./BarList.css";
import axios from "axios";

class BarList extends Component {
  constructor(props) {
    super(props);
    this.getFriends();
  }

  state = {
    barListUpdated: false,
    bars: [],
    barId: [],
    barName: [],
    barAdress: []
  };

  async getFriends() {
    await axios
      .get("http://217.101.44.31:8084/api/public/bar/getAllBars")
      .then(res => {
        console.log(res);

        this.setState({ bars: res.data.bars });

        res.data.bars.forEach(item => {
          this.state.barId.push(item.id);
          this.state.barName.push(item.name);
          this.state.barAdress.push(item.adress);

          this.setState({ barListUpdated: true });
        });
      });
  }

  hideButtonHandler = () => {
    this.props.callBack();
  };

  render() {
    return (
      <div>
        <h4 className="barsHeader">Bars</h4>
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
                <Card.Header className="barListHeader">
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
                    {this.state.barAdress[i]}
                    <Button className="barListBeerButton">Beer list</Button>
                    <Button className="barListEditButton">Edit bar</Button>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            ))}
        </Accordion>
      </div>
    );
  }
}

export default BarList;
