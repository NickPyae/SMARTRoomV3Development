app.controller('ScanCtrl',function($scope, $q, $timeout, $state, $ionicPopup, AppService,
								   RoomService , BarcodeScanner, MaskFac){
	//on enter,
	//1. bring up qrcode scanner
	//2. if scanning failed show scan button
	//3. if success, post to lihock
	//4. based on reply, if to acknowledge -> state.go to reservation
	//5. based on reply, if book -> receive schedule display availability

	$scope.$on('$ionicView.enter',function() {
		scanBarcode();
	});

	$scope.scan = function(){
		// Redirect
		//var roomID = 1;
		// Prompt Msg
		//var roomID = 15;
		// Action being empty string
		//var roomID = 38;

		scanBarcode();
	};

	function scanBarcode() {
		BarcodeScanner.scan().then(function(res){
			if(res.success) {
				RoomService.decodeQrCode(res.data).then(function(options) {

					angular.forEach(options, function(option) {
						if(angular.lowercase(option.Action) === 'prompt') {
							var alertPopup = $ionicPopup.alert({
								title: 'SMARTRoom',
								template: option.Msg
							});
							/*alertPopup.then(function(res) {
							 //doSomething if necessary
							 });*/
						}

						if(angular.lowercase(option.Action) === 'redirect') {

							MaskFac.loadingMask(true, 'Loading');

							$timeout(function() {

								MaskFac.loadingMask(false);

								//$state.go('tab.home');
								$state.go('tab.home-roomschedule', {param:res.data});
							}, 1000);
						}

						// Action being empty string
						if(!angular.lowercase(option.Action)) {
							var alertPopup = $ionicPopup.alert({
								title: 'SMARTRoom',
								template: 'Room not available.'
							});
						}

            if(angular.lowercase(option.Action) === 'promptstart') {

              MaskFac.loadingMask(true, 'Loading');

              $timeout(function() {

                MaskFac.loadingMask(false);

                $state.go('tab.reservation-detail', {param: [res.data, 'start']});
              }, 1000);
            }

            if(angular.lowercase(option.Action) === 'promptend') {

              MaskFac.loadingMask(true, 'Loading');

              $timeout(function() {

                MaskFac.loadingMask(false);

                $state.go('tab.reservation-detail', {param: [res.data, 'end']});
              }, 1000);
            }
					})

				});
			} else {
				console.log('User cancelled.');
			}
		});
	};
});
