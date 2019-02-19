"use strict"
var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  start();
});


function start() {
  var query = "SELECT * FROM products";
  connection.query(query, function (err, res) {
    console.table(res);
    //console.log(res[0].item_id);
    var choiceArray = [];
    for (var i = 0; i < res.length; i++) {
      choiceArray.push(res[i].item_id.toString() + ' - ' + res[i].product_name);
    }

    selectItem(choiceArray);
  });
}

function selectItem(choiceArray) {
  console.log(choiceArray);
  inquirer
    .prompt([
      {
        name: "item",
        type: "list",
        message: "Which item would you like to purchase?",
        choices: choiceArray
      },
      {
        name: "numberUnits",
        type: "number",
        message: "How many units?"
      }
    ])
    .then(function (answer) {
      //console.log('selectItem() .then clause');
      checkUnits(parseInt(answer.numberUnits), answer.item.split('-')[0]);


    }).catch(function (err) {
      console.log(err);
    });
}

function checkUnits(numberUnits, item_id) {
  //console.log("item #: " + item_id);
  var query = "SELECT stock_quantity, price FROM products WHERE item_id = " + item_id;
  connection.query(query, function (err, res) {
    //console.log(res[0].stock_quantity >= numberUnits);
    if (numberUnits > 0) {
      if (res[0].stock_quantity >= numberUnits) {
        //console.log(parseInt(res[0].stock_quantity) - numberUnits);
        var totalPrice = res[0].price*numberUnits;
        var stock_remaining = res[0].stock_quantity - numberUnits;
        console.log(`Remaining Units: ${stock_remaining}`);
        console.log(`Total Price = $${totalPrice}`); 
        updateStock(stock_remaining, item_id);
      }
      else {

        console.log('Insufficient Quantity! (please select a lower quantity)');
        console.log('# of units in stock: ' + res[0].stock_quantity);
        redoNumberUnits(item_id);
      }
    } else {
      console.log('Thanks! Have a Great Day!');
      connection.end();
    }

  });
}
function redoNumberUnits(item_id) {
  inquirer
    .prompt(
      {
        name: "numberUnits",
        type: "number",
        message: "How many units?"
      }
    )
    .then(function (answer) {
      checkUnits(parseInt(answer.numberUnits), item_id);


    }).catch(function (err) {
      console.log(err);
    });
}

function updateStock(stock_remaining, item_id) {
  var query = `UPDATE products SET stock_quantity = ${stock_remaining} WHERE item_id =  ${item_id};`;
  connection.query(query, function (err, res) {
    console.log('Thanks! Have a Wonderful Day!');
    //console.log(res);
    connection.end();
  });
}