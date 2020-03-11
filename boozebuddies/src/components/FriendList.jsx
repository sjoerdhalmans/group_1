import React, { Component } from "react";
import axios from "axios";

class FriendList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      getFriendsCalled: false,
      friendListUpdated: false,

      userEmail: props.flist,

      friendId: [123],
      friendName: ["testNameForDebug"],
      friendEmail: ["testEmail@debug"]
    };

    //this.state = {  }

    console.log("Friendlist props");
    console.log(props.flist);
    //console.log(typeof(this.state.userEmail));
  }

  //Functions
  async getFriends() {
    await axios
      .get("http://217.101.44.31:8081/api/public/user/getAllUsers")
      .then(res => {
        console.log(res);

        res.data.forEach(item => {
          this.state.friendId.push(item.id);
          this.state.friendName.push(item.name);
          this.state.friendEmail.push(item.email);

          console.log(item.id);
          console.log(item.name);
          console.log(item.email);

          this.setState({ friendListUpdated: true });
        });
      });
  }

  //Render
  render() {
    if (this.state.userEmail != "" && this.state.getFriendsCalled == false) {
      this.setState({ getFriendsCalled: true });

      this.getFriends();
    }

    return (
      <div>
        <p> {this.state.userEmail} </p>
        <ul>
          {this.state.friendListUpdated &&
            this.state.friendName.map(item => <li key={item}>{item}</li>)}
        </ul>
      </div>
    );
  }
}

export default FriendList;
