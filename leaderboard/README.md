# README

Table: user name map to message count, day count 
user name

Message record
 - user name
 - message text
 - message date

User
 - id
 - user name primary key
 - unique message count
 - unique day count 

$ bin/rails generate model Message username:text date:text text:text
