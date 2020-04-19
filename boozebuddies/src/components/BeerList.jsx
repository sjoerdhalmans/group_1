import React, { Component } from "react";
import axios from "axios";

import { Button, ListGroup } from "react-bootstrap";
//import "./FriendList.css";
import "./styles/BarList.css";



//Beer
//it might be better to have separate Beer.jsx file or maybe some common utility file to contain this kind of small classes
class Beer {
  constructor(id, name, brand, alcoholPercentage) {
    this.id = id;
    this.name = name;
    this.brand = brand;
    this.alcoholPercentage = alcoholPercentage;
  }
}



class BeerList extends Component {


  constructor(props)
  {
    super(props);

//Button function binds

    //list order buttons
    this.sortByBrandClicked = this.sortByBrandClicked.bind(this);
    this.sortByNameClicked = this.sortByNameClicked.bind(this);
    this.sortByAlcoholPClicked = this.sortByAlcoholPClicked.bind(this);
    this.sortReverseClicked = this.sortReverseClicked.bind(this);

    //add beer buttons
    this.addBeerClicked = this.addBeerClicked.bind(this);


    let beer333 =  new Beer(333, "AKalja", "Merkki", 7.7); //testbeer for debug

    this.state = {

        getBeersCalled: false,
        filterArrayCalled: false,
        beerListUpdated: false,

        beerArray:[beer333],
        beerArrayFiltered:[beer333],

        listOrder: "brand",
        reverseListOrder: false,
        listFilter:"",

        barId: props.barId,

        addBeerState: false,
        addBeerBrand:"",
        addBeerName:"",
        addBeerAlcoholPercentage:0

      };
  }

//callBacks
/*
  hideBeerListCallBack = () => {
    this.props.hideBeerListCallBack();
  };
*/



//Fuctions
  componentDidMount()
  {
    //console.log("componentDidMount");
    //if(!this.state.getBeersCalled)
    this.getBeers();
    this.sortListBy(this.state.listOrder);
  }



  componentDidUpdate(prevProps, prevState, snapshot) //this makes component re-render when a proberty in state is changed
  {
    //console.log("componentDidUpdate");

    if(prevState.listOrder != this.state.listOrder)
    {
      //console.log("if listOrder");
      this.sortListBy(this.state.listOrder);
    }

    if(this.state.reverseListOrder == true)
    {
      //console.log("if sortReverse");
      this.sortListReverseOrder();
    }

    if(this.state.addBeerState == true)
    {
      //let newBeer = new Beer(456, "testName", "testBrand", 45);
      //this.addNewBeer(newBeer.name, newBeer.brand, newBeer.alcoholPercentage);
      this.addNewBeer(this.state.addBeerName, this.state.addBeerBrand, this.state.addBeerAlcoholPercentage);
    }

    if(prevState.listFilter != this.state.listFilter ||
      prevState.listOrder != this.state.listOrder ||
      prevState.beerArray != this.state.beerArray||
      this.state.reverseListOrder == true
      )
    {
      this.filterListBy(this.state.listFilter);
    }

  }




  async getBeers()
  {
    //let newBeersArray = this.state.beerArray;
      let newBeersArray =[];  //creating new array for beer, so setState can be used instead of push

    await axios
      .get("http://217.101.44.31:8083/api/public/beer/getAllBeers")
      .then(res => {
        console.log(res);

        res.data.beers.forEach((item, i) => {
          const beer = new Beer(item.id, item.name, item.brand, item.alcoholPercentage);

          newBeersArray.push(beer);
        });

        //this.state.beerArrayFiltered = this.filterListBy(this.state.listFilter); //beerArray can be filtered
        if( this.state.listFilter == null || this.state.listFilter.length == 0)
        {
          this.setState({ beerArrayFiltered: newBeersArray });
        }

        this.setState({ beerArray: newBeersArray });
      })
    }



    
    async addNewBeer()
    {
      this.setState({addBeerState:false})

      if(
        this.state.addBeerName != null && this.state.addBeerName.length > 0 &&
        this.state.addBeerBrand != null && this.state.addBeerBrand.length > 0 &&
        this.state.addBeerAlcoholPercentage != null && !isNaN(this.state.addBeerAlcoholPercentage)
      ){
                    //console.log("if parameters ok");

                    let addBeerBody =
                      {
                      alcoholPercentage: this.state.addBeerAlcoholPercentage,
                      bars: [],
                      brand: this.state.addBeerBrand,
                      id: 0,
                      name: this.state.addBeerName
                    };



                    await axios.post("http://217.101.44.31:8083/api/public/beer/addBeer", addBeerBody )
                    .then(res => {
                      console.log(res);

                      this.getBeers();
                      this.resetAddBeerValues();


                    })}

    }


    resetAddBeerValues()
    {
      this.setState({
        addBeerName: "",
        addBeerBrand:"",
        addBeerAlcoholPercentage:0
      })

      document.getElementById("idInputAddName").value = "";
      document.getElementById("idInputAddBrand").value = "";
      document.getElementById("idInputAddAlcoholPercentage").value = "";


    }



   sortListBy(type) //possible parameters: name/brand/id (string), later ABV
    {
        let newOrderBeerArray = this.state.beerArray;

          if(type == "id" || type == "alcoholPercentage"){
            newOrderBeerArray.sort((a, b) => (a[type] > b[type]) ? 1 : -1); //sorts numeric values
          }
          else {
            newOrderBeerArray.sort((a, b) => a[type].localeCompare(b[type], undefined, {sensitivity: 'base'})) //ignores case
          }

          this.setState({beerArray: newOrderBeerArray})
    }



    sortListReverseOrder()
    {
      //console.log("sortListReverseOrder");

      let reverseOrderBeerArray = this.state.beerArray;

      reverseOrderBeerArray.reverse();


      this.setState({beerArray: reverseOrderBeerArray, reverseListOrder:false})
    }




    filterListBy(text) //returns beerArray with only beers which name contains given parameter(string)
    {
      if(text !=null && text.length > 0)
      {
        let newFilteredArray = this.state.beerArray.filter(beer => beer.brand.toLowerCase().includes(text.toLowerCase()))
        this.setState({beerArrayFiltered: newFilteredArray})
      }
      else
      {
        this.setState({beerArrayFiltered: this.state.beerArray})
      }
    }

//ButtonClick functions
    hideButtonClicked = () => {
          this.props.hideBeerListCallBack();
    };



    sortByNameClicked(event)
    {
      event.preventDefault()
      this.setState({listOrder: "name"})
    }


    sortByBrandClicked(event)
    {
      event.preventDefault()
      this.setState({listOrder: "brand"})
    }


    sortByAlcoholPClicked(event)
    {
      event.preventDefault()
      this.setState({listOrder: "alcoholPercentage"})
    }

    sortReverseClicked(event)
    {
      //console.log("sortReverseClicked");
      event.preventDefault()
      this.setState({reverseListOrder: true})
    }


    addBeerClicked(event)
    {
      //console.log("sortReverseClicked");
      event.preventDefault()
      this.setState({addBeerState: true})
    }



//filter change handler
    filterListChangeHandler  = event => {
      this.setState({ listFilter: event.target.value });
    };

//Add Beer Change handlers
    addBeerBrandChangeHandler = event => {
      this.setState({ addBeerBrand: event.target.value });
    };

    addBeerNameChangeHandler = event => {
      this.setState({ addBeerName: event.target.value });
    };

    addBeerAlcoholPercentageChangeHandler = event => {
      this.setState({ addBeerAlcoholPercentage: event.target.value });
    };








//Render
  render(){

    return(

      <React.Fragment>

      <Button
        type="submit"
        onClick={this.hideButtonClicked}
      >
        Hide
      </Button>

        <h4>Beerlist</h4>

        <Button
          type="submit"
          onClick={this.sortByBrandClicked}
        >
          brand
        </Button>


        <Button
          type="submit"
          onClick={this.sortByNameClicked}
        >
          name
        </Button>


        <Button
          type="submit"
          onClick={this.sortByAlcoholPClicked}
        >
          ABV %
        </Button>


        <Button
          type="submit"
          onClick={this.sortReverseClicked}
        >
          reverse
        </Button>

        <label>Filter:</label>
        <input id="idInputAddBrand" type="text" onChange={this.filterListChangeHandler} />



        {this.state.beerArrayFiltered.map(beer => (
        <ul key={beer.id}>
          {beer.id}: <a href="">{beer.brand} {beer.name}</a>, {beer.alcoholPercentage}%
        </ul>
        ))}

        <h4>Add New Beer</h4>

        <form>
          <p>Brand: {this.state.addBeerBrand}</p>
          <input id="idInputAddBrand" type="text" onChange={this.addBeerBrandChangeHandler} />

          <p>Name: {this.state.addBeerName}</p>
          <input id="idInputAddName" type="text" onChange={this.addBeerNameChangeHandler} />

          <p>ABV %: {this.state.addBeerAlcoholPercentage}</p>
          <input id="idInputAddAlcoholPercentage" type="text" onChange={this.addBeerAlcoholPercentageChangeHandler} />

        </form>

        <Button
        type="submit"
        onClick={this.addBeerClicked}
        >
        Add New Beer
        </Button>

      </React.Fragment>
    )
  }



}

export default BeerList;
