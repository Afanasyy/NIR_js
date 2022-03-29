ymaps.ready(init)

var map, constHouses, dynamic, schools;
function funonload(){
  let sel = document.getElementById("sol");
  httpGetAsync("/onLoad",(g)=>{
    sel.innerHTML = "";
    test=JSON.parse(g)
    sel.size=test.length-1
    for (i of test) {
      let tmp = document.createElement("option");
      tmp.value = i["name"];
      let t=i["name"];
      if(t=='ans_0') t='Алг. №2; без огр.'
      else if(t=='ans_1') t='Алг. №1; без огр.; не уч. детей'
      else if(t=='ans_2') t='Алг. №1; без огр.; уч. детей' 
      else if(t=='ans_3') t='Алг. №2; с огр.'
      else if(t=='ans_4') t='Алг. №1; с огр.; не уч. детей'
      else if(t=='ans_5') t='Алг. №1; с огр.; уч. детей'
      else if(t=='ans_6') t='нач. распр. алг. №1; без огр.'
      else if(t=='ans_7') t='нач. распр. алг. №1; с огр.'
      else if(t=='ans_8') t='нач. распр. алг. №2; без огр.'
      else if(t=='ans_9') t='нач. распр. алг. №1; с огр.'
      if(t!='zero'){
      tmp.label = t;
      sel.append(tmp);}}
  });
}

function switcher(){
  let t=document.getElementsByClassName("switch")[0];
  let tt=t["children"][0]["checked"];
  if(tt)
    constHouses.options.set('visible', true);
  else
  constHouses.options.set('visible', false);
}

function start() {
  let sol = document.getElementById("sol");
  let selectedOption = sol.options[sol.selectedIndex];
  let str = selectedOption.value;
  let sel = document.getElementById("sel");
  httpGetAsync("/onStart?ans=" + str, (g) => {
    sel.innerHTML = "";
    test=JSON.parse(g)
    const_cord['h']=test[1];
    const_cord['s']=test[2];
    sel.size=test[0].length
    for (i of test[0]) {
      let tmp = document.createElement("option");
      tmp.value = i[0];
      tmp.label = i[1];
      sel.append(tmp);
    }
    setConstMarkers()
  });
}

function setConstMarkers(){  
  constHouses.removeAll();
  schools.removeAll();
for(i of const_cord["h"]){
  constHouses.add(new ymaps.Placemark(i[0],   
    {hintContent:i[1]},    
  {iconLayout: createChipsLayout('const_house')}
));
}
for(i of const_cord["s"]){
  schools.add(new ymaps.Placemark(i[0],   
    {hintContent:i[1],
    iconContent: 'Метка'},    
  {iconLayout: createChipsLayout('otherSchool')}
));
}
map.geoObjects.add(constHouses);
constHouses.options.set('visible', false);
map.geoObjects.add(schools);
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

var cord = {
  sch1: [[56.32867, 44.00205]],
  houses: [],  
};
var const_cord={h:[], s:[]};

function changeOption() {
  let sel = document.getElementById("sel");
  let selectedOption = sel.options[sel.selectedIndex];
  let school = selectedOption.value;
  httpGetAsync("/getSch?sch=" + school, (test) => {
    cord = JSON.parse(test);
    setNewMarkers();
  });
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

function setNewMarkers(){
  map.panTo(cord['sch1'][0],16);
  dynamic.removeAll();
  for (i in cord){
    if(i=='sch1'){
      dynamic.add(new ymaps.Placemark(cord[i][0],   
        {hintContent: cord[i][1]},    
      {iconLayout: createChipsLayout('school')}
    ))
    }else{
      for(j of cord[i]){
        dynamic.add(new ymaps.Placemark(j[0],   
        {hintContent:j[2]},    
      {iconLayout: createChipsLayout('house')}
    ))
    }}
  }
  map.geoObjects.add(dynamic);
}  

  function init() {
      map = new ymaps.Map('map', {  
          center:cord['sch1'][0],        
          zoom: 16,
          controls: []
      });
      constHouses = new ymaps.GeoObjectCollection({}, {});
      dynamic = new ymaps.GeoObjectCollection({}, {});
      schools = new ymaps.GeoObjectCollection({}, {});
    }