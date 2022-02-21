function start() {
  let str = document.getElementById("inp").value;
  let sel = document.getElementById("sel");
  httpGetAsync("/onStart?ans=" + str, (test) => {
    sel.innerHTML = "";
    for (i of JSON.parse(test)) {
      let tmp = document.createElement("option");
      tmp.value = i[0];
      tmp.label = i[1];
      sel.append(tmp);
    }
  });
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
  sch1: [56.32318354412199, 44.00106588674056],
  houses: [],
  sch: [],
};

function changeOption() {
  let sel = document.getElementById("sel");
  let selectedOption = sel.options[sel.selectedIndex];
  let school = selectedOption.value;
  httpGetAsync("/getSch?sch=" + school, (test) => {
    cord = JSON.parse(test);
    initMap();
  });
}
// Initialize and add the map
var style = [
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "transit",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
];

var InforObj = [];

function closeOtherInfo() {
  if (InforObj.length > 0) {
    InforObj[0].set("marker", null);
    InforObj[0].close();
    InforObj.length = 0;
  }
}

function initMap() {
  // The location of Uluru
  let uluru = {
    lat: parseFloat(cord["sch1"][0]),
    lng: parseFloat(cord["sch1"][1]),
  };
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: uluru,
  });
  map.setOptions({ styles: style });

  for (i in cord) {
    if (i == "sch1") {
      let contentString = cord["sch1"][3];
      let color = "blue";
      iconOptions = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 6,
        strokeColor: "black",
        strokeOpacity: 0.6,
        strokeWeight: 1.0,
        fillColor: color,
        fillOpacity: 0.6,
      };
      // The marker, positioned at Uluru
      const marker = new google.maps.Marker({
        position: uluru,
        map: map,
        icon: iconOptions,
        label: cord["sch1"][2],
      });
      const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });
      marker.addListener("click", function () {
        closeOtherInfo();
        infowindow.open(map, marker);
        InforObj[0] = infowindow;
      });
    } else if (i == "houses") {
      for (j of cord[i]) {
        let contentString =
          j[2] + "<br>" + "Количесво детей в доме = " + j[1].toString();
        uluru = { lat: parseFloat(j[0][0]), lng: parseFloat(j[0][1]) };
        let color = "red";
        iconOptions = {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 6,
          strokeColor: "black",
          strokeOpacity: 0.6,
          strokeWeight: 1.0,
          fillColor: color,
          fillOpacity: 0.6,
        };
        // The marker, positioned at Uluru
        const marker = new google.maps.Marker({
          position: uluru,
          map: map,
          icon: iconOptions,
        });
        const infowindow = new google.maps.InfoWindow({
          content: contentString,
        });
        marker.addListener("click", function () {
          closeOtherInfo();
          infowindow.open(map, marker);
          InforObj[0] = infowindow;
        });
      }
    } else {
      for (j of cord[i]) {
        if (j[2] != cord["sch1"][2]) {
          let contentString = j[3];
          uluru = { lat: parseFloat(j[0]), lng: parseFloat(j[1]) };
          let color = "green";
          iconOptions = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 6,
            strokeColor: "black",
            strokeOpacity: 0.6,
            strokeWeight: 1.0,
            fillColor: color,
            fillOpacity: 0.6,
          };
          // The marker, positioned at Uluru
          const marker = new google.maps.Marker({
            position: uluru,
            map: map,
            icon: iconOptions,
            label: j[2],
          });
          const infowindow = new google.maps.InfoWindow({
            content: contentString,
          });
          marker.addListener("click", function () {
            closeOtherInfo();
            infowindow.open(map, marker);
            InforObj[0] = infowindow;
          });
        }
      }
    }
  }
}
