(function(module) {

  var EventView = {};
  var $tatus = $('#status');

  EventView.initEventView = function (callback) {

    $('.page').hide();
    $('.nav-main').show();
    $('#event').show();
    $('#details').show();
    $('#googleAPI').show();
    EventView.triggerMapResize();

    // Generate shareable link
    $('#share-url').val(Event.urlHash);
    $('#share-url ').on('focus', function(){
      this.select();
    });

    // Set listener on admin input submit button
    $('#admin-input').on('submit', Event.handleSubmitComment);

    // Display the event name and user name.
    $('#event-name').text(Event.eventName);
    $('#user-id h4').text(User.userName);

    // Set up the Rsvp status button colors for the current user
    User.getRsvpStatus(function(rsvpStatus){
      console.log('RSVP status is:',rsvpStatus);
      if (rsvpStatus == 1) {
        $tatus.removeClass('blank');
        $tatus.addClass('maybe');
        $tatus.children().text('Maybe');
        $('#status-instructions').remove();
      } else if (rsvpStatus == 2) {
        $tatus.removeClass('blank');
        $tatus.addClass('approve');
        $tatus.children().text('Yep');
        $('#status-instructions').remove();
      } else if(rsvpStatus == -1) {
        $tatus.removeClass('blank');
        $tatus.addClass('disapprove');
        $tatus.children().text('Nope');
        $('#status-instructions').remove();
      }
    });

    // Set listener for Rsvp button
    $tatus.on('click', function() {
      User.updateRsvp(function(result) {
        EventView.updateRsvpButton(result);
      });
    });

    //This function creates a new button and appends it to the nav bar. the a href is given
    //to the cluster section.
    // TODO: figure out out to dynamically make a route, or otherwise show new topic when clicked
    $('#add').on('submit', function(event) {
      event.preventDefault();
      var topic = $('#topic').val().trim();
      if(topic){
        $('#topic').val('');
        console.log('New Topic submitted:',topic);
        // page('event/' + topic, logRoute, Event.initEventPage, function(){
        //   showPage($event);
        //   $('#newClustersHere').append('<section class="page" id="' + topic + '"></section>');
        //   $('#' + topic).show();
        //   TopicView.topicCloudInit(topic);
        //   $('#newClustersHere').append('<div class="page"> <form class="row" action="index.html" method="post"> <input class="u-full-width" type="text" name="word" placeholder="Create Option"> <input class="button-primary u-full-width" type="button" name="submit" value="CREATE"> <input type="text" visibility="hidden" value="lksaf9pwurp2o"> <input type="text" value="we09r20lksjdf"></div>');
        //   $('#googleAPI').hide();
        //   $('.nav-main').show();
        // });
        $('<a href="/event/' + topic + '" class="button button-primary" id="new-topic">' + topic + '<a>').prependTo('#event-navigation');
      }
    });

  };

  EventView.updateRsvpButton = function (newStatus) {
    // TODO: Consider using newStatus instead of toggles?
    if ($tatus.hasClass('blank')) { //If blank -> maybe
      $tatus.toggleClass('blank maybe');
      $tatus.children().text('Maybe');
      $('#status-instructions').remove();
    } else if ($tatus.hasClass('maybe')) { //If maybe -> going
      $tatus.toggleClass('maybe approve');
      $tatus.children().text('Yep');
    } else if ($tatus.hasClass('approve')) { //if going -> not going
      $tatus.toggleClass('approve disapprove');
      $tatus.children().text('Nope');
    } else if ($tatus.hasClass('disapprove')) { //if not going -> blank
      $tatus.toggleClass('disapprove blank');
      $tatus.children().text('Going?');
    }
  };

  //links up with our google maps api and makes initial location over portland
  var map;

  EventView.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: {
        lat: 45.5231,
        lng: -122.6765
      },
    });
    var geocoder = new google.maps.Geocoder();
    $('#submit-event').on('submit', function(event) {
      event.preventDefault();
      geocodeAddress(geocoder, map);
      var address = $('#address').val();
      console.log(address);
    });
  };

  EventView.triggerMapResize = function(){
    if (map){
      google.maps.event.trigger(map, 'resize');
    }
  };

  //allows us to use submission form to input address, this function converts our address to lat & long
  function geocodeAddress(geocoder, resultsMap) {
    var address = $('#address').val();
    geocoder.geocode({
      'address': address
    }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        resultsMap.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  module.EventView = EventView;
})(window);
