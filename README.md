# bamazon

### Overview
Running this application first displays all of the items available for sale in a table and then prompts the user to select one to purchase. 

After the user selects an item to purchase, they are prompted again to enter in how many units of the product they want to buy.

Once the user input has been received, the application validates that the store has enough of the product in stock to meet the customer's request.
   - Entering 0 or a negative number will exit the program.

   - If there is `not enough` in stock, the application logs "insufficient quantity" and displays the number of units currently in stock. It then prompts the user to enter in another number that is lower so as to be less than or equal to the total number of units in stock.

   - If there is `enough` in stock, the application updates the SQL database to reflect the remaining quantity. Once the update goes through, the user is shown the number of units remaining and the total cost of their purchase.

