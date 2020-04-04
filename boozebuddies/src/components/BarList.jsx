import React, { Component } from "react";
import { Button, Accordion, Card } from "react-bootstrap";
import "./BarList.css";
import axios from "axios";
import EditBar from "./EditBar";
import AddBar from "./AddBar";

class BarList extends Component {
  state = {
    editBarState: false,
    addBarState: false,
    selectedBarId: 0,
    barListUpdated: false,
    bars: [],
    barId: [],
    barName: [],
    barAddress: [],
    barTel: [],
    barZip: [],
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

        res.data.bars.forEach((item) => {
          this.state.barId.push(item.id);
          this.state.barName.push(item.name);
          this.state.barAddress.push(item.adress);
          this.state.barTel.push(item.telephoneNumber);
          this.state.barZip.push(item.zipcode);

          this.setState({ barListUpdated: true });
        });
      });
  }

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

  showEditBar = (param) => {
    this.setState({ selectedBarId: param });
    this.setState({ editBarState: true });
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
                    <div className="barListBodyText">
                      Address: {this.state.barAddress[i]}
                    </div>
                    <div className="barListBodyText">
                      Tel: {this.state.barTel[i]}
                    </div>
                    <div className="barListBodyText">
                      Zip: {this.state.barZip[i]}
                    </div>
                    <Button className="barListBeerButton">Beerlist</Button>
                    <Button
                      className="barListEditButton"
                      onClick={() => this.showEditBar(item)}
                    >
                      Edit bar
                    </Button>
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

        {this.state.addBarState && <AddBar callBack={this.addBarCallBack} />}
      </div>
    );
  }
}

export default BarList;
