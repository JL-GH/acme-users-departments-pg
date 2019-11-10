const pg = require('pg');
const uuid = require('uuid');
const fs = require('fs');

const { Client } = pg;

const client = new Client({
    connectionString: 'postgress://localhost:5432/acme_users_departments_pg'
});

client.connect();

const generateIds = (...names) => {
    return names.reduce((acc, name) => {
        acc[name] = uuid.v4();
        return acc;
    }, {})
};

const ids = generateIds('hr_department', 'sales_department', 'marketing_department', 'it_department', 'user_1', 'user_2', 'user_3', 'user_4', 'downtown_office', 'midtown_office');

const SQL = `
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS offices CASCADE;

CREATE TABLE departments(
    id UUID PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE users(
    id UUID PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    department_id UUID REFERENCES departments.id,
    office_id UUID REFERENCES offices.id,
);

CREATE TABLE offices(
    id UUID PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    lat DECIMAL,
    lng DECIMAL
);

INSERT INTO departments(id, name) VALUES('${ids.hr_department}', 'HR');
INSERT INTO departments(id, name) VALUES('${ids.sales_department}', 'Sales');
INSERT INTO departments(id, name) VALUES('${ids.marketing_department}', 'Marketing');
INSERT INTO departments(id, name) VALUES('${ids.it_department}', 'IT');

INSERT INTO users(id, name, department_id) VALUES('${ids.user_1}', 'User 1', '${ids.hr_department}', '${ids.downtown_office}');
INSERT INTO users(id, name, department_id) VALUES('${ids.user_2}', 'User 2', '${ids.sales_department}', '${ids.downtown_office}');
INSERT INTO users(id, name, department_id) VALUES('${ids.user_3}', 'User 3', '${ids.marketing_department}', '${ids.midtown_office}');
INSERT INTO users(id, name, department_id) VALUES('${ids.user_4}', 'User 4', '${ids.it_department}', '${ids.midtown_office}');

INSERT INTO offices(id, name, lat, lng) VALUES('${ids.downtown_office}', 'Downtown Office', 40.705259, -74.009202);
INSERT INTO offices(id, name, lat, lng) VALUES('${ids.midtown_office}', 'Midtown Office', 40.759166, -73.979316);
`;

const sync = async () => {
    await client.query(SQL);
}

sync();

const selectUsers = `
SELECT departments.name, users.* FROM departments JOIN users ON users.department_id = departments.id;
`
// const selectUsers = `
// SELECT * FROM users WHERE department_id = '3081d8be-c6cb-4c31-a45f-9e3acb881383'
// `

const selectDepartments = `
SELECT * FROM departments;
`

const findAllUsers = () => {
    return client.query(selectUsers);
}

const findAllDepartments = () => {
    return client.query(selectDepartments);
}

module.exports = {
    findAllUsers,
    findAllDepartments,
}