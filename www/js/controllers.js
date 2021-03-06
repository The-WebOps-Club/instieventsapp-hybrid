var version = "1.0.0";
var server = "http://litsoc.saarang.org/";
// var server = "http://10.21.209.31:9000/";
var token = window.localStorage['token' + version];

angular.module('starter.controllers',[])

.controller('EventsCtrl', function($scope, loadDetails, $http, $ionicLoading) {

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

   // Request to get all events
    var eventsReq = {
       method: 'GET',
       url: server + 'api/events',
       headers: {
         'Authorization': 'Bearer ' + token,
       }
    };
    $http(eventsReq).then(function(response){
          // console.log(response);
          window.localStorage.setItem('events', response.data);
          $scope.events = response.data;
          loadDetails.addEventSchedule($scope.events);
          // console.log($localStorage.events);
          
          var currentTime = new Date();
          var currentMilli = currentTime.getTime();
          var i;
          for(i=0; $scope.events[i]!== undefined; i++){
            var utc = $scope.events[i].time;
            var utcMilli = Date.parse(utc);
            $scope.events[i].timeDifference = Math.abs(utcMilli - currentMilli);
            // console.log($scope.events[i].timeDifference);
          }
          function compare(a,b) {
            if (a.timeDifference < b.timeDifference)
              return -1;
            if (a.timeDifference > b.timeDifference)
              return 1;
            return 0;
          }

          $scope.events.sort(compare);
          $ionicLoading.hide();


      // console.log($scope.events);
        }, 
        function(response){
            // console.log(response);
            $ionicLoading.hide();

            if (response.status == 401){
            location.replace('login.html');
            $scope.events = events;
            
            var currentTime = new Date();
            var currentMilli = currentTime.getTime();
            var i;
            for(i=0; $scope.events[i]!== undefined; i++){
              var utc = $scope.events[i].time;
              var utcMilli = Date.parse(utc);
              $scope.events[i].timeDifference = Math.abs(utcMilli - currentMilli);
              // console.log($scope.events[i].timeDifference);
            }
              
            function compare(a,b) {
              if (a.timeDifference < b.timeDifference)
                return -1;
              if (a.timeDifference > b.timeDifference)
              return 1;
            return 0;
            }

      $scope.events.sort(compare);
      // console.log($scope.events);
          } else alert(response.data.errors.message);
        });
      
    $scope.isEventDate = function(event){
      if( event.time === null)
        return false;
        
      var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];

      var date = new Date(event.time);
      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();
      var _date = day + ' ' + monthNames[monthIndex] + ' ' + year;

      if(_date!== 'NaN undefined NaN')
        return true;
      else 
        return false;
    };
    
    $scope.isEventTime = function(event){
      if(event.time === null)
        return false;
        
      var date = new Date(event.time);
      var _time = date.getHours() + ":" + date.getMinutes() ;
      // console.log(_time);
      if(_time!== 'NaN:NaN' && _time!== '16:46')
        return true;
      else
        return false;
      
    };
    
    
    $scope.isEventVenue = function(event){
      if( event.venue === '')
        return false;
      
      if(typeof event.venue !== 'undefined')
        return true;
      else  
        return false;
    };
    
    $scope.getEventDate = function(event){
     
      var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];

      var date = new Date(event.time);
      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();

      return (day + ' ' + monthNames[monthIndex] + ' ' + year);
    };
    
    $scope.getEventTime = function(event){
     var date = new Date(event.time);
      var _time;
      var _time24hr = date.getHours();
      var _time12hr = date.getHours()-12 + ":" + date.getMinutes();
      if( _time24hr>12)
        _time = _time12hr+" pm";
      else 
        _time = _time12hr+" am";
      
      return _time;
    };

    $scope.openEvent = function(event){
      loadDetails.addEvent(event);
    };
    
})

.service('loadDetails',function(){
  
  var event = {name:'event not defined'};
  var addEvent = function(newEvent) {
    event = newEvent;
  };
  var getEvent = function(){
    return event;
  };
  
  var events = {name:'events not defined'};
  var addEventSchedule = function(newEvents) {
    events = newEvents;
  };
  var getEventSchedule = function(){
    return events;
  };
  
  var club = [];
  var addClub = function(newClub) {
      club = newClub;
  };
  var getClub = function(){
      return club;
  };
  
  var clubs = [{name:'clubs not defined'}];
  var addClubDetails = function(newClubs) {
      clubs = newClubs;
  };
  var getClubDetails = function(){
      return clubs;
  };
  
  var scorecard = {name:'event not defined'};
  var addScorecard = function(newScorecard) {
    scorecard = newScorecard;
  };
  var getScorecard = function(){
    return scorecard;
  };

  return {
    addEvent: addEvent,
    getEvent: getEvent,
    addEventSchedule: addEventSchedule,
    getEventSchedule: getEventSchedule,
    addClub: addClub,
    getClub: getClub,
    addClubDetails: addClubDetails,
    getClubDetails: getClubDetails,
    addScorecard: addScorecard,
    getScorecard: getScorecard
  };

})

.controller('EventDetailsCtrl', function($scope,loadDetails){
  $scope.event = loadDetails.getEvent();
   $scope.isEventDate = function(time){
      // console.log("iseventdate is being called");
      if( time === null)
        return false;
      var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];

      var date = new Date(time);
      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();
      var _date = day + ' ' + monthNames[monthIndex] + ' ' + year;

      if(_date!== 'NaN undefined NaN')
        return true;
      else
        return false;
    };
    
    $scope.isEventTime = function(time){
      if (( time === null) || (time == undefined) )
        return false;
      var date = new Date(time);
      var _time = date.getHours() + ":" + date.getMinutes() ;
      if(_time!== 'NaN:NaN')
        return true;
      else  
        return true;
      
    };
    
     $scope.isEventVenue = function(venue){
       if( venue === '')
        return false;
      if(typeof venue !== 'undefined')
        return true;
      else  
        return false;
    };
  $scope.getEventDate = function(event){
     
      var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];

      var date = new Date(event.time);
      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();

      return (day + ' ' + monthNames[monthIndex] + ' ' + year);
    };
    
    $scope.getEventTime = function(event){

     var date = new Date(event.time);
      var _time;
      var _time24hr = date.getHours();
      var _time12hr = date.getHours()-12 + ":" + date.getMinutes();
      if( _time24hr>12)
        _time = _time12hr+" pm";
      else 
        _time = _time12hr+" am";
      if (_time == '4:46 pm') _time = "Time shall be announced later";
      return _time;
    };

})


.controller('CalendarCtrl', function($scope,loadDetails) {
  $scope.events = loadDetails.getEventSchedule();
  
    $scope.eventTime = function(time){
      var utcMilli = Date.parse(time);
      return utcMilli;
    };
    
    $scope.currentTime = function(){
      var currentTime = new Date();
      var currentMilli = currentTime.getTime();
      return currentMilli;
    };
    
    $scope.getEventDate = function(event){

      var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];

      var date = new Date(event.time);
      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();

      return (day + ' ' + monthNames[monthIndex] + ' ' + year);
    };
    
    $scope.getEventTime = function(event){
      var date = new Date(event.time);
      var _time;
      var _time24hr = date.getHours();
      var _time12hr = date.getHours()-12 + ":" + date.getMinutes();
      if( _time24hr>12)
        _time = _time12hr+" pm";
      else 
        _time = _time12hr+" am";
      
      return _time;
    };

  
   $scope.openEvent = function(event){
    loadDetails.addEvent(event);
   };
  var type;
  $scope.eventType = function(event){
    if(event.isLitSocEvent) {
        if(event.category === 'lit')
          type = "LitSoc";
    
      else
      
        if(event.category === 'tech')
          type = "TechSoc";
      else
    
        if(event.category === 'schroeter')
          type = "Schroeter";
    }
    else{
     type = event.club.name;
  
    }
  return type;
  };
  
   $scope.getColor = function(event){
    var color;
    if(event.isLitSocEvent) {
        if(event.category === 'lit')
          color = "#74DF00";
    
      else
      
        if(event.category === 'tech')
          color = "#04B4AE";
      else
    
        if(event.category === 'schroeter')
          color = "#FF0080";
    }
    else{
     color = "#01A9DB";
  
    }
  return color;
  };
  
  // $scope.getColor = function(){
  // var color = ['#FF4000', '#74DF00', '#04B4AE', '#B404AE', ''];
  //   return color[Math.floor(Math.random() * color.length)];
  // };
    
})

.controller('ScoreboardCtrl', function($scope, loadDetails,  $http, $ionicLoading) {

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    //Request to load scoreboard    
    var scoreboardReq = {
       method: 'GET',
       url: server + 'api/scoreboards',
       headers: {
         'Authorization': 'Bearer ' + token,
       }
    };
    $http(scoreboardReq).then(function(response){
          console.log(response);
          // console.log(response.data[0].scorecard);
          window.localStorage.setItem('scorecard', response.data[0].scorecard);
          $scope.scorecard = response.data[0].scorecard;
          $scope.scorecard.sort(compare);
          $scope.scorecard[0].position = 1;
          for ( i =1; i < $scope.scorecard.length; i++){
            if ($scope.scorecard[i].score < $scope.scorecard[i-1].score){
                $scope.scorecard[i].position = i + 1;
              } else {
                $scope.scorecard[i].position = $scope.scorecard[i -1].position;
            }
          }
          loadDetails.addScorecard($scope.scorecard);
          $ionicLoading.hide();
          console.log("No position");
        },
       function(response){
          $scope.scorecard = scorecard;
          if (response.status == 401)
            location.replace('login.html');

          // console.log(response);
        });

  
  function compare(a,b) {
    if (a.score > b.score)
      return -1;
    if (a.score < b.score)
      return 1;
    return 0;
  }

  
  $scope.getPosition = function(num){
    // if( $scope.scorecard[num-1]!== undefined){
    //   if( $scope.scorecard[num].score == $scope.scorecard[num-1].score){
    //    $scope.scorecard[num].position = num;
    //    return $scope.scorecard[num-1].position;
    //   }
    //   else{
    //     $scope.scorecard[num].position = num+1;
    //     return num+1;
    //   }
    // }
    // else{
    //   $scope.scorecard[num].position = num+1;
    //   return num+1;
    // }
    return $scope.scorecard[num].position;
  };
  
  
  $scope.getUserColor = function(hostel){
    console.log(hostel);
    if(user.hostel === hostel)
      return '#22D706';
  };
  

})


.controller('ClubsCtrl', function($scope, loadDetails,  $http, $ionicLoading) {

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    // Request to load all clubs
    var clubReq = {
       method: 'GET',
       url: server + 'api/clubs',
       headers: {
         'Authorization': 'Bearer ' + token,
       }
    };
    $http(clubReq).then(function(response){
          // console.log(response);
          window.localStorage.setItem('clubs', response.data);
          // $localStorage.clubs = response.data;
          $scope.clubs = response.data;
          $ionicLoading.hide();
        },
       function(response){
         $scope.clubs = clubs;
         if (response.status == 401)
            location.replace('login.html');
        // console.log(response);
        });

    $scope.openClubDetails = function(club){
  
      loadDetails.addClubDetails(club);
    };
    
    var subscribe = function(check,club){
      club.isSubscribed = check;
      // console.log("subscribe is working");
 
    };
    
})

.controller('ClubDetailsCtrl', function($scope, loadDetails){
   $scope.club = loadDetails.getClubDetails();
  // console.log($scope.club);

   
   $scope.isConvenorsEmpty = function(convenors){
    // console.log(convenors.length);
     if (convenors.length > 0){
       return true;
     } else {
       return false;
     }
     
    // $scope.event = loadDetails.addEvent(event);
   };
});



// .controller('emailCtrl', function($cordovaEmailComposer) {
  
//   $ionicPlatform.ready(function() {
//   $cordovaEmailCimposer.open().then(success, error);
// });
  
//   $scope.sendEmail = function(convenor,club){
//     $scope.clubConvenor = convenor;
//     $scope.clubDetails = club;
//     $cordovaEmailComposer.isAvailable().then(function() {
//     console.log("is available");  
//   // is available
// }, function () {
//   console.log("is not available");
//   // not available
// });

//   var email = {
//     to: $scope.clubConvenor.email,
//     cc: '',
//     bcc: '',
//     // attachments: [
//     //   'file://img/logo.png',
//     //   'res://icon.png',
//     //   'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
//     //   'file://README.pdf'
//     // ],
//     subject: 'Query regarding '+ $scope.clubDetails.name,
//     body: '',
//     isHtml: true
//   };

// $cordovaEmailComposer.open(email).then(null, function () {
//   // user cancelled email
// });
//   };
  
  

// });






