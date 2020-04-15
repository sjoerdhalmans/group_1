import React, { Component } from "react";
import axios from "axios";
import { Button, ListGroup } from "react-bootstrap";
import "./styles/Timeline.css";

class Timeline extends Component {
  state = {
    activitiesUpdated: false,
    activities: [],
  };

  async getActivities() {
    await axios
      .get("http://217.101.44.31:8085/api/public/activity/getAllActivities")
      .then((res) => {
        console.log(res);

        res.data.activities.forEach((item) => {
          this.state.activities.push(item);
        });
        this.state.activities.reverse();

        this.setState({ activitiesUpdated: true });
      });
  }

  componentDidMount() {
    this.getActivities();
  }

  hideButtonHandler = () => {
    this.props.callBack();
  };

  render() {
    return (
      <div className="timeline">
        <h4 className="timelineHeader">Timeline</h4>
        <Button
          className="timelineHideButton"
          onClick={() => this.hideButtonHandler()}
        >
          Hide
        </Button>
        <ListGroup>
          {this.state.activitiesUpdated &&
            this.state.activities.map((item, i) => (
              <ListGroup.Item key={i} className="timelineListItem">
                <div className="activityHeader">
                  {this.state.activities[i].user.name}
                  <span className="activitySpan">
                    {this.state.activities[i].timeEnteredBar.substring(11, 16)}
                  </span>
                </div>
                Checked into {this.state.activities[i].bar.name}
                <span className="activitySpan">
                  {this.state.activities[i].timeEnteredBar.substring(0, 10)}
                </span>
              </ListGroup.Item>
            ))}
        </ListGroup>
      </div>
    );
  }
}

export default Timeline;
