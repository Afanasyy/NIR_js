const express = require("express");
const app = express();
const port = 3000;

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("db.db");

app.use(express.static("public"));

var data_s;
var schools = [];
db.all("SELECT* FROM schools", (err, rows) => {
  if (err) console.log(err);
  data_s = rows;
  for (i of data_s) {
    let tmp = i["cord"].split(", ");
    for (j in tmp) tmp[j] = parseFloat(tmp[j]);
    tmp.push(i["name"]);
    tmp.push(i["addr"]);
    schools.push(tmp);
  }
});

var data_ans;

db.all("SELECT* FROM ans_1", (err, rows) => {
  data_ans = rows;
});

var data_data;

db.all("SELECT id, lat, lon, addr FROM final", (err, rows) => {
  data_data = rows;
});

app.get("/getSch", function (req, res) {
  console.log(req.query);
  let test, lost;
  for (i of data_s) if (i["id"] == req.query.sch) test = i;
  let cord = test["cord"].split(", ");
  for (i in cord) cord[i] = parseFloat(cord[i]);
  cord.push(test["name"]);
  cord.push(test["addr"]);
  let arr_h = [];
  for (i of data_ans) {
    if (i["ids"] == req.query.sch) {
      console.log(i);
      console.log([
        data_data[parseInt(i["idh"]) - 1]["lat"],
        data_data[parseInt(i["idh"]) - 1]["lon"],
      ]);
      arr_h.push([
        data_data[parseInt(i["idh"]) - 1]["lat"],
        data_data[parseInt(i["idh"]) - 1]["lon"],
        i["child"],
        data_data[parseInt(i["idh"]) - 1]["addr"],
      ]);
    }
  }
  let ans = { sch1: cord, houses: arr_h, sch: schools };
  console.log(ans);
  res.send(ans);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
