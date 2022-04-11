/* Replace with your SQL commands */
CREATE TABLE order_products (
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    PRIMARY KEY (user_id,product_id)
);