DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT auto_increment NOT NULL,
  product_name VARCHAR(50) NULL,
  department_name VARCHAR(50) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iphone 6s", 'cell phones', 250.00, 5),
("lg tv", 'tvs', 300.00, 7),
("asus laptop", 'laptops', 1000.00, 2),
("samsung tv", 'tvs', 150.00, 3),
("samsung galaxy s9", 'cell phones', 666.66, 5),

("macbook pro", 'laptops', 1500.00, 1),
("westinghouse tv", 'tvs', 50.00, 7),
("dell xps", 'laptops', 500.00, 2),
("ge tv", 'tvs', 20.00, 33),
("samsung note 2", 'cell phones', 897.90, 5);
