import React, { Component } from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import './AddFriend.css';

class AddFriend extends Component {
  state = {
    showModal: true,
  };

  handleModalClose = () => {
    this.setState({ showModal: false });
    this.props.addFriendCallBack();
  };

  submitHandler = event => {};

  render() {
    return (
      <div>
        <Modal className="modal-overlay" show={this.state.showModal} onHide={this.handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add a friend</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form>
              <p>Friend's username:</p>
              <input type="text" />
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
export default AddFriend;