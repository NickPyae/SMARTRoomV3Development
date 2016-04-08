app.controller('LoginCtrl',function($rootScope, $scope, $state, $timeout, MaskFac, AppService,  CredentialService, ServerConfig){
	 $scope.loadLogin=false;
	 $scope.ip="";//help populate last ip
	 MaskFac.loadingMask(true, 'Initializing');
	 $scope.$on('$ionicView.enter',function(){

	 	if(CredentialService.isLoggedIn()){
		 	AppService.goHome();
		 	MaskFac.loadingMask(false);
		 }else{
		 	//get server ip from stored
		 	$scope.ip=CredentialService.getIp();
		 	$scope.loadLogin=true;
		 	$scope.logginState = false;
		 	MaskFac.loadingMask(false);

	 	}
	 });

  $scope.clearValidation = function() {
      $scope.validation.msg = "";
  }

	$scope.show=false;
	$timeout(function(){
		$scope.show=true;
	},500);

	//check if logged in
	$scope.validation={
		msg:"",
		col:""
	};
	$scope.logginState = false;
	function setValidation(msg, success){
		$scope.validation.msg = msg;
		if(success){
			$scope.validation.col = "balanced";
		}else{
			$scope.validation.col = "assertive";
		}
	}

	function validated(){
		AppService.goHome();
	}

  $scope.enableHTTPS = {
      checked: CredentialService.isHttpsEnabled()//false
  };

	//CredentialService
	$scope.login=function(u,p,i){

		//deal with log in
		if(u=="" || p=="" || i==""){
			setValidation("Empty Field Not Allowed", false);
		}else{
			//clear validations
			setValidation("");
		}

		$scope.logginState = true;

		MaskFac.loadingMask(true, 'Verifying');

		CredentialService.auth(u,p,i, $scope.enableHTTPS.checked)
		.then(function(res){
			console.log('credentialservice.auth.success:' + JSON.stringify(res));

			AppService.goHome();
			MaskFac.loadingMask(false);
		},function(errRes){
			setValidation("Authorization failed. Please try again.", false);
			$scope.logginState = false;
			MaskFac.loadingMask(false);
		});
	};
});