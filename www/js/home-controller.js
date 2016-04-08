//11May15: Need to optimize here!

app.controller('HomeCtrl', function ($rootScope, $scope, $q, $timeout, RoomService, AppConfigService, MaskFac, $cordovaNetwork, $ionicPopup, $ionicFilterBar, $ionicScrollDelegate) {
    document.addEventListener('deviceready', function () {
      // listen for Online event
      $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
        prepareFilter();
      });

    }, false);

    prepareFilter();

    function prepareFilter() {

      MaskFac.loadingMask(true, 'Loading');

      AppConfigService.prepareFilter().then(function() {

        AppConfigService.hasFilter().then(function (isFilter) {
          $scope.canToggleFilter = isFilter;
          $scope.filterOn = isFilter;
          toggleFilterFn(isFilter);
        });

        getAllRooms();

      }, function(errRes){
        MaskFac.loadingMask(false);
        MaskFac.showMask(MaskFac.error, 'Loading available sites and floors failed');
      });
    }

    $scope.rooms = [];
    var imageUrl = null;

    setImage().then(function (res) {
      imageUrl = res;
    });

    $scope.filterOn = false;
    $scope.canToggleFilter = false;
    $scope.filterFn = null;
    function showAllRooms() {
      return true;
    }

    function showFilteredRooms(room) {
      return AppConfigService.isFilterCriteriaMet(room.siteId, room.floorName);
    }

    function toggleFilterFn(filterOn) {
      if (filterOn) {
        $scope.filterFn = showFilteredRooms;
      } else {
        $scope.filterFn = showAllRooms;
      }
    }

    $scope.filterClick = function () {
      if ($scope.canToggleFilter) {
        $scope.filterOn = !$scope.filterOn;
        toggleFilterFn($scope.filterOn);
        $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
      } else {
        MaskFac.showMask(MaskFac.warning, "Filter not applied. Please go to App Settings");
      }
    };

    $scope.loadRooms = function () {
      getAllRooms();
    };

    function getAllRooms() {
      MaskFac.loadingMask(true, 'Loading');
      RoomService.getAllRooms()
        .then(function (res) {
          $scope.rooms = res; //load rooms and entry

          if($scope.rooms.length > 0) {
            // Show this text when no room is found
            $scope.searchResult = 'No Results';
          }

          MaskFac.loadingMask(false);
        }, function (errRes) {
          MaskFac.loadingMask(false);
          MaskFac.showMask(MaskFac.error, 'Loading rooms failed');
        });
    }

    var filterBarInstance;

    $scope.showFilterBar = function () {
      filterBarInstance = $ionicFilterBar.show({
        items: $scope.rooms,
        update: function(filteredItems, filterText) {
            $scope.rooms = filteredItems;
        }
      });
    };

    //check if room has filter
    AppConfigService.hasFilter().then(function (isFilter) {
      $scope.canToggleFilter = isFilter;
      $scope.filterOn = isFilter;
      toggleFilterFn(isFilter);
    });

    //***
    $scope.roomCss = function (status) {
      return RoomService.getRoomCss(status);
    };

    $scope.getImage = function (siteID, path) {
      if (imageUrl) {
        if (siteID && path) {
          return imageUrl + '/' + siteID + '/' + path;
        } else {
          return './img/noimageavailable.png';
        }
      }
      else {
        return '';
      }
    };
    /*$scope.$watch('imageUrl',function(nv){
     console.log('scope.imageUrl is->' + nv)
     });*/
    var t = null;

    function setImage() {
      var def = $q.defer();
      RoomService.getImageUrl().then(function (res) {
        console.log('set ->' + res);
        if (t)
          $timeout.cancel(t);
        imageUrl = res;
        def.resolve(res);
      }, function () {
        console.log('rejected!');
        t = $timeout(function () {
          setImage();
        }, 500);
      });
      return def.promise;
    }

  })
  .controller('HomeRoomScheduleCtrl', function ($rootScope, $scope, $state, $stateParams, $window, $timeout, AppService,
                                                $ionicActionSheet, $ionicPopup, RoomService, MaskFac, $ionicScrollDelegate, $cordovaNetwork) {

    document.addEventListener('deviceready', function () {
      // listen for Online event
      $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
        getRoomInfo();
      });

    }, false);

    $scope.param = $stateParams.param;

    $scope.imageUrl = "";
    //get image Url
    var imageUrl = null;

    RoomService.getImageUrl().then(function (res) {
      //$scope.imageUrl = res;
      imageUrl = res;
    });

    $scope.room = {};
    $scope.reserve = {des: ""};
    $scope.validatedClass = "assertive";


    //get room info
    getRoomInfo();

    function getRoomInfo() {
      MaskFac.loadingMask(true, 'Loading');
      RoomService.getRoomInfo($stateParams.param).then(function (res) {
        // roomDetails() obj
        if (res) {
          $scope.room = res;
          MaskFac.loadingMask(false);
        } else {
          MaskFac.showMask(MaskFac.warning, 'No scheduled slots are available');
        }
      }, function (errRes) {
        MaskFac.loadingMask(false);
        MaskFac.showMask(MaskFac.error, 'Loading available time slots failed');
      });
    }

    $scope.goToRooms = function () {
      $state.go('tab.home');
    };

    // roomDetails() obj
    $scope.getImage = function (siteID, path) {
      if (imageUrl) {
        if (siteID && path) {
          return imageUrl + '/' + siteID + '/' + path;
        } else {
          return './img/noimageavailable.png';
        }
      }
      else {
        return '';
      }
    };

    $scope.fullScreen=function(url){
      MaskFac.imageMask(url);
    };

    $scope.roomCss = function (status) {
      return RoomService.getRoomCss(status);
    };

    $scope.validated = false;

    //watch room.slots
    $scope.$watch('room', function (nv) {
      if (nv) {
        var isChecked = false;
        //console.log(JSON.stringify(nv));

        angular.forEach(nv.slots, function (s) {
          if (s.checked) {
            isChecked = true;
          }
        });

        if (!isChecked) {
          $scope.validated = false;
          $scope.validatedClass = "assertive";
        }
        else
          $scope.validated = true;
        $scope.validatedClass = "";

      }
    }, true);

    $scope.lstSelected = [];

    $scope.selectTimeSlot = function (slot, slots) {
      if ($scope.lstSelected.length == 1) {
        $scope.lstSelected.push(slot);
        //console.log($scope.lstSelected);
        groupSlots(slots, $scope.lstSelected[0], $scope.lstSelected[1]);

      } else {
        //restart
        $scope.lstSelected = [];
        /*angular.forEach($scope.lstSelected,function(s){                                                                                                                s.selected=false                                                                                       });*/
        //console.log('lstSelected== 2, restart');
        $scope.lstSelected.push(slot);
        //console.log('restart, push slot');
        groupSlots(slots, $scope.lstSelected[0], $scope.lstSelected[1] ? $scope.lstSelected[1] : null);
      }

      console.log(slot);
    };

    //algo to verify valid date range is selected
    function groupSlots(allSlots, _first, _second) {
      var myFirst, mySecond;
      var lstSelected = [];//reset lstSelected
      //console.log('in group slots');
      if (_first && _second) {
        //console.log('first && second exist');
        //start sorting which is start which is end
        //check in between slots
        var f1 = parseInt(_first.originalStart.replace(/([A-Za-z])/g, '').replace(":", ""));
        var f2 = parseInt(_second.originalStart.replace(/([A-Za-z])/g, '').replace(":", ""));
        if (f1 > f2) {
          //console.log('first > second ' + f1 + '>' + f2);
          myFirst = f2;
          mySecond = f1;
        } else {
          //console.log('first < second ');
          myFirst = f1;
          mySecond = f2;
        }

        for (var i = 0; i < allSlots.length; i++) {
          var sNum = parseInt(allSlots[i].originalStart.replace(/([A-Za-z])/g, '').replace(":", ""));

          if (sNum >= myFirst && sNum <= mySecond) {
            if (allSlots[i].status == 'vacant') {
              //console.log({sNUmIs:sNum, myFNum:myFirst, mySNum:mySecond});
              allSlots[i].checked = true;
              lstSelected.push(allSlots[i]);
            } else {
              //erase all
              angular.forEach(allSlots,function(s){
                if (s != _first) {
                  s.checked = false;
                }
              });


              lstSelected = [];
              //exit
              break;
            }
          }
          else {
            allSlots[i].checked = false;
          }
        }
      } else {
        //console.log('not all exist, erase slots');
        lstSelected = [];
        //reset
        angular.forEach(allSlots, function (s) {
          if (_first && s.originalStart == _first.originalStart) {
            s.checked = true;
            lstSelected.push(s);
          } else {
            s.checked = false;
          }
        });

      }
    }

    //==show time slot which user selected
    function formatTime(_t) {
      var t = new Date(_t);
      return pad(t.getHours(), 2) + ":" + pad(t.getMinutes(), 2);
    }

    function pad(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    function formatedDate() {
      var d = new Date();
      return pad(d.getDate(), 2) + "-" + pad((d.getMonth() + 1), 2) + "-" + d.getFullYear() + " (today)";
    }


    function getTodayDate() {
      //yyyy-mm-dd
      var d = new Date();
      return d.getFullYear() + "-" + pad((d.getMonth() + 1), 2) + "-" + pad(d.getDate(), 2);
    }

    //==end

    $scope.reserve = function (id, name, slots) {

      var mypopup = null;
      try {
        cordova.plugins.Keyboard.disableScroll(false);
      }catch(err){}

      var useSlot = RoomService.formatSlotDisplay(slots);
      //$scope.regex = /^[ A-Za-z0-9_@\/\\.,#&$%@():!+-]*$/;
      //Lara 11Feb16: http://stackoverflow.com/questions/1444666/regular-expression-to-match-all-characters-on-a-u-s-keyboard
      $scope.regex=/^[\x20-\x7F]*$/;

      //Lara 11Feb16: Added regex on input as btoa will fail.
      mypopup = $ionicPopup.show({
        template: 'Room: <b>' + name + '</b><br>Date: <b>' + formatedDate() +
        '</b>' + '</b><br>' + useSlot +
        '<br><form name="myForm"><input type="text" placeholder="Subject" name="subject" ng-pattern="regex" ng-model="reserve.desc" required>' +
        '<div field-req ng-show="myForm.subject.$error.required"></div>'+'<div invalid-char ng-show="myForm.subject.$error.pattern"></div></form>',
        title: 'Confirm Reservation ',
        //subTitle: 'Room: <b>' + name + '</b><br>Date: <b>' + formatedDate() + '</b>'+ '</b><br>' + useSlot,
        //subTitle: 'Please use normal things',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: '<b>Reserve</b>',
            type: 'button-positive',
            onTap: function (e) {
              console.log('!');
              if ($scope.reserve.desc && $scope.reserve.desc != "") {

                console.log('meetingname is->' + $scope.reserve.desc);
                return $scope.reserve.desc;
                //don't allow the user to close unless he enters wifi password
              } else {
                console.log('NO meetingname is->' + $scope.reserve.desc);
                /*console.log('returned!');
                 return $scope.meetingName;*/
                e.preventDefault();
              }
            }
          }
        ]
      });

      mypopup.then(function (res) {
        if (res) {
          MaskFac.loadingMask(true, 'Processing');
          var selectedSlots = [];
          var todayDate = getTodayDate();

          angular.forEach(slots, function (s) {
            if (s.checked) {
              selectedSlots.push({'start': s.start, 'end': s.end});
            }
          });

          var start = selectedSlots[0].start;
          var end = selectedSlots[selectedSlots.length - 1].end;
          var subject = res;

          RoomService.reserveRoom(id, todayDate, start, end, subject)
            .then(function (res) {
              MaskFac.loadingMask(false);
              MaskFac.showMask(MaskFac.success, "Reservation successful.");
              //Lara  10Feb16: allow page to show room reserved mask before transitting
              $timeout(function(){
                //go to reservations
                AppService.eventSuccess('room-reserved');
              },1000);

              //go to reservations
              //$state.go('tab.reservation');
            }, function (errRes) {
              MaskFac.showMask(MaskFac.error, "Error reserving room. Please try again");
            });

        } else {
          $scope.reserve.desc = '';
          console.log('not tapped');
        }
      });
    };

    //miscellaneou scope functions

    $scope.showSlotSummary = function (slot, showSummary) {
      /*if(!showSummary)
       return;*/
      if (showSummary === 'vacant') {
        return;
      }
      $scope.selSlot = slot;
      console.log(slot);
      var myPopup = $ionicPopup.show({
        templateUrl: 'slot-summary.html',
        title: 'Slot Information',
        //subTitle: 'Room: <b>' + name + '</b><br>Date: <b>' + formatedDate() + '</b>'+ '</b><br>' + useSlot,
        //subTitle: 'Please use normal things',
        scope: $scope,
        buttons: [
          {text: 'Back'}
        ]
      });
    };

    $scope.exit = function () {
    };
    $scope.crossLaunch = function (to, tel) {

      var url = to + tel;
      console.log('url->' + url);
      var ref = $window.open(url, '_system', 'location=no');
      ref.addEventListener('exit', $scope.exit);
    }
  });
