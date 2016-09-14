app.controller('DeskCtrl', function ($rootScope, $scope, $state, $ionicFilterBar, $ionicScrollDelegate, MaskFac) {

  console.log('DeskCtrl');


  //var s = Snap("#svgContainer");
  //
  //Snap.load("img/desk.svg", onSVGLoaded) ;
  //
  //function onSVGLoaded( data ){
  //    s.append(data);
  //
  //    var gs = s.selectAll('rect').items;
  //
  //    gs.forEach(function(rect) {
  //
  //      if(rect.attr('id') && rect.attr('id').indexOf('desk') > -1) {
  //        console.log(rect);
  //
  //
  //        rect['node'].onclick = function (e) {
  //
  //          rect.attr({
  //            fill: "#bada55",
  //            stroke: "#000",
  //            strokeWidth: 5
  //          });
  //        }
  //      }
  //    });
  //}


  //var s = Snap('#svgContainer');
  //
  //Snap.load('img/desk.svg', function (f) {
  //
  //  var layer0 = f.select('#layer');
  //  var original_size = 40;
  //  var hover_size = 24;
  //  var animation_time = 250;
  //
  //  angular.forEach(layer0.selectAll('rect').items, function (rect) {
  //    rect.attr({
  //      origX: rect.attr('x'),
  //      origY: rect.attr('y'),
  //      modX: parseInt(rect.attr('x')) + ((original_size - hover_size) / 2),
  //      modY: parseInt(rect.attr('y')) + ((original_size - hover_size) / 2)
  //    });
  //
  //    rect.click(function() {
  //
  //      rect.animate({
  //        fill: "#bada55",
  //        stroke: "#000",
  //        strokeWidth: 5
  //      }, 1000);
  //
  //      console.log(rect);
  //
  //    });
  //
  //    //rect.mouseover(function () {
  //    //  rect.animate({
  //    //    x: parseInt(rect.attr('modX')),
  //    //    y: parseInt(rect.attr('modY')),
  //    //    width: hover_size,
  //    //    height: hover_size
  //    //  }, animation_time, mina.bounce);
  //    //}).mouseout(function () {
  //    //  rect.stop();
  //    //  rect.animate({
  //    //    x: parseInt(rect.attr('origX')),
  //    //    y: parseInt(rect.attr('origY')),
  //    //    width: original_size,
  //    //    height: original_size
  //    //  }, animation_time * 5, mina.bounce);
  //    //}).click(function () {
  //    //  alert('The RECT with the ID: "' + rect.attr('id') + '", has the style attributes "' + rect.attr('style') + '"');
  //    //});
  //  });
  //
  //  s.append(f);
  //
  //});

  var s1 = Snap('#svgContainer1');

  Snap.load('img/deskplan_l6_nopointer.svg', function (f) {

    var layer0 = f.select('#layer1');
    var original_size = 40;
    var hover_size = 24;
    var animation_time = 250;

    angular.forEach(layer0.selectAll('rect').items, function (rect) {
      rect.attr({
        origX: rect.attr('x'),
        origY: rect.attr('y'),
        modX: parseInt(rect.attr('x')) + ((original_size - hover_size) / 2),
        modY: parseInt(rect.attr('y')) + ((original_size - hover_size) / 2)
      });

      rect.click(function() {

        rect.animate({
          fill: "#bada55",
          stroke: "#000",
          strokeWidth: 5
        }, 1000);

        console.log(rect);

        //alert('DESK ID: "' + rect.attr('id'));

      });


    });

    s1.append(f);

  });

  var s2 = Snap('#svgContainer2');

  Snap.load('img/deskplan_l7_nopointer.svg', function (f) {

    var layer0 = f.select('#layer1');
    var original_size = 40;
    var hover_size = 24;
    var animation_time = 250;

    angular.forEach(layer0.selectAll('rect').items, function (rect) {
      rect.attr({
        origX: rect.attr('x'),
        origY: rect.attr('y'),
        modX: parseInt(rect.attr('x')) + ((original_size - hover_size) / 2),
        modY: parseInt(rect.attr('y')) + ((original_size - hover_size) / 2)
      });

      rect.click(function() {

        rect.animate({
          fill: "#bada55",
          stroke: "#000",
          strokeWidth: 5
        }, 1000);

        //alert('DESK ID: "' + rect.attr('id'));
        console.log(rect);

      });
    });

    s2.append(f);

  });

  $scope.desks = [];

  $scope.loadDesks = function () {
    getAllDesks();
  };

  $scope.filterClick = function () {
    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
  };

  var filterBarInstance;

  $scope.showFilterBar = function () {
    filterBarInstance = $ionicFilterBar.show({
      items: $scope.desks,
      update: function (filteredItems, filterText) {
        $scope.desks = filteredItems;
      }
    });
  };

  function getAllDesks() {

  }

});
