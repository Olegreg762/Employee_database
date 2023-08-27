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
db_connection.query("SELECT * FROM employee", function(err, results){
    if (err) throw err;
    console.table(results)
});