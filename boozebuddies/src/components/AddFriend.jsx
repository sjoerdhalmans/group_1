import React, { Component } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";

class AddFriend extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: true,
      friendName: "",
    };

  }

  handleChange = event => {
    this.setState({ friendName: event.target.value });
  }



  handleModalClose = () => {
    this.setState({ showModal: false });
    this.props.callBack();
  };



  submitHandler = event => {
    let requestRelationshipBody = {
      friendUsername: this.state.friendName,
      you: {
        email: this.props.userEmail,
        id: this.props.userId,
        name: this.props.userName
      }
    };
    
    axios
      .post("http://217.101.44.31:8082/api/public/friend/addRelationship", 
      requestRelationshipBody)
        .then(res => {
            console.log(requestRelationshipBody);
            console.log(res);
            console.log(res.data);
        })
      this.handleModalClose();
    };

  render() {
    return (
      <div>
        <Modal show={this.state.showModal} onHide={this.handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add a friend</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form>
              <p>Friend's username:</p>
              <input type="text" friendName="friendName" onChange={this.handleChange}/>
            </form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={() => this.submitHandler()}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

//change filename

export default AddFriend;
