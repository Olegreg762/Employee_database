INSERT INTO department(id, name)
VALUES 
(1, "Sales"),
(2, "Legal"),
(3, "Finance"),
(4, "Engineering");

INSERT INTO role (id, title, salary, department_id)
VALUES
(1, "Sales Lead", 100000, 1),
(2, "Sales Person", 80000, 1),
(3, "Lead Engineer", 150000, 4),
(4, "Software Engineer", 120000, 4),
(5, "Account Manager", 160000, 3),
(6, "Accountant", 125000, 3),
(7, "Legal Team Lead", 250000, 2),
(8, "Lawyer", 190000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Camina", "Drummer", 3, NULL),
("Lola", "Shaddid", 7, NULL),
("Chrisjen", "Avasarala", 1, NULL),
("Jules-Pierre", "Mao", 5, NULL),
("Carlos", "De Baca", 4, 1),
("Josephus", "Miller", 8, 2),
("Nancy", "Gao", 2, 3),
("Antony", "Dresden", 6, 4);