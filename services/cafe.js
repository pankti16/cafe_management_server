const db = require("./db");
const helper = require("../helper");
// Get cafe_employee id and employee id from cafe_employee table based on cafe_id
async function getCafesEmployee(cafe_id) {
  try {
    const rows = await db.query(`
          SELECT employee_id, id FROM cafe_employee WHERE cafe_id = "${cafe_id}" AND status = 1
      `);

    return helper.emptyOrRows(rows);
  } catch (error) {
    console.error("Error getting employee cafe relation:", error);
    throw error;
  }
}
// Get all cafes
async function getMultiple(location = undefined) {
  let message = "Error in fetching cafes";
  if (location) {
    message += ` for location ${location}`;
  }
  let error = true;
  try {
    let myQueryStr = `SELECT c.id, name, location, description, logo, COALESCE(COUNT(ce.employee_id), 0) as employees FROM cafe as c LEFT JOIN cafe_employee as ce ON c.id = ce.cafe_id WHERE c.status=1 `;
    if (location) {
      myQueryStr += `AND c.location LIKE '%${location}%' `;
    }
    myQueryStr += `GROUP BY c.id ORDER BY COALESCE(COUNT(ce.employee_id), 0) DESC, name ASC`;
    const rows = await db.query(myQueryStr);
    const data = helper.emptyOrRows(rows);
    message = "Fetched cafes successfully";
    if (location) {
      message += ` for location ${location}`;
    }
    error = false;

    return {
      data,
      message,
      error,
    };
  } catch (e) {
    message = "Error in fetching cafes";
    if (location) {
      message += ` for location ${location}`;
    }
    error = true;
    return {
      data: [],
      message,
      error,
    };
  }
}
//Add cafe to the database
async function create(name, description, location, logo) {
  let message = "Error in creating cafe";
  let error = true;
  try {
    let myQueryString = `INSERT INTO cafe`;
    if (logo) {
      myQueryString += `(name, description, logo, location) `;
    } else {
      myQueryString += `(name, description, location) `;
    }
    myQueryString += `VALUES`;
    if (logo) {
      myQueryString += `('${name}', '${description}', '${logo}', '${location}') `;
    } else {
      myQueryString += `('${name}', '${description}', '${location}') `;
    }
    const result = await db.query(myQueryString);

    if (result.affectedRows) {
      message = "Cafe created successfully";
      error = false;
    }

    return { message, error };
  } catch (e) {
    message = "Error in creating cafe";
    error = true;
    return { message, error };
  }
}
//Update cafe in the database
async function update(id, name, description, location, logo) {
  let message = "Error in updating cafe";
  let error = true;
  try {
    let myQueryString = `UPDATE cafe SET name="${name}", description="${description}", location="${location}" `;
    if (logo) {
      myQueryString += `, logo="${logo}" `;
    }
    myQueryString += `WHERE id="${id}"`;
    const result = await db.query(myQueryString);

    if (result.affectedRows) {
      message = "Cafe updated successfully";
      error = false;
    }

    return { message, error };
  } catch (e) {
    message = "Error in updating cafe";
    error = true;
    return { message, error };
  }
}

//Remove cafe from teh database
async function remove(id) {
  let message = "Error in deleting cafe";
  let error = true;
  try {
    //Remove records from cafe_employee relation to avoid foreign key constraint
    const getEmpIds = await getCafesEmployee(id);
    if (getEmpIds?.length > 0) {
      // const result_rel = await db.query(
      //   `UPDATE cafe_employee SET status=0 WHERE id IN (${getEmpIds?.map(
      //     (v) => v.id
      //   )})`
      // );
      const result_rel = await db.query(
        `DELETE FROM cafe_employee WHERE id IN (${getEmpIds?.map((v) => v.id)})`
      );

      message = "Error in deleting cafe employees";
      error = true;
      if (result_rel.affectedRows) {
        //Remove records from employee to avoid foreign key constraint
        const empIds = getEmpIds?.map((v) => `"${v.employee_id}"`);
        // const result_rel = await db.query(
        //   `UPDATE employee SET status=0 WHERE id IN (${empIds})`
        // );
        const result_rel = await db.query(
          `DELETE FROM employee WHERE id IN (${empIds})`
        );
        if (result_rel.affectedRows) {
          message = "Cafe and their employees deleted successfully";
          error = false;
        }
      }
    }
    // const result = await db.query(`UPDATE cafe SET status=0 WHERE id='${id}'`);
    //Now remove cafe
    const result = await db.query(`DELETE FROM cafe WHERE id='${id}'`);
    if (result.affectedRows) {
      message = "Cafe deleted successfully";
      error = false;
    }

    return { message, error };
  } catch (e) {
    message = "Error in deleting cafe";
    error = true;
    return { message, error };
  }
}

module.exports = {
  getMultiple,
  create,
  update,
  remove,
};
