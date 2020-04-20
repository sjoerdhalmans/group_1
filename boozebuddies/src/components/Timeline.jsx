import React, { Component } from "react";
import axios from "axios";
import { Button, ListGroup } from "react-bootstrap";
import "./styles/Timeline.css";

class Timeline extends Component {
  state = {
    activitiesUpdated: false,
    activities: [],
    sortedActivities: [],
    friendIds: [],
    toggleButtonText: "Friends",
    showEveryone: true,
  };

  componentDidMount() {
    this.getAllActivities();
  }

  async getAllActivities() {
    await axios
      .get("http://217.101.44.31:8085/api/public/activity/getAllActivities")
      .then((res) => {
        console.log("getAllActivities:");
        console.log(res);
        console.log(res.data);
        if (res.data.activities !== null) {
          res.data.activities.forEach((item) => {
            this.state.activities.push(item);
          });
          this.state.activities.reverse();

          this.setState({ activitiesUpdated: true });
        } else {
          this.getAllActivities();
        }
      });
  }

  async getFriendIds() {
    await axios
      .get(
        "http://217.101.44.31:8082/api/public/friend/getFriendsByUserId/" +
          this.props.userId
      )
      .then((res) => {
        console.log("getFriendsByUserId:");
        console.log(res);
        console.log(res.data);
        console.log(res.data.relationships);
        res.data.relationships.forEach((item) => {
          if (item.status === "accepted") {
            if (item.userOneId.id === this.props.userId) {
              this.state.friendIds.push(item.userTwoId.id);
            } else {
              this.state.friendIds.push(item.userOneId.id);
            }
          }
        });
        this.getFriendActivities();
      });
  }

  async getFriendActivities() {
    await axios
      .get("http://217.101.44.31:8085/api/public/activity/getAllActivities")
      .then((res) => {
        res.data.activities.forEach((item) => {
          this.state.friendIds.forEach((friendItem) => {
            if (item.user.id === friendItem) {
              this.state.activities.push(item);
            }
          });
        });
        this.state.activities.reverse();
        this.setState({ activitiesUpdated: true });
      });
  }

  toggleButtonHandler = () => {
    if (this.state.showEveryone === true) {
      this.setState({
        showEveryone: false,
        toggleButtonText: "Everyone",
        activitiesUpdated: false,
        activities: [],
        friendIds: [],
      });
      this.getFriendIds();
    } else {
      this.setState({
        showEveryone: true,
        toggleButtonText: "Friends",
        activitiesUpdated: false,
        activities: [],
      });
      this.getAllActivities();
    }
  };

  hideButtonHandler = () => {
    this.props.callBack();
  };

  render() {
    return (
      <div className="timeline">
        <h4 className="timelineHeader">Timeline</h4>
        <Button
          className="timelineToggleButton"
          onClick={() => this.toggleButtonHandler()}
        >
          {this.state.toggleButtonText}
        </Button>
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
