// Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

// 6. The app should then prompt users with two messages.

//    * The first should ask them the ID of the product they would like to buy.
//    * The second message should ask how many units of the product they would like to buy.

// 7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

//    * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//    * This means updating the SQL database to reflect the remaining quantity.
//    * Once the update goes through, show the customer the total cost of their purchase.
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
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
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
        //update table and show new remaining and the price\
        //updateStock(numberUnits);

        //console.log(parseInt(res[0].stock_quantity) - numberUnits);
        var total = res[0].price*numberUnits;
        updateStock((res[0].stock_quantity - numberUnits), item_id, total);
      }
      else {

        console.log('Insufficient Quantity! (please select a lower quantity)');
        console.log('# of units remaining: ' + res[0].stock_quantity);
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

function updateStock(remainingUnits, item_id, total) {
  console.log(`Remaining Units: ${remainingUnits}`);
  var query = `UPDATE products SET stock_quantity = ${remainingUnits} WHERE item_id =  ${item_id};`;
  connection.query(query, function (err, res) {
    
    console.log(`Total Price = $${total}`); 
    
    console.log('Thanks! Have a Wonderful Day!');
    connection.end();
  });
}