const db = require("./db");
const helper = require("../helper");
//Get employee based on employee id
async function getSingle(emp) {
  let message = "Error in fetching employee";
  let error = true;
  try {
    let myQueryStr = `SELECT e.id AS id, e.name AS name, e.gender AS gender, ce.cafe_id AS cafe_id, email_address, phone_number, ce.joining_date AS joining_date FROM employee AS e LEFT JOIN cafe_employee as ce ON e.id = ce.employee_id LEFT JOIN cafe AS c ON ce.cafe_id = c.id WHERE e.status=1 `;
    myQueryStr += `AND e.id="${emp}" LIMIT 1`;
    const rows = await db.query(myQueryStr);
    const data = helper.emptyOrRows(rows);
    message = "Fetch employee successfully";
    error = false;
    return {
      data: data.length > 0 ? data[0] : {},
      message,
      error,
    };
  } catch (e) {
    message = "Error in fetching employee";
    error = true;
    return {
      data: {},
      message,
      error,
    };
  }
}
//Get all employees
async function getMultiple(cafe = "") {
  let message = `Error in fetching employees`;
  if (cafe) {
    message += ` for cafe ${cafe}`;
  }
  let error = true;
  try {
    let myQueryStr = `SELECT e.id AS id, e.name AS name, email_address, phone_number, COALESCE(TIMESTAMPDIFF(DAY, ce.joining_date, NOW()),0) AS days_worked, COALESCE(c.name, '') AS cafe FROM employee AS e LEFT JOIN cafe_employee as ce ON e.id = ce.employee_id LEFT JOIN cafe AS c ON ce.cafe_id = c.id WHERE e.status=1 `;
    if (cafe) {
      myQueryStr += `AND c.id = '${cafe}' `;
    }
    myQueryStr += `ORDER by days_worked DESC`;
    const rows = await db.query(myQueryStr);
    const data = helper.emptyOrRows(rows);
    message = `Fetched employees successfully`;
    if (cafe) {
      message += ` for cafe ${cafe}`;
    }
    error = false;
    return {
      data,
      message,
      error,
    };
  } catch (e) {
    message = `Error in fetching employees`;
    if (cafe) {
      message += ` for cafe ${cafe}`;
    }
    error = true;
    return {
      data: [],
      message,
      error,
    };
  }
}
//Form custom employee identifier
async function generateEmployeeIdentifier() {
  try {
    const [rows, fields] = await db.query(`
          SELECT GenerateEmployeeIdentifier() AS id
      `);
    return rows?.id;
  } catch (error) {
    console.error("Error generating employee identifier:", error);
    return 0;
  }
}
//Get cafe_employee id based on employee id
async function getEmployeesCafe(employee_id) {
  try {
    const [rows, fields] = await db.query(`
          SELECT id FROM cafe_employee WHERE employee_id = "${employee_id}" AND status = 1
      `);
    return rows?.id;
  } catch (error) {
    console.error("Error getting employee cafe relation:", error);
    return 0;
  }
}
//Get employee by email id
async function getEmployeeByEmail(email) {
  try {
    const [rows, fields] = await db.query(`
          SELECT * FROM employee WHERE email_address = "${email}" AND status = 1
      `);
    return rows;
  } catch (error) {
    console.error("Error getting employee email:", error);
    return 0;
  }
}
//Add employee to the database
async function create(
  name,
  email_address,
  phone_number,
  gender,
  cafe,
  joining_date
) {
  let message = "Error in creating employee id";
  let error = true;
  try {
    const id = await generateEmployeeIdentifier();
    const email_exist = await getEmployeeByEmail(email_address);
    message = "Email already exist";
    if (id && !email_exist) {
      let myQueryString = `INSERT INTO employee(id, name, email_address, phone_number, gender) VALUES`;
      myQueryString += `('${id}', '${name}', '${email_address}', '${phone_number}', '${gender}') `;
      const result = await db.query(myQueryString);
      message = "Error in creating employee";
      if (result.affectedRows) {
        message = "Employee created successfully";
        error = false;
        if (cafe) {
          myQueryString = `INSERT INTO cafe_employee`;
          if (joining_date) {
            myQueryString += `(cafe_id, employee_id, joining_date) `;
          } else {
            myQueryString += `(cafe_id, employee_id) `;
          }
          myQueryString += `VALUES `;
          if (joining_date) {
            const formattedDate = new Date(joining_date)
              .toISOString()
              .replace("T", " ")
              .substring(0, 19); // Convert date to MySQL timestamp format
            myQueryString += `('${cafe}', '${id}', STR_TO_DATE('${formattedDate}', '%Y-%m-%d %H:%i:%s')) `;
          } else {
            myQueryString += `('${cafe}', '${id}') `;
          }
          const result_rel = await db.query(myQueryString);
          message =
            "Employee successfully added but error adding cafe relation";
          error = true;
          if (result_rel?.affectedRows) {
            message = "Employee and their cafe relation added successfully";
            error = false;
          }
        }
      }
    }
    return { message, error };
  } catch (e) {
    message = "Error in creating employee";
    error = true;
    return { message, error };
  }
}
//Update employee in the database
async function update(id, name, phone_number, gender, cafe, joining_date) {
  let message = "Error in updating employee";
  let error = true;
  try {
    let myQueryString = `UPDATE employee SET name="${name}", phone_number="${phone_number}", gender="${gender}" WHERE id = "${id}"`;
    const result = await db.query(myQueryString);

    if (result.affectedRows) {
      message = "Employee updated successfully";
      error = false;
      if (cafe) {
        const cafeRelId = await getEmployeesCafe(id);
        if (cafeRelId) {
          myQueryString = `UPDATE cafe_employee SET cafe_id="${cafe}" `;
          if (joining_date) {
            const formattedDate = new Date(joining_date)
              .toISOString()
              .replace("T", " ")
              .substring(0, 19); // Convert date to MySQL timestamp format
            myQueryString += `, joining_date = STR_TO_DATE('${formattedDate}', '%Y-%m-%d %H:%i:%s') `;
          }
          myQueryString += `WHERE id = "${cafeRelId}"`;
          const result_rel = await db.query(myQueryString);
          message =
            "Employee successfully updated but error updating cafe relation";
          error = true;
          if (result_rel?.affectedRows) {
            message = "Employee and their cafe relation updated successfully";
            error = false;
          }
        } else {
          myQueryString = `INSERT INTO cafe_employee`;
          if (joining_date) {
            myQueryString += `(cafe_id, employee_id, joining_date) `;
          } else {
            myQueryString += `(cafe_id, employee_id) `;
          }
          myQueryString += `VALUES `;
          if (joining_date) {
            const formattedDate = new Date(joining_date)
              .toISOString()
              .replace("T", " ")
              .substring(0, 19); // Convert date to MySQL timestamp format
            myQueryString += `('${cafe}', '${id}', STR_TO_DATE('${formattedDate}', '%Y-%m-%d %H:%i:%s')) `;
          } else {
            myQueryString += `('${cafe}', '${id}') `;
          }
          const result_rel = await db.query(myQueryString);
          message =
            "Employee successfully updated but error adding cafe relation";
          error = true;
          if (result_rel?.affectedRows) {
            message = "Employee and their cafe relation updated successfully";
            error = false;
          }
        }
      }
    }

    return { message, error };
  } catch (e) {
    message = "Error in updating employee";
    error = true;
    return { message, error };
  }
}
//Delete employee from the database
async function remove(id) {
  let message = "Error in deleting employee";
  let error = true;
  try {
    //Remove records from cafe_employee relation to avoid foreign key constraint
    const empRel = await getEmployeesCafe(id);
      if (empRel) {
        // const result_rel = await db.query(
        //   `UPDATE cafe_employee SET status=0 WHERE id='${empRel}'`
        // );
        const result_rel = await db.query(
          `DELETE FROM cafe_employee WHERE id='${empRel}'`
        );
        message = "Error in deleting employee from cafe";
        error = true;
        if (result_rel?.affectedRows) {
          message = "Employee and their cafe relation is deleted successfully";
          error = false;
        }
      }
    // const result = await db.query(
    //   `UPDATE employee SET status=0 WHERE id='${id}'`
    // );
    //Now remove employee
    const result = await db.query(
      `DELETE FROM employee WHERE id='${id}'`
    );

    if (result.affectedRows) {
      message = "Employee deleted successfully";
      error = false;
    }

    return { message, error };
  } catch (e) {
    message = "Error in deleting employee";
    error = true;
    return { message, error };
  }
}

module.exports = {
  getSingle,
  getMultiple,
  create,
  update,
  remove,
};
