# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index 
    "products\" [GET]
    returns list of all existed products
- Show
    "products\id:\" [GET]
    retuern single product by giving its id.
    note: if product with given id not exist will retuen bad request error.
- Create [token required]
    "add-product" [POST]
- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category)

#### Users
- Index [token required]

- Show [token required]
- Create N[token required]

#### Orders
- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes
#### Product
-  id serial primary key
- name varchar(100) not null
- price money not null
- [OPTIONAL] category

#### User
- id serial primary key
- firstName varchar(100) not null
- lastName varchar(100) not null
- password text not null

#### Orders
- id serial primary key
- user_id integer refrence user(id)
- status of order (active or complete) varchar(50)


#### Order-Products
- id serial primary key
- id of each order integer refrence order_id
- id of each product in the order integer refrence product_id
- quantity of each product in the order integer not null
