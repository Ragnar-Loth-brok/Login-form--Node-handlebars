require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('hbs');
require('./database/connection');
const Register = require('./models/resgiters');
const bcrypt =  require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static(`${path.join(__dirname, '../')}public`));

app.set('view engine', 'hbs');
app.set('views', `${path.join(__dirname, '../')}templates/views`);
hbs.registerPartials(`${path.join(__dirname, '../')}templates/partials`);   

app.get('/', (req, res)=>{
    res.render('index')
})

app.get('/register', (req, res)=>{
    res.render('register')
})

app.post('/register', async (req, res)=>{
    try {
        const init = req.body.initPass === req.body.confirmPass ? true : false;
 
        if(init){
            const data = new Register({
                firstname: req.body.fname,
                lastname: req.body.lname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: req.body.initPass,
                confirmpassword: req.body.confirmPass
            })

            const token = await data.generateAuthToken();
            console.log('The token is ' + token);

            const postData = await data.save();
            console.log('Data posted to database!');

            res.status(201).render('index');

        }else res.send('Password does not match');
        
    } catch (error) {
        res.status(400).send(error)
    }
})

app.get('/login', (req, res)=>{
    res.render('login')
})

app.post('/login', async (req, res)=>{
    try {
        const {email, pass} = req.body;
        const getData = await Register.findOne({email});

        const init = await bcrypt.compare(pass, getData.password);

        const token = await getData.generateAuthToken();
        console.log('The token is -> ' + token);

        if(init) res.status(201).render('index');
        else res.send("<h1>Password Invalid</h1>");
        
    } catch (error) {
        res.send(error);
    }
})

app.listen(process.env.PORT || 8000, ()=> console.log('Listening to the port 8000'));