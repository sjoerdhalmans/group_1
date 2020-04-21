import React, { Component } from "react";
import axios from "axios";

import { Button, Accordion, Card, ListGroup } from "react-bootstrap";
import "./BeerList.css";
import StarRatingComponent from 'react-star-rating-component';



//Beer
//it might be better to have separate Beer.jsx file or maybe some common utility file to contain this kind of small classes
class Beer {
  constructor(id, name, brand, alcoholPercentage) {
    this.id = id;
    this.name = name;
    this.brand = brand;
    this.alcoholPercentage = alcoholPercentage;
    this.ratingByUser = 0;
    this.ratingId = 0;
  }
}



class BeerList extends Component {


  constructor(props)
  {
    super(props);

//Button function binds
    this.showAddBeerClicked = this.showAddBeerClicked.bind(this);


    //list order buttons
    this.sortByBrandClicked = this.sortByBrandClicked.bind(this);
    this.sortByNameClicked = this.sortByNameClicked.bind(this);
    this.sortByAlcoholPClicked = this.sortByAlcoholPClicked.bind(this);
    this.sortReverseClicked = this.sortReverseClicked.bind(this);

    //add beer buttons
    this.addBeerClicked = this.addBeerClicked.bind(this);
    this.cancelAddBeerClicked = this.cancelAddBeerClicked.bind(this);

    //rate beer buttons
    this.addRatingClicked = this.addRatingClicked.bind(this);
    this.rateBeerClicked = this.rateBeerClicked.bind(this);
    this.cancelAddRatingClicked = this.cancelAddRatingClicked.bind(this);

    //edit rating buttons

    this.editRatingClicked = this.editRatingClicked.bind(this);
    this.cancelEditRatingClicked = this.cancelEditRatingClicked.bind(this);
    this.rateAgainClicked = this.rateAgainClicked.bind(this);
    this.deleteRatingClicked = this.deleteRatingClicked.bind(this);



    let beer333 =  new Beer(333, "!", "Try reloading the page", 0); //testbeer for debug

    this.state = {

        getBeersCalled: false,
        getRatingsCalled: false,
        filterArrayCalled: false,
        addBeerCalled: false,
        rateBeerCalled: false,
        editRatingCalled: false,
        deleteRatingCalled: false,
        setCurrentBeerInfoStringCalled: false,
        beerListUpdated: false,

        beerArray:[beer333],
        beerArrayFiltered:[beer333],

        listOrder: "brand",
        reverseListOrder: false,
        listFilter:"",

        barId: props.barId,
        userId: props.userId,             //CHANEGE HERE props.userId AFTER ADDING IT IN APP.JS

        showAddBeer:false,
        addBeerBrand:"",
        addBeerName:"",
        addBeerAlcoholPercentage:0,

        showRateBeer: false,
        showEditRating: false,
        currentBeerId: 0,
        currentBeerRating: 0,
        currentBeerRatingId: 0,
        currentBeerInfoString:""

      };
  }




//Fuctions
  componentDidMount()
  {
    this.getBeers();
    this.sortListBy(this.state.listOrder);
  }



  componentDidUpdate(prevProps, prevState, snapshot) //this makes component re-render when a proberty in state is changed
  {
    if(prevState.listOrder != this.state.listOrder)
    {
      this.sortListBy(this.state.listOrder);
    }

    if(this.state.reverseListOrder == true)
    {
      this.sortListReverseOrder();
    }

    if(this.state.addBeerCalled == true)
    {
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

    if(this.state.setCurrentBeerInfoStringCalled ==  true)
    {
      this.setCurrentBeerInfoString();
    }

    if(this.state.rateBeerCalled == true)
    {
      this.addNewBeerRating();
    }


    if(this.state.getRatingsCalled ==  true)
    {
      this.getAllUserRatings();
    }

    if(this.state.editRatingCalled == true)
    {
      this.editBeerRating();
    }

    if(this.state.deleteRatingCalled == true)
    {
      this.deleteRating();
    }




  }




  async getBeers()
  {
      let newBeersArray =[];  //creating new array for beer, so setState can be used instead of push

    await axios
      .get("http://217.101.44.31:8083/api/public/beer/getAllBeers")
      .then(res => {
        //console.log(res);

        res.data.beers.forEach((item, i) => {
          const beer = new Beer(item.id, item.name, item.brand, item.alcoholPercentage);

          newBeersArray.push(beer);
        });

        if( this.state.listFilter == null || this.state.listFilter.length == 0)
        {
          this.setState({ beerArrayFiltered: newBeersArray });
          this.getAllUserRatings();
        }



        this.setState({ beerArray: newBeersArray });
        this.getAllUserRatings();
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
    }


    async getAllUserRatings()
    {
      this.setState({getRatingsCalled: false})

      await axios
        .get("http://217.101.44.31:8086/api/public/bar/getAllUserRatings/"+this.state.userId)
        .then(res => {
            //console.log("getAllUserRatings response");

        //Add ratings to beerArray
            let beerArrayWithRatings =  this.state.beerArray;

            res.data.beerRatings.forEach(item => {
              //console.log(item.beerId);

              let indexOfBeerInArray =  this.state.beerArray.findIndex(beer => beer.id === item.beerId);
              //console.log("indexOfBeerInArray");
              //console.log(indexOfBeerInArray);

              let beerWithRating =  beerArrayWithRatings[indexOfBeerInArray];
              beerWithRating.ratingByUser = item.rating;
              beerWithRating.ratingId = item.id;

              //console.log("beerWithRating.ratingId");
              //console.log(beerWithRating.ratingId);

              beerArrayWithRatings[indexOfBeerInArray] = beerWithRating;

              });
            this.setState({beerArray: beerArrayWithRatings})

            //console.log(res);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })

    }






    async addNewBeer()
    {
      this.setState({addBeerCalled:false})

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
                      this.setState({showAddBeer: false});
                    })}
    }




    async addNewBeerRating()
    {
      this.setState({rateBeerCalled:false})
      //console.log("addNewBeerRating()");
      //console.log("rating:"+this.state.currentBeerRating);
      //console.log("beerId:"+this.state.currentBeerId);

        if(this.state.currentBeerRating != 0 && this.state.currentBeerId != 0)
        {

          //console.log("if-conditions ok");
                        let addBeerRatingBody =
                        {
                          objectId: this.state.currentBeerId,
                          objectRating: this.state.currentBeerRating,
                          userId: this.state.userId
                        };

                        await axios.post("http://217.101.44.31:8086/api/public/bar/rateBeer", addBeerRatingBody )
                        .then(res => {
                          console.log(res);

                          this.getBeers();
                          this.resetRateBeerValues();

                          this.setState({showRateBeer: false});
                        })
                        .catch(function (error) {
                          // handle error
                          console.log(error);
                        })
        }
    }




    async editBeerRating()
    {
      this.setState({editRatingCalled:false})
      //console.log("editRating()");
      //console.log("rating:"+this.state.currentBeerRating);
      //console.log("beerId:"+this.state.currentBeerId);
      //console.log("ratingId:"+this.state.currentBeerRatingId);
      //console.log("userId:"+this.state.userId);


        if(this.state.currentBeerRating != 0 && this.state.currentBeerId != 0)
        {

          //console.log("if-conditions ok");
                        let editBeerRatingBody =
                        {
                          beerId: this.state.currentBeerId,
                          id: this.state.currentBeerRatingId,
                          rating: this.state.currentBeerRating,
                          userId: this.state.userId
                        };

                        await axios.put("http://217.101.44.31:8086/api/public/bar/EditBeerRating", editBeerRatingBody )
                        .then(res => {
                          console.log(res);

                          this.getBeers();
                          this.resetRateBeerValues();

                          this.setState({showEditRating: false});
                        })
                        .catch(function (error) {
                          // handle error
                          console.log(error);
                        })
        }
    }




    async deleteRating()
    {
      this.setState({deleteRatingCalled:false})
      //console.log("deleteRating()");
      //console.log("rating:"+this.state.currentBeerRating);
      //console.log("beerId:"+this.state.currentBeerId);
      //console.log("ratingId:"+this.state.currentBeerRatingId);
      //console.log("userId:"+this.state.userId);


        if(this.state.currentBeerRating != 0 && this.state.currentBeerId != 0)
        {

          //console.log("if-conditions ok");
                        let deleteBeerRatingBody =
                        {
                          beerId: this.state.currentBeerId,
                          id: this.state.currentBeerRatingId,
                          rating: this.state.currentBeerRating,
                          userId: this.state.userId
                        };

                        await axios.delete("http://217.101.44.31:8086/api/public/bar/DeleteBeerRating", { data: deleteBeerRatingBody } )
                        .then(res => {
                          console.log(res);

                          this.getBeers();
                          this.resetRateBeerValues();

                          this.setState({showEditRating: false});
                        })
                        .catch(function (error) {
                          // handle error
                          console.log(error);
                        })
        }
    }





    resetRateBeerValues()
    {
      //console.log("resetRateBeerValues()");
      this.setState({
        currentBeerId: 0,
        currentBeerRating:0,
        currentBeerRatingId:0,
        listFilter: ""
      })
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




    setCurrentBeerInfoString()
    {
      this.setState({setCurrentBeerInfoStringCalled: false})

      if(this.state.currentBeerId != 0)
      {
        let beer = this.state.beerArray.find(element => element.id == this.state.currentBeerId);
        let infoString = beer.brand + " "+ beer.name + ", "+beer.alcoholPercentage+ "%";

        let rating = beer.ratingByUser;
        let ratingId = beer.ratingId;

          this.setState({currentBeerInfoString:infoString, currentBeerRating:rating, currentBeerRatingId: ratingId});

      }
      else
      {
          this.setState({currentBeerInfoString:""});
      }

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
      this.setState({addBeerCalled: true})
    }

    showAddBeerClicked(event)
    {
      //console.log("sortReverseClicked");
      event.preventDefault()
      this.setState({showAddBeer: true})
    }

    cancelAddBeerClicked(event)
    {
      //console.log("sortReverseClicked");
      event.preventDefault()
      this.setState({showAddBeer: false})
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

//Rate beer
  onStarClick(nextValue, prevValue, name) {
  this.setState({currentBeerRating: nextValue});
  }

  rateBeerClicked(event)
  {
    //console.log("sortReverseClicked");
    event.preventDefault()
    this.setState({rateBeerCalled: true})
  }

  rateAgainClicked(event)
  {
    //console.log("sortReverseClicked");
    event.preventDefault()
    this.setState({editRatingCalled: true})
  }

  deleteRatingClicked(event)
  {
    //console.log("sortReverseClicked");
    event.preventDefault()
    this.setState({deleteRatingCalled: true})
  }



  addRatingClicked(event)
  {
    event.preventDefault();
    this.setState({currentBeerId: event.target.value, setCurrentBeerInfoStringCalled: true , showRateBeer: true})
    //console.log("addRatingClicked");
    //console.log(this.state.currentBeerId);
  }

  editRatingClicked(event)
  {
    event.preventDefault();
    this.setState({currentBeerId: event.target.value, setCurrentBeerInfoStringCalled: true , showEditRating: true})
    //console.log("addRatingClicked");
    //console.log(this.state.currentBeerId);
  }

  cancelAddRatingClicked(event)
  {
    //console.log("sortReverseClicked");
    event.preventDefault()
    this.setState({showRateBeer: false})
  }

  cancelEditRatingClicked(event)
  {
    //console.log("sortReverseClicked");
    event.preventDefault()
    this.setState({showEditRating: false})
  }












//Render
  render(){

    return(

      <div>



        <h4 className="beersHeader">Beerlist</h4>

        <Button className="beersHideButton"
          type="submit"
          onClick={this.hideButtonClicked}
        >
          Hide
        </Button>


{this.state.showRateBeer &&

  <div className= "rateBeerDiv">
<h5>Rate {this.state.currentBeerInfoString} </h5>

  <div>
  <StarRatingComponent
    name="rate1"
    starCount={5}
    value={this.state.currentBeerRating}
    onStarClick={this.onStarClick.bind(this)}
  />
  </div>

  <Button className="beerListButton"
    type="submit"
    onClick={this.rateBeerClicked}
  >
    Rate
  </Button>

  <Button className="beerListButton"
  type="submit"
  onClick={this.cancelAddRatingClicked}
  >
  Cancel
  </Button>

  </div>
}

{this.state.showEditRating &&

  <div className= "editRatingDiv">
<h5>Edit rating for {this.state.currentBeerInfoString} </h5>

  <div>
  <StarRatingComponent
    name="rate2"
    starCount={5}
    value={this.state.currentBeerRating}
    onStarClick={this.onStarClick.bind(this)}
  />
  </div>

  <Button className="beerListButton"
    type="submit"
    onClick={this.rateAgainClicked}
  >
    Rate Again
  </Button>

  <Button className="deleteRatingButton"
    type="submit"
    onClick={this.deleteRatingClicked}
  >
    Delete rating
  </Button>

  <Button className="beerListButton"
  type="submit"
  onClick={this.cancelEditRatingClicked}
  >
  Cancel
  </Button>

  </div>
}






{!this.state.showAddBeer && !this.state.showRateBeer && !this.state.showEditRating &&


        <div>
        <Button className="beerListButton"
          type="submit"
          onClick={this.sortByBrandClicked}
        >
          brand
        </Button>


        <Button className="beerListButton"
          type="submit"
          onClick={this.sortByNameClicked}
        >
          name
        </Button>


        <Button className="beerListButton"
          type="submit"
          onClick={this.sortByAlcoholPClicked}
        >
          ABV %
        </Button>


        <Button className="beerListButton"
          type="submit"
          onClick={this.sortReverseClicked}
        >
          reverse
        </Button>

        <label>Filter:</label>
        <input id="idInputAddBrand" type="text" onChange={this.filterListChangeHandler} />



        <Button className="beersAddBeerButton"
          type="submit"
          onClick={this.showAddBeerClicked}
        >
          Add new Beer
        </Button>

        <Accordion>

            {this.state.beerArrayFiltered.map(beer => (
            <Card key={beer.id}>
              <Card.Header className="beerCardHeader">

                {beer.id}: {beer.brand} {beer.name}, {beer.alcoholPercentage}%,

                {beer.ratingByUser != 0 &&
                        <div className="beerCardUserRating"> Your rating:

                          <StarRatingComponent className="beerCardUserRatingStars"
                            editing={false}
                            starCount={5}
                            value={beer.ratingByUser}
                          />

                        </div>}


                {beer.ratingByUser ==0 &&
                  <React.Fragment>
                  <Button className="beerCardAddRatingButton" value={beer.id} onClick={this.addRatingClicked}> add rating </Button>
                  </React.Fragment>
                }

                {beer.ratingByUser !=0 &&
                  <React.Fragment>
                  <Button className="beerCardEditRatingButton" value={beer.id} onClick={this.editRatingClicked}> edit </Button>
                  </React.Fragment>
                }


              </Card.Header>


            </Card>
            ))}
        </Accordion>


        </div>
}


        {this.state.showAddBeer && ( <div className="addBeerDiv">
                    <h4>Add New Beer</h4>

                    <form>
                      <p>Brand: {this.state.addBeerBrand}</p>
                      <input id="idInputAddBrand" type="text" onChange={this.addBeerBrandChangeHandler} />

                      <p>Name: {this.state.addBeerName}</p>
                      <input id="idInputAddName" type="text" onChange={this.addBeerNameChangeHandler} />

                      <p>ABV %: {this.state.addBeerAlcoholPercentage}</p>
                      <input id="idInputAddAlcoholPercentage" type="text" onChange={this.addBeerAlcoholPercentageChangeHandler} />

                    </form>

                    <Button className="beerListButton"
                    type="submit"
                    onClick={this.addBeerClicked}
                    >
                    Add
                    </Button>

                    <Button className="beerListButton"
                    type="submit"
                    onClick={this.cancelAddBeerClicked}
                    >
                    Cancel
                    </Button>


                    </div>
        )}

      </div>
    )
  }



}

export default BeerList;
