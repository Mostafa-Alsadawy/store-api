# Storefront Backend Project

## Getting Started

This repo contains a basic Node and Express app for Storefront Backend api this project was part of Udacity nanodgree program.

## How to set up this project.

### make databases for project
to use this backend you need to create 2 databases one for production and secoed for testing
use command `CREATE DATABASE [the name for database]`

Your application must have the following files:
### Create .env file:
in the root of this project create file and name it ".env"
this file will store your enviroumint variables :
- NODE_ENV: to specify if it production env or testing env.
- DB : your productio database name.
- DB_TEST : your test database name.
- HOST : server address where will host this project.
- USER : user name for database admin
- PASSWORD : passwrd for user.
- PEPPER : secret word to use as part of hashing passwords.
- SALT_ROUNDs : number of rounds to us in hassing process
- TOKEN_SECRET : secret password used in jwt auth.
make sure that the variable name is the same.

### Install pakages :
install pakages needed for this project :
`npm install ` Or `yarn`

to make sure that db-migrate cli works install it gloabaly 
`npm install -g db-migrate ` Or `yarn add -g db-migrate`
### set up database :
make tables needed for this project on database use command :
`db-migrate up`

