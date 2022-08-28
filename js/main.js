// checkStar

function checkStar(numCheck) {
  let star = "";
  for (let i = 0; i < 5; i++) {
    if (i < numCheck) {
      star += '<span class="fa fa-star checked"></span>';
    } else {
      star += '<span class="fa fa-star"></span>';
    }
  }
  return star;
}

// function button location user
function btnUesr(map) {
  infoWindow = new google.maps.InfoWindow();

  const locationButton = document.createElement("button");

  locationButton.innerHTML = `<i class="fa-solid fa-location-crosshairs fa-lg icon-location"></i>`;
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("your Location");
          infoWindow.open(map);
          map.zoom = 12;
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }
}
// function search box
function boxSearch(map) {
  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}
//   btnType
function btnType(markers) {
  let btnType = document.querySelectorAll('.btn-type .btn');
  btnType.forEach(el => {
    el.onclick = () => {
      markers.forEach((mark) => {
        mark.setVisible(true);
        if (mark.type !== el.getAttribute('data-type')) {
          mark.setVisible(false);
        }
      })
    }
  });
}

// Initialize and add the map
function initAutocomplete() {
  let infowindow = new google.maps.InfoWindow();
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2,
    center: new google.maps.LatLng(31.52013, 34.433868),

  });
  // icons
  const icons = {
    street: {
      icon: "image/street-icons.jpg",
    },
    university: {
      icon: "image/university-icons.jpg",
    },
  };

  // The location
  class mark {
    constructor(lat, lng, title, img, evaluation, opened, type) {
      this.position = new google.maps.LatLng(lat, lng);
      this.title = title || 'unknown';
      this.img = `image/${img}`;
      this.evaluation = evaluation;
      this.opened = opened;
      this.type = type;

    }
  }

  const locations = [
    new mark(31.500995, 34.465566, 'شارع صلاح الدين', 'street.jpg', 4, true, 'street'),
    new mark(31.502312, 34.414764, "شارع جمال عبد الناصر", 'street.jpg', 3, false, 'street'),
    new mark(31.550599, 34.498178, "بيت لاهيا", 'street.jpg', 5, true, 'street'),
    new mark(31.514587, 34.440492, " جامعة الازهر", 'alazhar.jpg', 5, true, 'university'),
    new mark(31.514258, 34.43856, "جامعة الاسلامية", 'islamic.jpg', 5, false, 'university'),
  ]

  let markers = locations.map((locations) => {
    const marker = new google.maps.Marker({
      position: locations.position,
      icon: icons[locations.type].icon,
      title: locations.title,
      type: locations.type,
      map: map,
    });

    marker.addListener("click", () => {
      infoWindow.setContent(`<div id="content">
                 <div id="siteNotice">
                 </div>
                <h1 id="firstHeading" class="firstHeading">${locations.title}</h1>
                <div id="bodyContent">
                <img class="img-place" src="${locations.img}"/>
                <p>${locations.title}</p>
                ${checkStar(locations.evaluation)}
                <div>
                <span class='green point ${locations.opened ? 'active' : ''}'></span>
                <span class='red point ${locations.opened ? '' : 'active'}'></span>
                </div>
                </div>
                 </div>`);
      infoWindow.open(map, marker);
    });
    return marker;
  })

  const markerCluster = new markerClusterer.MarkerClusterer({
    map,
    markers,
    ignoreHidden: true,
  });


  //  button user location
  btnUesr(map);
  //  box search 
  boxSearch(map);
  // btn type
  btnType(markers);

}


window.initAutocomplete = initAutocomplete;
