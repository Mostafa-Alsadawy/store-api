/* Replace with your SQL commands */
CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    isOpen BOOLEAN NOT NULL,
    userid INTEGER REFERENCES users(id) ON DELETE CASCADE
);
