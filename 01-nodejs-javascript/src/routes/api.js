const express = require('express');
const { createUser,HandleLogin ,GetUser,GetAccount,updateUser} = require('../controllers/usercontroller');
const roomController = require('../controllers/roomController'); 
const buildingController = require('../controllers/buildingController'); 
const monthlyBillController = require('../controllers/monthlybillController');
const auth = require('../midlleware/auth');
const routerAPI = express.Router();

// const { getUsersAPI, postCreateUserAPI,
//     putUpdateUserAPI, deleteUserAPI

// } = require('../controllers/apiController')


// routerAPI.get('/users', getUsersAPI);    
// routerAPI.post('/users', postCreateUserAPI);
// routerAPI.put('/users', putUpdateUserAPI);
// routerAPI.delete('/users', deleteUserAPI);
routerAPI.all("*",auth) // xac thuc qua middleware

routerAPI.get("/",(req,res)=>{
    return res.status(200).json("hello word create user")
})  
routerAPI.post("/register",createUser)
routerAPI.post("/login",HandleLogin)
routerAPI.get("/user", GetUser)
routerAPI.get("/account", GetAccount)
routerAPI.put("/users/:id", updateUser);
//room
routerAPI.post("/room", roomController.create);
routerAPI.get("/room", roomController.getAll);
routerAPI.put("/room/:id", roomController.update);

//building
routerAPI.get("/building", buildingController.getAll);
routerAPI.post("/building", buildingController.create);
routerAPI.get("/building/report/revenue", buildingController.getRevenue);


//bill
routerAPI.get('/bill', monthlyBillController.getAll);
// routerAPI.get('/bill/:id', monthlyBillController.getById);
// routerAPI.get('/bill/summary/month', monthlyBillController.getSummaryByMonthYear);
routerAPI.post('/bill', monthlyBillController.create);
routerAPI.put("/bill/:id", monthlyBillController.update);
// routerAPI.get('/bill/pdf/:id', monthlyBillController.printBillPDF);

module.exports = routerAPI; //export default