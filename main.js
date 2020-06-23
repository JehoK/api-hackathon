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
  var div = document.querySelector('.events');
  var events = result._embedded.events;
  for (let i = 0; i < events.length; i++) {

    var performerName = events[i].name;
    var p = document.createElement('p');
    var eventYoutubeAnchor = document.createElement('a');
    var eventYoutubeHref = 'https://www.youtube.com/results?search_query=' + performerName;
    eventYoutubeAnchor.href = eventYoutubeHref;
    eventYoutubeAnchor.innerText = performerName;
    eventYoutubeAnchor.target = "_blank";
    p.appendChild(eventYoutubeAnchor);
    div.appendChild(p);
  }

}

function handleSubmit(event) {
  event.preventDefault();
  var formData = new FormData(event.target);
  var postalCode = formData.get("postalCode");
  getEvents(postalCode);
}

document.querySelector('form').addEventListener("submit", handleSubmit);


$.ajax({
  method: "GET",
  url: "https://app.ticketmaster.com/discovery/v2/events.json?apikey=mgGYhJmrQbdbHaS2VSJ64uPc22XWZxGs",
  data: {
    postalCode:"78704",
    countryCode:"US"
  },
  success: function (data) {
    console.log(data)
  },
  error: function (data) {
    console.error(data);
  }
})
