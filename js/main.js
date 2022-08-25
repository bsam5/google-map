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
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
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

// Initialize and add the map
function initAutocomplete() {
  let infowindow = new google.maps.InfoWindow();
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: new google.maps.LatLng(31.52013, 34.433868),
  });
  // icons
  const icons = {
    street: {
      icon: "image/street-icons.jpg",
    },
    harbor: {
      icon: "image/harbor-icons.jpg",
    },
    village: {
      icon: "image/village-icons.jpg",
    },
  };

  // The location
  const features = [
    {
      position: new google.maps.LatLng(31.500995, 34.465566),
      title: 'شارع صلاح الدين',
      img: "image/street.jpg",
      evaluation: 4,
      opened: true,
      type: 'street',
    },
    {
      position: new google.maps.LatLng(31.529335, 34.430762),
      title: "ميناء غزة",
      img: "image/harbor.jpg",
      evaluation: 5,
      opened: false,
      type: 'harbor',
    },
    {
      position: new google.maps.LatLng(31.502312, 34.414764),
      title: "شارع جمال عبد الناصر",
      img: "image/street.jpg",
      evaluation: 3,
      opened: true,
      type: 'street',
    },
    {
      position: new google.maps.LatLng(31.550599, 34.498178),
      title: "بيت لاهيا",
      img: "image/bet-lahya.jpg",
      evaluation: 2,
      opened: true,
      type: 'village',

    },
  ];
  // create marker
  const marker = [];
  for (let i = 0; i < features.length; i++) {
    marker.push(new google.maps.Marker(
      {
        position: features[i].position,
        icon: icons[features[i].type].icon,
        title: features[i].title,
        map: map,
      })
    )
  }

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
  //  add marker to page
  marker.forEach((e) => {
    e.addListener("click", (el) => {
      for (let i = 0; i < features.length; i++) {
        if (e.title === features[i].title) {
          infowindow.setContent(`<div id="content">
            <div id="siteNotice">
            </div>
            <h1 id="firstHeading" class="firstHeading">${features[i].title}</h1>
            <div id="bodyContent">
            <img class="img-place" src="${features[i].img}"/>
            <p>${features[i].title}</p>
            ${checkStar(features[i].evaluation)}
            <div>
            <span class='green point ${features[i].opened ? 'active' : ''}'></span>
            <span class='red point ${features[i].opened ? '' : 'active'}'></span>
            </div></div>
            </div>`,
          );
        }
      }
      infowindow.open({
        anchor: e,
        map,
        shouldFocus: false,
      });
    })
  })

  //  button user location
  btnUesr(map);

  boxSearch(map);
}



window.initAutocomplete = initAutocomplete;
