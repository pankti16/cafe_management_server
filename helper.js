//Helper to pass empty array from db result
function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

module.exports = {
  emptyOrRows,
};
