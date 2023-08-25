INSERT INTO department(name)
VALUES 
("Sales"),
("Legal"),
("Finance"),
("Engineering");

INSERT INTO role (title, salary, department_id)
VALUES
("Sales Lead", 100000, 1),
("SalesPerson", 80000, 1),
("Lead Engineer", 150000, 4),
("Software Engineer", 120000, 4),
("Account Manager", 160000, 3),
("Accountant", 125000, 3),
("Legal Team Lead", 250000, 2),
("Lawyer", 190000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Camina", "Drummer", 4, NULL),
("Carlos", "De Baca", 4, 1),
("Lola", "Shaddid", 2, NULL),
("Josephus", "Miller", 2, 2);