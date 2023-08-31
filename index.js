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

function view_all_employees(){
    db_connection.query(
        `SELECT
            department.name AS department_name,
            role.title as role_title,
            CONCAT(employee.first_name, " ", employee.last_name) AS employee_name,
            CONCAT(manager.first_name, " ", manager.last_name) AS manager_name
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id; 
        `, function(err, results){
    if (err) throw err;
    console.table(results)
    });
}
