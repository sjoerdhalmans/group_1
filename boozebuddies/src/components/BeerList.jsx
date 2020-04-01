import React, { Component } from "react";
import axios from "axios";

import { Button, ListGroup } from "react-bootstrap";
//import "./FriendList.css";



//Beer
//it might be better to have separate Beer.jsx file or maybe some common utility file to contain this kind of small classes
class Beer {
  constructor(id, name, brand) {
    this.id = id;
    this.name = name;
    this.brand = brand;

//this will be added later when beerAPI is online
    //this.alcoholPercentage = alcoholPercentage; //or ABV
  }
}



class BeerList extends Component {


  constructor(props)
  {
    super(props);

    let beer333 =  new Beer(333, "Kalja", "Merkki"); //testbeer for debug

    this.state = {

        beerListUpdated: false,

        beerArray:[beer333],

        listOrder: "name",
        //listFilter:""

        //barId: props.barId,
        //addBeerState: false
      };
  }


//Fuctions
  componentDidMount() //this makes component re-render when a proberty in state is changed
  {
    this.getBeers();
  }


  async getBeers()
  {

    //this.setState({beerArray: null})

    await axios
      .get("http://217.101.44.31:8081/api/public/user/getAllUsers") //this will be changed when beerAPI is online
      .then(res => {
        console.log(res);

        res.data.forEach((item, i) => {
          const beer = new Beer(item.id, item.name, item.email);
          this.state.beerArray.push(beer);
        });

        this.sortListBy(this.state.listOrder);

        this.state.beerArray = this.filterListByNamePart("Ju"); //beerArray can be filtered

        this.setState({ beerListUpdated: true });
      })
    }


   sortListBy(type) //possible parameters: name/brand/id (string), later ABV
    {
          if(type == "id"){
            this.state.beerArray.sort((a, b) => (a[type] > b[type]) ? 1 : -1);
          }
          else {
            this.state.beerArray.sort((a, b) => a[type].localeCompare(b[type], undefined, {sensitivity: 'base'})) //ignores case
          }
    }


    filterListByNamePart(text) //returns beerArray with only beers which name contains given parameter(string)
    {
      let filteredArray = this.state.beerArray.filter(beer => beer.name.includes(text))
      return filteredArray
    }
/*
    sortListById = () => {
        this.setState({ listOrder: "id", beerListUpdated: false })

    };
*/

/*
      handleChange(event){
        this.setState({listFilter: event.target.value});

        //let text = this.listFilterName.value
        //this.setState({listFilter: text, beerListUpdated: false })
      }

    handleSubmit(event) {
      //alert('A name was submitted: ' + this.state.value);
      event.preventDefault();
    }
*/





//Render
  render(){
    return(

      <React.Fragment>

        <h4>Beerlist</h4>
       <p>sort by:
        <Button
          type="submit"
          onClick={() => this.sortListById()}
        >
          id
        </Button>

        <Button
          type="submit"
          onClick={() => this.setState({listOrder:"name"})}
        >
          name
        </Button>



        <form onChage={this.handleSubmit}>
        <input type="text" value={this.state.listFilter} onChange={this.handleChange}/>
        </form>

        </p>



        {this.state.beerListUpdated && this.state.beerArray.map(beer => (
        <ul>
          {beer.id}: <a target="_blank" href="https://www.google.com/">{beer.name}</a>: {beer.brand} <button> Test Button </button>
        </ul>
        ))}

        {this.state.beerListUpdated && <ul>beerlist updated true</ul> }
      </React.Fragment>
    )



          {//don't know if this is good way to implement this
            this.setState({beerListUpdated:false})
          }
  }



}

export default BeerList;
