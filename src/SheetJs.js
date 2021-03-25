const fs = require("fs");
const _ = require("lodash");
const XLSX = require("xlsx");

// // // const workbook = XLSX.readFile("RBT_bonificaciones mayo.xlsx");
// // const workbook = XLSX.readFile("./input/Acuerdos Pendientes 28.05.xlsx");
// // // const workbook = XLSX.readFile("Test.xlsx");

// // const first_sheet_name = workbook.SheetNames[0];

// // var address_of_cell = "A1";

// // /* Get worksheet */
// // const worksheet = workbook.Sheets[first_sheet_name];

// // /* Find desired cell */
// // var desired_cell = worksheet[address_of_cell];

// // /* Get the value */
// // var desired_value = desired_cell ? desired_cell.v : undefined;

// // console.log(desired_value);

var workbooks = {};

function readFile(path) {
  // check if file exists and read it.
  let workbook = workbooks[path];
  if (!workbook) {
    if (!fs.existsSync(path)) {
      throw Error("The file does not exist.");
    }

    workbook = workbooks[path] = XLSX.readFile(path);
  }

  return workbook;
}

function getSheet(workbook, sheet) {
  // check if sheet exists
  if (!_.includes(workbook.SheetNames, sheet)) {
    throw Error("The sheet does not exist.");
  }

  let worksheet = workbook.Sheets[sheet];

  return worksheet;
}

// function getItem(worksheet, row) {
//   // quick negative row index validation
//   if (row < 1) {
//     throw Error("Row index not valid.");
//   }

//   let data = XLSX.utils.sheet_to_json(worksheet);

//   console.log(data);

//   // check if row exist
//   if (!data.length < row - 1) {
//     throw Error("The row does not exist.");
//   }

//   const item = data[row - 1];

//   return item;
// }

// var dir = "./files";

// module.exports = {
//   get: (path) => {
//     const workbook = readFile(dir + "/" + path.split("/")[0]);
//     const worksheet = getSheet(workbook, path.split("/")[1]);
//     let item = getItem(worksheet, path.split("/")[2]);

//     // check if column exist
//     if (!_.has(item, path.split("/")[3])) {
//       throw Error("The column does not exist.");
//     }

//     return item[path.split("/")[3]];
//   },
//   set: (path, value) => {
//     const workbook = readFile(dir + "/" + path.split("/")[0]);
//     // const worksheet = getSheet(workbook, path.split("/")[1]);
//     // let item = getItem(worksheet, path.split("/")[2]);

//     // let data = XLSX.utils.sheet_to_json(worksheet);
//     // workbook.Sheets[path.split("/")[1]] = XLSX.utils.json_to_sheet(data);

//     // workbook.Sheets[path.split("/")[1]] = worksheet;
//     // XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

//     // var x = _.extendWith(worksheet[XLSX.utils.encode_cell({ c: 0, r: 0 })], {
//     //   v: "jaja",
//     // });

//     // worksheet[XLSX.utils.encode_cell({ c: 0, r: 0 })].v = "jeje";
//     // console.log(worksheet[XLSX.utils.encode_cell({ c: 0, r: 0 })]);

//     // /* make worksheet */
//     // var ws_data = [
//     //   ["S", "h", "e", "e", "t", "J", "S"],
//     //   [1, 2, 3, 4, 5],
//     // ];
//     // var ws = XLSX.utils.aoa_to_sheet(ws_data);

//     // /* Add the worksheet to the workbook */
//     // XLSX.utils.book_append_sheet(workbook, ws, "Nuevo");

//     // console.log(workbook.SheetNames);

//     // /* output format determined by filename */
//     // /* at this point, out.xlsb is a file that you can distribute */
//     XLSX.writeFile(workbook, "out.xlsx"); // .xlsb
//   },
//   save: () => {},
// };
//

//
//
//
//
//
//
//
//
//
//
//


//
//
//
//
//
//
//

module.exports = {
  clear: () => {
    workbooks = {};
  },
  get: (path, sheetName) => {
    const book = readFile(path);
    const sheet = getSheet(book, sheetName);
    return XLSX.utils.sheet_to_json(sheet, { raw: true });
  },
  set: (path, sheetName, data) => {
    let book = workbooks[path];

    if (!book) {
      if (fs.existsSync(path)) {
        book = XLSX.readFile(path);
      }

      if (!book) {
        book = XLSX.utils.book_new();
      }

      workbooks[path] = book;
    }

    if (_.includes(book.SheetNames, sheetName)) {
      book.SheetNames = _.filter(book.SheetNames, (name) => {
        sheetName !== name;
      });
      book.Sheets = _.filter(book.Sheets, (name) => {
        sheetName !== name;
      });
    }

    XLSX.utils.book_append_sheet(
      book,
      XLSX.utils.json_to_sheet(data, { raw: false }),
      sheetName
    );

    XLSX.writeFile(book, path);
  }
};