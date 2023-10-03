    const mongoose = require('mongoose');

    const adminSchema = new mongoose.Schema({
        fname : {
            type : String,
            default : 'N/A'
        },
        email : {
            type : String,
            required : true
        },
        password : {
            type : String,
            required : [true , 'Password is Compulsory']
        }
    })

    const Admin = mongoose.model('Admin' , adminSchema);

    module.exports = Admin;