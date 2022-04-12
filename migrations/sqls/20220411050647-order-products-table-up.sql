/* Replace with your SQL commands */
CREATE TABLE order_products (
    id SERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id)
);