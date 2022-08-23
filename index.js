//import express
const express = require('express')

//jwt import
const jwt = require('jsonwebtoken')

//import cors cross origin transaction
const cors = require('cors')

//create server app
const app = express()

//to parse JSON
app.use(express.json())

//use cors
app.use(cors({
    origin:['http://localhost:4200',
    'http://192.168.225.45:8080',
    'http://127.0.0.1:8080']
}))

//application specific meddleware
const appMiddleware = (req, res, next) => {
    console.log("application specific meddleware");
    next()
}

//use middleware
//app.use(appMiddleware)


//router specific middleware
const jwtMiddleware = (req, res, next) => {
    try {
        console.log("router specific meddleware");
        const token = req.headers['token']
        const data = jwt.verify(token, "nuravnavedusav")
        next()
    } catch {
        res.status(422).json({
            statusCode: 422,
            status: false,
            message: "Please Login"
        })
    }
}

//http request resolve

//GET Request- to read data
app.get('/', (req, res) => {
    res.send('GET Request Response')
})

//POST Request - to create data
app.post('/', (req, res) => {
    res.send('POST request response')
})

//PUT Request - to update data completely
app.put('/', (req, res) => {
    res.send('PUT request response')
})


//PATCH Request - to update data parcialy
app.patch('/', (req, res) => {
    res.send('PATCH request response')
})

//DELETE Request - to delete data
app.delete('/', (req, res) => {
    res.send('DELETE request response')
})

//import
const dataService = require('./service/data.service')


//register api
app.post('/register', (req, res) => {
    // console.log(req.body);
    dataService.register(req.body.accno, req.body.accname, req.body.accpwrd).then(result => {
        res.status(result.statusCode).json(result)
    })

})

//login api
app.post('/login', (req, res) => {
    dataService.login(req.body.accno, req.body.accpwrd).then(result=>{
        res.status(result.statusCode).json(result)
    })
    
})

//deposit api
app.post('/deposit', jwtMiddleware, (req, res) => {
    dataService.deposit(req.body.accno, req.body.accamt).then(result=>{
        res.status(result.statusCode).json(result)
    })
    
})

//widraw api
app.post('/widraw', jwtMiddleware, (req, res) => {
    dataService.widraw(req.body.accno, req.body.accamt).then(result=>{
        res.status(result.statusCode).json(result)
    })
    
})

//get Transaction api
app.post('/getTrans', jwtMiddleware, (req, res) => {
    dataService.getTrans(req.body.accno).then(result=>{
        res.status(result.statusCode).json(result)  
    })
   
})

app.delete('/delete/:accno',(req,res)=>{
    dataService.onDelete(req.params.accno).then(result=>{
        res.status(result.statusCode).json(result)  
    })
})

//setup port
app.listen(3000, () => {
    console.log("Server Running at port 3000")
})

