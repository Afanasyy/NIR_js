const express = require("express");
const app = express();
const port = 3000;

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("db3.db");

app.use(express.static("public"));

var data_ans;
var data_data;
var data_s;
var schools = [];
var data_sol;

app.get("/onLoad",(req,res)=>{
  db.all("SELECT name FROM sqlite_master WHERE type='table' and name != 'schools' and name != 'final' ORDER BY name",(err,rows)=>{
    data_sol=rows;
  })
res.send(data_sol)
})

app.get("/loadSol",(req,res)=>{
  
})

app.get("/onStart", (req, res) => {
  let t = req.query["ans"];
  data_ans = [];
  data_data = [];
  data_s = [];
  schools = [];
  db.all("SELECT* FROM " + t, (err, rows) => {
    data_ans = rows;
  });

  db.all("SELECT id, cord, addr FROM final", (err, rows) => {
    data_data = rows;
  });
  let ans = [];

  db.all("SELECT* FROM schools", (err, rows) => {
    if (err) console.log(err);
    data_s = rows;
    for (i of data_s) {
      let tmp = i["cord"].split(",");
      for (j in tmp) tmp[j] = parseFloat(tmp[j]);
      tmp.push(i["name"]);
      tmp.push(i["addr"]);
      schools.push(tmp);
      ans.push([i["id"], i["name"]]);
    }
    res.send(ans);
  });
});

app.get("/getSch", function (req, res) {
  console.log(req.query);
  let test;
  for (i of data_s) if (i["id"] == req.query.sch) test = i;
  let cord = test["cord"].split(",");
  for (i in cord) cord[i] = parseFloat(cord[i]);
  cord.push(test["name"]);
  cord.push(test["addr"]);
  let arr_h = [];
  for (i of data_ans) {
    if (i["ids"] == req.query.sch) {
      console.log(i);
      tt=data_data[parseInt(i["idh"])]["cord"].split(", ")
      console.log(tt);
      tt[0]=parseFloat(tt[0])
      tt[1]=parseFloat(tt[1])
      arr_h.push([
        tt,
        i["child"],
        data_data[parseInt(i["idh"])]["addr"],
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
