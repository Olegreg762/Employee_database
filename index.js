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
        choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add A Department",
            "Add A Role",
            "Add An Employee",
            "Update An Employee Role",
            "Exit"]
    }
]
function main(){
    inquirer.prompt(action_list).then(data =>{
        const actions = {
            "View All Departments":view_all_departments,
            "View All Roles":view_all_roles,
            "View All Employees":view_all_employees,
            "Add A Department":add_a_department,
            "Add A Role":add_a_role,
            "Add An Employee":add_an_employee,
            "Update An Employee Role":update_an_employee_role,
            "Exit": ()=>{console.log("BYE!"); db_connection.end();}
        };
        const selected_action = actions[data.action];
        selected_action();
    })
};

function view_all_departments(){
    db_connection.query(
        `SELECT * FROM department;
        `, function(err, results){
    if (err) throw err;
    console.table(results)
    main();
    });
};

function view_all_roles(){
    db_connection.query(
        `SELECT
            role.id as role_id,
            role.title as title,
            department.name as department,
            role.salary
        FROM role
        JOIN department ON role.department_id = department.id;
        `, function(err, results){
    if (err) throw err;
    console.table(results)
    main();
    });
};

function view_all_employees(){
    db_connection.query(
        `SELECT
            CONCAT(employee.first_name, " ", employee.last_name) AS employee_name,
            role.title as title,
            department.name as department,
            role.salary,
            CONCAT(manager.first_name, " ", manager.last_name) AS manager
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id; 
        `, function(err, results){
    if (err) throw err;
    console.table(results)
    main();
    });
};

function add_a_department(){
    db_connection.query(
        `SELECT
        `, function(err, results){
    if (err) throw err;
    console.table(results)
    main();
    });
};

function add_a_role(){
    db_connection.query(
        `SELECT
        `, function(err, results){
    if (err) throw err;
    console.table(results)
    main();
    });
};

function add_an_employee(){
    db_connection.query(
        `SELECT
        `, function(err, results){
    if (err) throw err;
    console.table(results)
    main();
    });
};

function update_an_employee_role(){
    db_connection.query(
        `SELECT
        `, function(err, results){
    if (err) throw err;
    console.table(results)
    main();
    });
};

main()