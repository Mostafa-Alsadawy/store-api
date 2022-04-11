/* Replace with your SQL commands */
CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    stat VARCHAR(50) NOT NULL,
    user_id INTEGER REFERENCES users(id)
);
