/* Replace with your SQL commands */
CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL,
    user_id INTEGER REFERENCES users(id)
);
