const inquirer = require("inquirer");
const sql = require("mysql2");

const db_connection = sql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "",
        database: "employee_db"
    },
console.log(`Connected to database`)
);

const action_list = [
    {
        type: "list",
        name: "action",
        message: "What Action Are You Needing To Complete",
        choices: ["View All Departments", "View All Roles", "View All Employees", "Add A Department", "Add A Role", "Add An Employee", "Update An Employee Role"]
    }
]

function view_all(){
    db_connection.query(
        "SELECT * FROM employee", function(err, results){
    if (err) throw err;
    console.table(results)
    });
}


