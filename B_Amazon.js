//bring in mysql
var mysql = require("mysql");
// bring in inquirer
var inquirer = require("inquirer");

var Table = require("cli-table");

var totalCost = 0;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Dentist1!",
  database: "B_Amazon"
});


connection.connect(function (err) {
  if (err) throw err;
  //console.log("connected as id " + connection.threadId);
});


//Start connection to the database
function startTable (){
connection.query("SELECT * FROM product", function (err, res) {
  if (err) {
    throw err;
  }
  displayResults(res);
  runPrompt();
   
});
}




//How to display the results 
function displayResults(results){
   //console.log(results);
   var ourTable = new Table({
       head: ['Item ID', 'Product Name', 'Price (USD)', 'Department'],
       colAligns: ['left', 'left', 'right', 'left']
   });
   for(var i = 0; i < results.length; i++){
       var record = results[i];
      // console.log(JSON.parse(JSON.stringify(record)));
       ourTable.push([record.item_id, record.product_name, record.price.toFixed(2), record.department_name]);
   }
   console.log(ourTable.toString());
};

//variable to get user search function
var runPrompt = function() {

  inquirer.prompt([
      {
        name: "id",
        type: "input",
        message: "Please enter in the ID that you would like to buy or Q to Stop!",
        
        validate: function(value){
           if (value == ""){
               return false;
           }
           return true;
       }

   },
        { when: function (response) {
                        return response.id.toUpperCase() != 'Q';
                    },
       name:"quantity",
       type: "input",
       message: "Please enter in how many you would like to buy!",
       validate: function(value){
           if (isNaN(value) === false){
               return true;
           }
           return false;
       }
    } 
   
   
     ]).then(runSearch)
  };



//function to run the request process
function runSearch(answer){


    if(answer.id.toUpperCase() === 'Q'){
        console.log('Thanks Good-Bye');
        connection.end();
        return;
    }
    var query = "SELECT * from product where item_id = '" + answer.id + "'";

    connection.query(query, function(err, res){
    if (err){
        throw err;
    }
    //check for length because it sends it back as array
    if(res.length == 0){
        console.log("Can't find " +  answer.id);
        runprompt();
        return;    
    }
    var quantityOrdered = parseInt(answer.quantity);
    //check the database for quantity to check how much left
    if(quantityOrdered > res[0].stock_quantity){
         console.log("We don't have that much in stock :(");
         runprompt();
         return;
    }
    displayResults(res);

    var cost = quantityOrdered * res[0].price;
    console.log("Item(s) cost you $ " + cost);
    totalCost += cost;

    var newQuantity = res[0].stock_quantity - quantityOrdered;
    var query = "update product set stock_quantity = " + newQuantity + " where item_id = '" + answer.id + "'";
    connection.query(query, function(err, res){
    if (err){
        throw err;
    }
    startTable();
    });
})
};


  //run to see if they want to buy more
  var buyMore = function() {
  inquirer.prompt({
    name: "artist",
    type: "input",
    message: "Would you like to buy more? Please enter Yes or NO"
        }).then(function(answer) {
            if(answer === yes){
            runSearch();
        } else{
            connection.end();
        }    
        }
      
        )};
  

  
startTable();


    