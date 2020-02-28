import React, { Component } from "react";
import axios from "axios";

class NewProfileForm extends Component {
  state = {
    newAccountName: ""
  };

  nameChangeHandler = event => {
    this.setState({ newAccountName: event.target.value });
  };

  submitHandler = event => {
    event.preventDefault();

    const newUser = {
      id: 0,
      name: this.state.newAccountName,
      email: this.props.newEmail
    };

    axios
      .post("http://217.101.44.31:8081/api/public/user/addUser", newUser)
      .then(res => {
        console.log(res);
        console.log(res.data);
      });
  };

  render() {
    return (
      <div>
        {console.log("newForm rendered")}
        <form onSubmit={this.submitHandler}>
          <h1>New Login</h1>
          <p>Enter your name:</p>
          <input type="text" onChange={this.nameChangeHandler} />
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default NewProfileForm;
