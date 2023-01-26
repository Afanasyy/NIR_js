const express = require("express");
const app = express();
const port = 3000;

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("db3.db");

app.use(express.static("public"));

var data_data;
var data_s;

function convertCord(str){
  tt=str.split(", ")          
  tt[0]=parseFloat(tt[0])
  tt[1]=parseFloat(tt[1])
  return tt;
}

app.get("/getSelectorSol",(req,res)=>{
  db.all("SELECT name FROM sqlite_master WHERE type='table' and name != 'schools' and name != 'final' ORDER BY name",(err,rows)=>{    
    db.all("SELECT id, cord, addr FROM final", (err, row) => {
      data_data = row;
      for(i of data_data) i["cord"]=convertCord(i["cord"])
    })
    res.send(rows) 
  })   
  
})

app.get("/getConstHouses",(req,res)=>{
  db.all("SELECT* FROM zero",(err,rows)=> {
    let r=[]
    for(i of rows){
      r.push([data_data[i["idh"]]["cord"],data_data[i["idh"]]["addr"]])
    }
    res.send(r);
  })
})

app.get("/getSelectorSch",(req,res)=>{
  db.all("SELECT* FROM schools", (err, rows) => {
   data_s=rows;
   for(i of data_s) i["cord"]=convertCord(i["cord"]);   
   res.send(data_s);
  })
})

app.get("/get",(req,res)=>{
  let ans=req.query["ans"]
  let school=req.query["sch"]
  let test
  for (i of data_s) if (i["id"] == school) test = i;

  db.all(`SELECT* FROM ${ans}`, (err, rows) => {
    let r=[]
    for(i of rows){
      if(i["ids"]==school){
        let tmp=parseInt(i["idh"])
        r.push([data_data[tmp]["cord"], data_data[tmp]["addr"], i["child"]])
      }
    }
    res.send({ sch1: test, houses: r})
})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
