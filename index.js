//default modules
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

//custom modules
const authMiddleWare = require('./middleWares/authMiddleware')
const cookieMiddleWare = require('./middleWares/cookieMiddleware');

//schemas
const Admin = require('./schemas/adminSchema');
const AddEmployee = require('./schemas/addEmployeeSchema');

const JWT_SECRET_KEY = 'thisismysecretkeyforjsonwebtoken';

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mindscript')
.then(function(){
    console.log('Database Connected...');
})
.catch(function(){
    console.log('DB Connection Error. Please try again later.');
})

app.use(express.static('assets'));
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.json({
        status : 1,
        message : 'Public Route',
        data : 'Welcome to homepage'
    })
})




app.post('/employee', authMiddleWare ,async (req,res)=>{

    try 
    {
        const addEmployee = new AddEmployee({
            empName : req.body.name,
            empEmail : req.body.email,
            empPhone : req.body.phone,
            empDesign : req.body.designation
        })

        const insertedEmployee = await addEmployee.save();

        if (insertedEmployee) 
        {
            res.json({
                status : 1,
                message : 'Added Employee Successfully',
                data : insertedEmployee
            })
        }
        else 
        {
            res.json({
                status : 0,
                message : 'Add Employee Unsuccessful..!!',
                data : null
            })
        }
    } 
    catch(error)
    {
        console.log(error);
    }
})


app.get('/employee', authMiddleWare, async (req,res)=>{

    try 
    {
        const dispEmployee = await AddEmployee.find({},{})

        if(dispEmployee)
        {
            res.json({
                status : 1,
                message : 'All Employees Details..',
                data : dispEmployee
            })
        }
        else
        {
            res.json({
                status : 0,
                message : 'Could Not Find Employees...!',
                data : null
            })
        }
    } 
    catch (error)
    {
        console.log(error);
    }

    // res.json({
    //     status : 1,
    //     message : 'View Employee Page',
    //     data : 'Welcome to homepage'
    // })
})


app.delete('/employee/:employeeID', authMiddleWare , async (req , res)=>{

    console.log( req.params);
    const employee_ID = req.params.employeeID;
    
    try 
    {
        const deleteEmployee = await AddEmployee.deleteOne({_id : employee_ID});
        
            res.json({
                status : 1,
                message : "Employee Deleted Successfully",
                data : deleteEmployee
            })
    }
    catch(error) 
    {
        console.log(error);
        res.json({
            status : 0,
            message : "Could Not Find Employee!!!",
            data : null
        })
    }
})


app.put('/employee/:employeeID' , authMiddleWare , async(req,res)=>{

    try 
    {
        const updateEmployee = await AddEmployee.updateOne(
            {
                _id : req.params.employeeID
            },
            {
                empEmail : req.body.empEmail
            }
        )

        res.json({
            status : 1,
            message : "Employee Updated Successfully",
            data : updateEmployee
        })
    } 
    catch (error) 
    {
        console.log(error);
        res.json({
            status : 0,
            message : "Could Not Find Employee!!!",
            data : null
        })
    }
})









app.post('/register', async (req ,res)=>{
    const { fname , email ,password } = req.body;
    console.log(req.body);
    try
    {
        const checkAdminPresent = await Admin.findOne({ email });

        if (checkAdminPresent)
        {
            res.json({
                status : 0,
                message : 'Admin Already Present',
                data : null
            });    
        } 
        else 
        {
            const admin = new Admin({ fname ,email ,password });
            
            const insertedAdmin = await admin.save();

            res.json({
                status : 1,
                data : insertedAdmin
            });
        }
    }
    catch (err)
    {
        console.log(err);
        res.json({
            status : 0,
            message : 'Could not add Admin!!!!',
            data : null
        });
    }
})


app.post('/login' , async (req , res)=>{

    try 
    {
        const { email , password } = req.body;

        const adminDocument = await Admin.findOne({ email });

        if ( adminDocument )
        {//email is correct
            if( adminDocument.password == password ) 
            {
                const email = adminDocument.email;
                const token = jwt.sign({ adminEmail : email }, JWT_SECRET_KEY );

                // res.cookie('jwt_token', token);

                res.json({
                    token : token,
                    status : 1,
                    message : 'Login Successful',
                    data : adminDocument
                })
            } 
            else 
            {
                res.json({
                    status : 0,
                    message : 'Password is Incorrect',
                    data : null
                })   
            }
        } 
        else 
        {
            res.json({
                status : 0,
                message : 'Email is Incorrect',
                data : null
            })   
        }
    } catch(error)
    {
        console.log(error);
        res.json({
            status : 0,
            message : 'Login Unsuccessful..!!',
            data : null
        })       
    }
})


app.listen('8000',()=>{

    console.log('Server Started..');

})