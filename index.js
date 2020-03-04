const f = require("fs");
const excel = require("excel4node");

const targetNames = ["node1", "node2", "node3", "node4"];
const peerPIDs = ["62110", "62110", "62110", "62110"];
const chaincodePIDs = ["63390", "63390", "63390", "63390"];

const logToExcel = (fileName, getter) => {
  f.readFile(`${fileName}.log`, "utf8", (err, data) => {
    if (err !== null) {
      console.err("fileName is wrong!!");
      process.exit(0);
    }
    const result = data.split(/\ntop/).map(x => getter(x));
    writeToExcel(result, fileName);
  });
};

const getOneData = (peerPID, chaincodePID) => str => {
  const timeStamp = str.match(/(\d{2}:\d{2}:\d{2})/)[1];
  const data = str
    .split("\n")
    .filter(x => x.indexOf(peerPID) !== -1 || x.indexOf(chaincodePID) !== -1)
    .map(x => {
      const temp = x.split(/\s+/);
      return {
        id: temp[12],
        cpu: temp[9],
        mem: temp[10]
      };
    });

  return {
    timeStamp,
    data
  };
};

const writeToExcel = (data, name) => {
  const worksheet = workbook.addWorksheet(name);
  const _data = data || [];
  const header = [
    "TIMESTAMP",
    "TYPE",
    "CPU",
    "MEMORY",
    "TYPE",
    "CPU",
    "MEMORY"
  ];
  header.forEach((x, i) => {
    worksheet.cell(1, i + 1).string(x);
  });
  _data.forEach((x, i) => {
    const currentRow = i + 2;
    worksheet.cell(currentRow, 1).string(x.timeStamp);
    worksheet.cell(currentRow, 2).string(x.data[0].id);
    worksheet.cell(currentRow, 3).string(x.data[0].cpu);
    worksheet.cell(currentRow, 4).string(x.data[0].mem);
    worksheet.cell(currentRow, 5).string(x.data[0].id);
    worksheet.cell(currentRow, 6).string(x.data[1].cpu);
    worksheet.cell(currentRow, 7).string(x.data[1].mem);
  });
  workbook.write("Result.xlsx");
};

const node1Getter = getOneData(peerPIDs[0], chaincodePIDs[0]);
const node2Getter = getOneData(peerPIDs[1], chaincodePIDs[1]);
const node3Getter = getOneData(peerPIDs[2], chaincodePIDs[2]);
const node4Getter = getOneData(peerPIDs[3], chaincodePIDs[3]);
const workbook = new excel.Workbook();

logToExcel(targetNames[0], node1Getter);
logToExcel(targetNames[1], node2Getter);
logToExcel(targetNames[2], node3Getter);
logToExcel(targetNames[3], node4Getter);
