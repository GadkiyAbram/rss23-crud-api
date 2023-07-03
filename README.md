Instructions for installing the App "Simple CRUD API"

1. Download git repository
2. To install dependencies run: npm i
3. To start app in dev mode, run: npm run start:dev
4. Open Postman API Tool to check the routes:
   
GET http://localhost:4000/api/users - to get all users

GET http://localhost:4000/api/users/1 - to get a user by id = 1

POST http://localhost:4000/api/users - to create a user record with body:

   {
     "username": "FirstUserName982935",
     "age": 36,
     "hobbies": []
   }
   
PUT http://localhost:4000/api/users/1 - to update a user record with id = 1:

   {
     "username": "FirstUserName12u",
     "age": 35,
     "hobbies": ["moto"]
   }
   
DELETE http://localhost:4000/api/users/1 - to delete a user record with id = 1:

6. To run a webpack bundle and start app in production mode run: npm run start:prod
7. To run app with a balancer and create multiple instances of the app, run: npm run start:multi
8. The endpoints are the same (above)
9. If you want to chang the port number, edit .env file

