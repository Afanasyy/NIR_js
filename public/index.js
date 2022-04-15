ymaps.ready(init)

function init() {
  map.push(new ymaps.Map('map', {  
      center:cord[0]['sch1'][0],        
      zoom: 13,
      controls: []
  }));
  constHouses.push(new ymaps.GeoObjectCollection({}, {}));
  dynamic.push(new ymaps.GeoObjectCollection({}, {})); 
  schools.push(new ymaps.GeoObjectCollection({}, {}));    
}

ymaps.ready(init2)

function init2() {
  map.push(new ymaps.Map('map2', {  
      center:cord[0]['sch1'][0],        
      zoom: 13,
      controls: []
  }));  
  constHouses.push(new ymaps.GeoObjectCollection({}, {}));
  dynamic.push(new ymaps.GeoObjectCollection({}, {})); 
  schools.push(new ymaps.GeoObjectCollection({}, {}));   
  setConstMarkers();
}

function switcher(){  
  let id =switcher.caller.arguments[0].path[1].className
  let t=document.getElementsByClassName(id)[0];
  let tt=t["children"][0]["checked"];
  let tmp
  if(id[id.length-1]=='2')
  tmp=1
  else
  tmp=0  
  if(tt)
    constHouses[tmp].options.set('visible', true);
  else
  constHouses[tmp].options.set('visible', false);
}

function httpGetAsync(theUrl, callback) {
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  };
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

var cord = [{
  sch1: [[56.302523, 44.017373]],
  houses: [],  
},{
  sch1: [[56.302523, 44.017373]],
  houses: [],  
}];
var const_cord={h:[], s:[]};

var map=[], constHouses=[], dynamic=[], schools=[];

var school=["",""], solution=["",""]

function funonload(){  
  httpGetAsync("/getSelectorSol",(g)=>{
    let sel = document.getElementById("ans");
    let sel2 = document.getElementById("ans2");
    test=JSON.parse(g)
    sel.size=4
    sel2.size=4
    for (i of test) {
      if(i["name"]=='ans_4'||i["name"]=='ans_6'||i["name"]=='ans_7'||i["name"]=='ans_8'){
      let tmp = document.createElement("option");   
      let tmp2 = document.createElement("option");    
      tmp.value = i["name"];
      tmp2.value = i["name"];
      let t=i["name"];     
      if(t=='ans_1') t='Алг. №1; без огр.; не уч. детей'
      else if(t=='ans_2') t='Алг №1; без огр.; уч. детей' 
      else if(t=='ans_3') t='Алг. №2; без огр.'
      else if(t=='ans_4') t='Алгоритм №1'
      else if(t=='ans_5') t='Алг. №1; с огр.; уч. детей'
      else if(t=='ans_6') t='Алгоритм №2'
      else if(t=='ans_7') t='нач. распр. алг. №1'
      else if(t=='ans_8') t='нач. распр. алг. №2'  
      tmp.label = t;
      tmp2.label = t;
      sel.append(tmp);
      sel2.append(tmp2);
    }}
      httpGetAsync("/getConstHouses",(q)=>{
        const_cord["h"]=JSON.parse(q);
      })
  });
  httpGetAsync("/getSelectorSch",(g)=>{
    let sel = document.getElementById("schs");
    let sel2 = document.getElementById("schs2");
    test=JSON.parse(g)    
    const_cord["s"]=test;
    sel.size=test.length
    sel2.size=test.length
    for (i of test) {
      let tmp = document.createElement("option");
      let tmp2 = document.createElement("option");
      tmp.value = i["id"];
      tmp.label = i["name"];
      tmp2.value = i["id"];
      tmp2.label = i["name"];
      sel.append(tmp);      
      sel2.append(tmp2);
    }    
  })
  
}

function changeAns(){
  let id =changeAns.caller.arguments[0].currentTarget.id
  let sol = document.getElementById(id);
  let selectedOption = sol.options[sol.selectedIndex];
  let t
  if(id[id.length-1]=='2')
  t=1
  else
  t=0
    solution[t] = selectedOption.value;  
    if(school[t]!=""&&solution[t]!="")
  httpGetAsync(`/get?ans=${solution[t]}&sch=${school[t]}`,(cb)=>{
    cord[t]=JSON.parse(cb);
    setNewMarkers(t);
  })
}

function changeSch(){
  let id =changeSch.caller.arguments[0].currentTarget.id
  let sol = document.getElementById(id);
  let selectedOption = sol.options[sol.selectedIndex];
  let t
  if(id[id.length-1]=='2')
    t=1  
  else
    t=0    
    school[t] = selectedOption.value;
  if(school[t]!=""&&solution[t]!="")
  httpGetAsync(`/get?ans=${solution[t]}&sch=${school[t]}`,(cb)=>{
    cord[t]=JSON.parse(cb);
    setNewMarkers(t);
  })
}

function setConstMarkers(){   
for(i of const_cord["h"]){
  constHouses[0].add(new ymaps.Placemark(i[0],   
    {hintContent:i[1]},    
  {iconLayout: createChipsLayout('const_house')}
));
constHouses[1].add(new ymaps.Placemark(i[0],   
  {hintContent:i[1]},    
{iconLayout: createChipsLayout('const_house')}
));
}
for(i of const_cord["s"]){
  schools[0].add(new ymaps.Placemark(i["cord"],   
    {hintContent:i["name"],
    iconContent: 'Метка',
    balloonContent: i["addr"]+'</br>Ограничение = '+i["limit1"]},    
  {iconLayout: createChipsLayout('otherSchool')}
));
schools[1].add(new ymaps.Placemark(i["cord"],   
    {hintContent:i["name"],
    iconContent: 'Метка',
    balloonContent: i["addr"]+'</br>Ограничение = '+i["limit1"]},    
  {iconLayout: createChipsLayout('otherSchool')}
));
}
map[0].geoObjects.add(constHouses[0]);
map[1].geoObjects.add(constHouses[1]);
constHouses[0].options.set('visible', false);
constHouses[1].options.set('visible', false);
map[0].geoObjects.add(schools[0]);
map[1].geoObjects.add(schools[1]);
}

function createChipsLayout(el) {
      var Chips = ymaps.templateLayoutFactory.createClass(
          '<div class="'+el+'"></div>',
          {
              build: function () {
                  Chips.superclass.build.call(this);                 
                  var options = this.getData().options,
                      size = 8,
                      element = this.getParentElement().getElementsByClassName(el)[0],
                      circleShape = {type: 'Circle', coordinates: [0, 0], radius: size / 2};
                  element.style.width = element.style.height = size + 'px';
                  element.style.marginLeft = element.style.marginTop = -size / 2 + 'px';
                  options.set('shape', circleShape);
              }
          }
      );
  
      return Chips;
  };

function setNewMarkers(id){ 
  let t=id
  map[t].panTo(cord[t]['sch1']["cord"],16);
  dynamic[t].removeAll();
  for (i in cord[t]){
    if(i=='sch1'){
      dynamic[t].add(new ymaps.Placemark(cord[t][i]["cord"],   
        {hintContent: cord[t][i]["name"],
        balloonContent: cord[t][i]["addr"]+'</br>Ограничение = '+cord[t][i]["limit1"]},    
      {iconLayout: createChipsLayout('school')}
    ))
    }else{
      for(j of cord[t][i]){
        dynamic[t].add(new ymaps.Placemark(j[0],   
        {hintContent:j[1]+'</br>'+j[2]},    
      {iconLayout: createChipsLayout('house')}
    ))
    }}
  }
  map[t].geoObjects.add(dynamic[t]);
}  






