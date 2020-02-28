import React, { Component } from "react";
import axios from "axios";

class FriendList extends Component{





  constructor(props)
  {
    super(props);

this.state ={
  friendsCalled: false,
  userEmail: props.flist,

  friendId :[555, 333, 222,],
  friendName: ["Mikko", "Antero", "Jaska"],
  friendEmail:["mike","ant","jaska"]
  
};


    //this.state = {  }

    console.log("Friendlist props");
    console.log(props.flist);
    //console.log(typeof(this.state.userEmail));
  };


//Functions
async getFriends()
{
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


      });

    });
  }







//Render
  render() {

    if(this.state.userEmail != "" && this.state.friendsCalled == false)
    {
      this.getFriends();
      this.setState({friendsCalled: true});
    }

    return (
      <div>
      <p> {this.state.userEmail} </p>
        <ul>
          {this.state.friendName.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }



}

export default FriendList;
