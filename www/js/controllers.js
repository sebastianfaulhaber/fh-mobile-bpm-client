angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicLoading) {

    // Show loading...
    $scope.show = function() {
      $ionicLoading.show({
        template: 'Loading...'
      });
    };

    // Hide loading...
    $scope.hide = function(){
      $ionicLoading.hide();
    };

    // Called when the form is submitted
    $scope.createCase = function(mycase){
      $scope.show();

      $fh.cloud({
        "path": "/bpm/startProcess",
        "method": "POST",
        "contentType": "application/json",
        "data": {
          "firstname": mycase.firstname,
          "lastname": mycase.lastname,
          "request": mycase.request
        },
        "timeout": 25000
      }, function(res) {
        // Clear form values
        mycase.firstname = '';
        mycase.lastname = '';
        mycase.request = '';

        // Clear loading
        $scope.hide();

        //alert('Got response from cloud:' + JSON.stringify(res));
      }, function(msg,err) {
        // Clear form values
        mycase.firstname = '';
        mycase.lastname = '';
        mycase.request = '';

        // Clear loading
        $scope.hide();
        //alert('Cloud call failed with error message:' + msg + '. Error properties:' + JSON.stringify(err));
      });
    }

})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
