# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
### Products
#### Index 
return all products on database
- url : /products
- method : GET
- success reponse : json contains
        status: "success",
        message: "done getting all products",
        data: allProuducts in array form, 
- authentication : not needed
- url-params : none
#### show
return single product with provided id
- url : /products/:id
- method : GET
- success reponse : json contains
        status: "success",
        message: "done get product with id ,
        data: product, 
- authentication : not needed
- url-params : id for wanted product
#### create
create new product in database
- url : /products/add-product
- method : POST
- success reponse : json contains
        status: "success",
        message: "done create new product",
        data: product create information, 
- authentication : token required 
- body: name string required , price integer required , cat string optional

#### delete
delete product with provided id
- url : /products/:id
- method : DELETE
- success reponse : json contains
        status: "success",
        message: "done delete product with id " + id,
        data: product just been deleted, 
- authentication : token required 
- url-params : id for product you want to delete  
#### update
update product with given information 
- url : /products/update
- method : PUT
- success reponse : json contains
        status: "success",
          message: "done update product with id",
          data: product after update 
- authentication : token required 
- body: name string required , price integer required , cat string optional

#### get by category 
get all products that have the same category  
- url : /products/cat/:cat
- method : GET
- success reponse : json contains
        status: "success",
        message: "done get product with catagory " ,
        data: result,
- authentication : not needed 
- url-params: cat string

### Users
#### Index 
return all users on database
- url : /users
- method : GET
- success reponse : json contains
        status: "success",
        message: "get all users done",
        data: [array of users], 
- authentication : token required
- url-params : none
#### show
return single user with provided id
- url : /users/:id
- method : GET
- success reponse : json contains
        status: "success",
        message: "done getting user with id" ,
        data: user, 
- authentication : token required
- url-params : id for wanted user
#### create
create new user in database
- url : /users/add-user
- method : POST
- success reponse : json contains
        status: "success",
        massage: "created user with token",
        data: { ...result, token }, 
- authentication : not needed 
- body: firstname string min-length 3char required , lastname string min-length 3 chrachters required , passwd string min-length 5 chrachters required

#### delete
delete user with provided id
- url : /products/:id
- method : DELETE
- success reponse : json contains
        status: "success",
        message: "done delete product with id",
        data: user just been deleted, 
- authentication : token required 
- url-params : id for user you want to delete  
#### update
update user with given information 
- url : /users/:id
- method : PUT
- success reponse : json contains
        status: "success",
          message: "done update user with id",
          data: user after update 
- authentication : token required 
- body: firstname string min-length 3char required , lastname string min-length 3 chrachters required , passwd string min-length 5 chrachters required

#### authenticate
authenticat already exist user by returning token for user 
- url : /users/authenticate
- method : POST
- success response : json contains
        status: "success",
        massage: "done authenticate user with token",
        data: { ...user, token },
- authentication : not needed 
- body: id int required , passwd string required


### Orders
#### Index 
return all orders on database
- url : /orders
- method : GET
- success reponse : json contains
        status: "success",
        message: "done list all orderes",
        data: [array of orders], 
- authentication : token required
- url-params : none
#### show
return single order with provided id
- url : /orders/:id
- method : GET
- success reponse : json contains
        status: "success",
        message: "done list one ordere with id " ,
        data: order, 
- authentication : token required
- url-params : id for wanted order
#### create
create new user in database
- url : /orders/add-order
- method : POST
- success reponse : json contains
        status: "success",
        massage: "done create one ordere with id",
        data: order just created, 
- authentication : token required 
- body: isopen boolean required, userid int required.

#### delete
delete order with provided id
- url : /orders/:id
- method : DELETE
- success reponse : json contains
        status: "success",
        message: "done delete one ordere with id",
        data: user just been deleted, 
- authentication : token required 
- url-params : id for order you want to delete  
#### update(complete)
close order with given id 
- url : /orders/:id/complete
- method : PUT
- success reponse : json contains
        status: "success",
          message: "done update one ordere with id",
          data: order
- authentication : token required 
- url-params: id for order want to close.


### Order products service
#### Index 
return all products for given order
- url : /orders/:id/products
- method : GET
- success reponse : json contains
        status: "success",
        message: "done all products for one order.",
        data: [array of orders], 
- authentication : token required
- url-params : order id

#### add
add new product for givin order
- url : /orders/:id/product
- method : POST
- success reponse : json contains
        status: "success",
        massage: "done add product to order",
        data: product just added, 
- authentication : token required 
- url-params : order id.
- body: quantity int required, product_id int required.

#### delete
delete product from order
- url : /orders/:orderid/products/:productid
- method : DELETE
- success reponse : json contains
        status: "success",
        message: "done delete one product for one order.",
        data: product just been deleted, 
- authentication : token required 
- url-params : order id , product id  


## Data Shapes
#### Product
- id SERIAL PRIMARY KEY,
- name VARCHAR(150) NOT NULL,
- cat VARCHAR(150),
- price INT NOT NULL

#### User
- id SERIAL PRIMARY KEY,
- firstName VARCHAR(50) NOT NULL,
- lastName VARCHAR(50) NOT NULL,
- passwd TEXT NOT NULL 

#### Orders
- id SERIAL PRIMARY KEY,
- isOpen BOOLEAN NOT NULL,
- userid INTEGER REFERENCES users(id) ON DELETE CASCADE


#### Order-Products
- id SERIAL PRIMARY KEY,
- quantity INTEGER NOT NULL,
- order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
- product_id INTEGER REFERENCES products(id) ON DELETE CASCADE
