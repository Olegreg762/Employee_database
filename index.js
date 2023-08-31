const inquirer = require("inquirer");
const sql = require("mysql2");

function validate_input(input){
    if(input == ""){
        return console.log("Cannot Be Blank")
    }
    return true
};

function validate_input_number(input){
    if(input == "" || isNaN(input)){
        return console.log("Cannot Be Blank & Must be A Number")
    }
    return true
};

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
        message: "What Action Are You Needing To Complete?",
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
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "Name Of Department To Be Added?",
            validate: validate_input
        }
    ]).then((dept_add)=>{
        db_connection.query(
            `INSERT INTO department (name)
                VALUES ("${dept_add.department}");
            `);
        console.log(`Succesfully Added ${dept_add.department} to Departments `)
        view_all_departments();
        });
    };

function add_a_role(){
    db_connection.query(
        `SELECT * FROM department;
        `, function(err, results){
    if (err) throw err;
    const departments = results.map(department =>({
        name: department.name,
        value: department.id
    }));
    inquirer.prompt([
        {
            type: "list",
            name: "department_id",
            message: "Which Department Will Role Be Added To?",
            choices: departments
        },
        {
            type: "input",
            name: "role",
            message: "What Is The Title Of The New Role??",
            validate: validate_input
        },
        {
            type: "input",
            name: "salary",
            message: "What Will Be The Role's Salary?",
            validate: validate_input_number
        }
    ]).then((role_add)=>{
        db_connection.query(
            `INSERT INTO role (title, salary, department_id)
                VALUES ("${role_add.role}", ${role_add.salary}, ${role_add.department_id});`);
        const department_name = departments.find(dept => dept.value === role_add.department_id);
        console.log(`Succesfully Added ${role_add.role} To ${department_name.name} Department At The Salary of $${role_add.salary}!`);
        view_all_roles();
    })
        });
};

function add_an_employee(){
    db_connection.query(
        `SELECT * FROM department;`, 
    function(err, results){
        if (err) throw err;
        const departments = results.map(department =>({
            name: department.name,
            value: department.id
    }));

    inquirer.prompt([
        {
            type: "list",
            name: "department_id",
            message: "Which Department Will Role Be Added To?",
            choices: departments
        }
    ]).then((chosen_depart) => {
        db_connection.query(
            `SELECT * FROM role WHERE department_id = ${chosen_depart.department_id};`, 
        function(err, results){
            if (err) throw err;
            const roles = results.map(role =>({
                name: role.title,
                value: role.id
        }));
    inquirer.prompt([
        {
            type: "list",
            name: "role_id",
            message: "What Title Will the Employee Have?",
            choices: roles
        },
        {
            type: "input",
            name: "first",
            message: "What Is The Employee's First Name?",
            validate: validate_input
        },
        {
            type: "input",
            name: "last",
            message: "What Is The Employee's Last Name?",
            validate: validate_input
        },
        {
            type: "input",
            name: "manager",
            message: "Who Is The Employee's Manager?",
            validate: validate_input
        }

    ]).then((employee_add)=>{
        db_connection.query(
            `
            `);
        console.log(`Succesfully added ${employee_add.first} ${employee_add.last} to ${employee_add.department}!`)
        main();
        });
    });
    });
    });
}

function update_an_employee_role(){
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "Name Of Department To Be Added?",
            validate: validate_input
        }
    ]).then((dept_add)=>{
        db_connection.query(
            `
            `);
        console.log(`Succesfully added ${dept_add.department} to Departments `)
        main();
        });
};

main()