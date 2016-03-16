// Declare array to hold Products
var products = [];
// Declare array to hold Categories
var categories = [];
// Array to store original prices of Products
var originalPrice = [];

// First XHR is called second and gets products then calls outputStuff to write to DOM
function getProducts (){
  var XHR1= new XMLHttpRequest();
  XHR1.addEventListener("load", function(){
    products = JSON.parse(this.responseText).products;
    outputStuff();
  });
  XHR1.open("GET", "products.json");
  XHR1.send();
  
}

// Second XHR is called first and when Categories loaded, calls getProducts function (parameter)
function getCategories (productFunctionRef){
  var XHR2= new XMLHttpRequest();
  XHR2.addEventListener("load", function(){
    categories = JSON.parse(this.responseText).categories;
    productFunctionRef();
  });
  XHR2.open("GET", "categories.json");
  XHR2.send();
}

// Function called to output products to DOM with some Category info as well. Also records original prices of Products
function outputStuff(){
  var theCatalog = document.getElementById("stuff");
    for (var i=0; i<products.length; i++){
      theCatalog.innerHTML += "<article><header>" + products[i].name + "</header><section>" + categories[products[i].category_id - 1].name + "</section><footer class='price'>" + products[i].price + "</footer></article>";
      originalPrice[i] = products[i].price;
    }
}

// Changes prices of items
function changePrice(){
  // Gets Season in select control
  var theSeason = selectedSeason.value;
  // Holds new price of Product that it will be changed to
  var theNewPrice;
  // Determines when change in price takes place.
  var change = false;
  // Gets all prices for Products
  var thePrice = document.getElementsByClassName("price");

  // Loops through every Product
  for (var j=0; j<products.length; j++){
    // If price was changed, then change it back to original price
    if (products[j].price !== originalPrice[j]){
          theNewPrice = originalPrice[j];
          change = true;
    }

    // If Season not "Select" then change the prices of the Products who belong to that Season
    if (theSeason !== "Select"){
      if (categories[products[j].category_id - 1].season_discount === theSeason){
        theNewPrice = products[j].price - (products[j].price * categories[products[j].category_id - 1].discount);
        change = true;
      } 
    } 

    // If changed, update DOM and Products Array price
    if (change){
      thePrice[j].innerHTML = theNewPrice.toFixed(2);
      products[j].price = theNewPrice.toFixed(2);
      change = false;
    }
  }
}

// Call second XHR and pass it first XHR as Parameter
getCategories(getProducts);

// Get seasons selct control and then add Event Listener for change Event.
var selectedSeason = document.getElementById("seasons");
selectedSeason.addEventListener("change", changePrice);
