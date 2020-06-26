function getEvents(postalCode) {
  $.ajax({
    type: "GET",
    url: `https://app.ticketmaster.com/discovery/v2/events.json?postalCode=${postalCode}&apikey=mgGYhJmrQbdbHaS2VSJ64uPc22XWZxGs`,
    async: true,
    dataType: "json",
    success: updateEvents,
    error: function (xhr, status, err) {
      console.log(err);
    }
  });
}
function updateEvents(result) {
  const p = document.querySelector("p");
  const div = document.querySelector('.events');
  const map = document.querySelector('#map');
  const flexB = document.querySelector(".flexB-1");

  console.log(result);
  if(!result._embedded){
    flexB.classList.remove("b-color");
    div.textContent = "";
    p.className = "";
    map.className = "none";
    console.log("sadasdas");
    return;
  }
  map.className = "";
  p.className = "none";
  let locations = [];

  var events = result._embedded.events;
  div.textContent = "";
  let set = new Set();

  for (let i = 0; i < events.length; i++) {
    let venue = events[i]._embedded.venues[0];

    if(!set.has(venue.name)){
      let location = [venue.name, venue.location.latitude, venue.location.longitude];
      locations.push(location);
      set.add(venue.name);
    }

    let performerName = events[i].name;
    const p = document.createElement('p');
    let eventYoutubeAnchor = document.createElement('a');
    let eventYoutubeHref = result._embedded.events[i].url;
    eventYoutubeAnchor.href = eventYoutubeHref;
    eventYoutubeAnchor.innerText = `${performerName} - ${venue.name}`;
    eventYoutubeAnchor.target = "_blank";
    p.appendChild(eventYoutubeAnchor);
    div.appendChild(p);
  }
  initMap(locations);
  flexB.classList.add("b-color");
}

function handleSubmit(event) {
  event.preventDefault();
  var formData = new FormData(event.target);
  var postalCode = formData.get("postalCode");

  getEvents(postalCode);
  event.target.reset();
}

document.querySelector('form').addEventListener("submit", handleSubmit);

function initMap(locations) {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: new google.maps.LatLng(-33.92, 151.25),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  var bounds = new google.maps.LatLngBounds();
  var infowindow = new google.maps.InfoWindow();

  var marker, i;

  if(locations){
    for (i = 0; i < locations.length; i++) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map,
        label: locations[i][0]
      });

      bounds.extend(marker.position);

      google.maps.event.addListener(marker, 'click', (function (marker, i) {
        map.setZoom(14);
        map.setCenter(marker.getPosition());
        return function () {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
        }
      })(marker, i));
    }
    map.fitBounds(bounds);
  }
}
