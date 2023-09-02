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
    let employee_data = {};
    db_connection.query(
        `SELECT * FROM department;`, 
    function(err, department_results){
        if (err) throw err;
        const departments = department_results.map(department =>({
            name: department.name,
            value: department.id
    }));
    inquirer.prompt([
        {
            type: "list",
            name: "department_id",
            message: "Which Department Will Employee Be Added To?",
            choices: departments
        }
        ]).then((department_choice) => {
            const department_name = departments.find(dept => dept.value === department_choice.department_id);
            employee_data.department_name = department_name.name;
            employee_data.department_id = department_choice.department_id;
            db_connection.query(
                `SELECT * FROM role WHERE department_id = ${department_choice.department_id};`, 
            function(err, role_results){
                    if (err) throw err;
                    const roles = role_results.map(role =>({
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
                }
                ]).then((role_choice)=>{
                    const role_name = roles.find(dept => dept.value === role_choice.role_id);
                    employee_data.role_name = role_name.name;
                    employee_data.role_id = role_choice.role_id;
                    employee_data.first_name = role_choice.first;
                    employee_data.last_name = role_choice.last;
                    db_connection.query(
                        `SELECT employee.*
                        FROM employee, role, department
                        WHERE employee.role_id = role.id
                          AND role.department_id = department.id
                          AND department.name = "${employee_data.department_name}"
                        ORDER BY role.id ASC
                        LIMIT 1;
                        `, 
                        function(err, managers_results){
                            if (err) throw err;
                            if(managers_results.length === 0){
                                employee_data.manager_id = null;
                                employee_data.manager_name = `${employee_data.first_name} ${employee_data.last_name}`;
                            }else{
                                employee_data.manager_id = managers_results[0].id;
                                employee_data.manager_name = `${managers_results[0].first_name} ${managers_results[0].last_name}`;
                            };
                            db_connection.query(
                                `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES("${employee_data.first_name}","${employee_data.last_name}", ${employee_data.role_id}, ${employee_data.manager_id})
                                `);
                            console.log(`Succesfully Added ${employee_data.first_name} ${employee_data.last_name} To The ${employee_data.department_name} Department With The Role ${employee_data.role_name} With ${employee_data.manager_name} As Their Manager.`)
                            view_all_employees();
                        });
                    });
                });
            });
        });    
};
    

function update_an_employee_role(){
    let update_data = {}
    db_connection.query(
        `SELECT id,
            first_name, last_name FROM employee;`, 
    function(err, employee_list){
        if (err) throw err;
        const employees = employee_list.map(employee =>({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
            first_name: employee.first_name,
            last_name: employee.last_name
        }));
    inquirer.prompt([
        {
            type: "list",
            name: "employee_id",
            message: "Which Employee Would You Like To Update?",
            choices: employees
        }
    ]).then((update_employee)=>{
        const employee_name = employees.find(employee => employee.value === update_employee.employee_id);
        update_data.name = employee_name.name;
        update_data.first_name = employee_name.first_name;
        update_data.last_name = employee_name.last_name;
        update_data.id = update_employee.employee_id;
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
                message: `Which Department Will ${update_data.name} Be Moved To?`,
                choices: departments
            }
        ]).then((update_dept) => {
            const department_name = departments.find(dept => dept.value === update_dept.department_id);
            update_data.department_name = department_name.name;
            update_data.department_id = update_dept.department_id;
            db_connection.query(
                `SELECT * FROM role WHERE department_id = ${update_dept.department_id};`, 
            function(err, role_results){
                    if (err) throw err;
                    const roles = role_results.map(role =>({
                        name: role.title,
                        value: role.id
                }));
                inquirer.prompt([
                {
                    type: "list",
                    name: "role_id",
                    message: `What Will ${update_data.name}'s New Role Be?`,
                    choices: roles
                }
            ]).then((update_role)=>{
                const role_name = roles.find(dept => dept.value === update_role.role_id);
                update_data.role_name = role_name.name;
                update_data.role_id = update_role.role_id;
                console.log(update_data)
                db_connection.query(
                    `SELECT employee.*
                    FROM employee, role, department
                    WHERE employee.role_id = role.id
                      AND role.department_id = department.id
                      AND department.name = "${update_data.department_name}"
                    ORDER BY role.id ASC
                    LIMIT 1;
                    `, 
                    function(err, update_manager){
                        if (err) throw err;
                        update_data.manager_id = update_manager[0].id;
                        update_data.manager_name = `${update_manager[0].first_name} ${update_manager[0].last_name}`;
                        db_connection.query(`
                            UPDATE employee
                            SET
                                first_name = "${update_data.first_name}",
                                last_name = "${update_data.last_name}",
                                role_id = ${update_data.role_id},
                                manager_id = ${update_data.manager_id}
                            WHERE
                                id = ${update_data.id};`);
                        console.log(`Succesfully Updated ${update_data.first_name} ${update_data.last_name} To The ${update_data.department_name} Department With The Role ${update_data.role_name} With ${update_data.manager_name} As Their Manager.`)
                        view_all_employees();
});
});
});
});
});           
});
});
};

main();