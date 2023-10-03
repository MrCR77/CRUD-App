const mongoose = require("mongoose");

const addEmployeeSchema = new mongoose.Schema({

    empName : {
        type : String
    },
    empEmail : {
        type : String
    },
    empPhone : {
        type : String
    },
    empDesign : {
        type : String
    }
});

const AddEmployee = mongoose.model('AddEmployee',addEmployeeSchema);

module.exports = AddEmployee;