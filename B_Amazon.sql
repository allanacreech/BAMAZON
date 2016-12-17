-- Creates the "B_Amazon" database --
CREATE DATABASE B_Amazon;

-- Makes it so all of the following code will affect B_Amazon --
USE B_Amazon;

-- Creates the table "product" within B_Amazon --
CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  item_id VARCHAR (1000) NOT NULL,
  product_name VARCHAR (1000) NOT NULL,
  department_name VARCHAR(1000) NOT NULL,
  price INTEGER NOT NULL,
  stock_quantity INTEGER NOT NULL,
  PRIMARY KEY (id)
);
