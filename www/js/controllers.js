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

    $scope.getProcess = function(){
      $fh.cloud({
        "path": "/bpm/getProcess",
        "method": "POST",
        "contentType": "application/json",
        "data": {
          "username": window.localStorage.getItem("bpm_username"),
          "password": window.localStorage.getItem("bpm_password"),
          "ip": window.localStorage.getItem("bpm_ip"),
          "port": window.localStorage.getItem("bpm_port")
        }
      }, function(res) {
        $scope.noticeMessage = null;
        $scope.processName = res.name;
      }, function(msg,err) {
        $scope.processName = null;
        $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
      });
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.case = {
    }

    // Called when the form is submitted
    $scope.createCase = function(){
      $scope.show();
      // check if userInput is defined
      if ($scope.case.errorMessage && $scope.case.timestamp && $scope.case.deviceType && $scope.case.deviceID &&
         $scope.case.errorCode && $scope.case.payload) {
        $fh.cloud({
          "path": "/bpm/startProcess",
          "method": "POST",
          "contentType": "application/json",
          "data": {
            "username": window.localStorage.getItem("bpm_username"),
            "password": window.localStorage.getItem("bpm_password"),
            "ip": window.localStorage.getItem("bpm_ip"),
            "port": window.localStorage.getItem("bpm_port"),
            "errorMessage": $scope.case.errorMessage,
            "timestamp": $scope.case.timestamp,
            "deviceType": $scope.case.deviceType,
            "deviceID": $scope.case.deviceID,
            "errorCode": $scope.case.errorCode,
            "payload": $scope.case.payload
          },
          "timeout": 25000
        }, function(res) {
          $scope.noticeMessage = null;
          // Clear form values
          $scope.case.errorMessage = '';
          $scope.case.timestamp = '';
          $scope.case.deviceType = '';
          $scope.case.deviceID = '';
          $scope.case.errorCode = '';
          $scope.case.payload = '';
          // Clear loading
          $scope.hide();
          //alert('Got response from cloud:' + JSON.stringify(res));
        }, function(msg,err) {
          $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
          // Clear loading
          $scope.hide();
          //alert('Cloud call failed with error message:' + msg + '. Error properties:' + JSON.stringify(err));
        });
      }else {
        $scope.noticeMessage  = "Please fill out the form";
        // Clear loading
        $scope.hide();
      }
    }
})

.controller('AccountCtrl', function($scope, $ionicLoading) {
  // Show loading...
  $scope.show = function() {
    $ionicLoading.show({
      template: '<div class="ion-checkmark">&nbsp;Success</div>',
      duration: 1000
    });
  };

  // Hide loading...
  $scope.hide = function(){
    $ionicLoading.hide();
  };

  $scope.settings = {
    enablePush: true
  };

  $scope.login = {
  }

  $scope.setLoginCredentials = function(){
      $scope.show();
      // store the credentials to the mobile device
      window.localStorage.setItem("bpm_username", $scope.login.username);
      window.localStorage.setItem("bpm_password", $scope.login.password);
      window.localStorage.setItem("bpm_ip", $scope.login.ip);
      window.localStorage.setItem("bpm_port", $scope.login.port);
    };

  $scope.initCredentials = function() {
    //alert(window.localStorage.getItem("iot_username"));
      if(window.localStorage.getItem("bpm_username") != undefined){
        $scope.login.username = window.localStorage.getItem("bpm_username");
      }
      if(window.localStorage.getItem("bpm_password") != undefined){
        $scope.login.password = window.localStorage.getItem("bpm_password");
      }
      if(window.localStorage.getItem("bpm_ip") != undefined){
        $scope.login.ip = window.localStorage.getItem("bpm_ip");
      }
      if(window.localStorage.getItem("bpm_port") != undefined){
        $scope.login.port = window.localStorage.getItem("bpm_port");
      }
    };
})

.controller('TasksCtrl', function($scope, $ionicLoading) {
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

  $scope.listCanSwipe = true;
  $scope.tasks = [];
  $scope.loadTasks = function(){
    $scope.show();
    allTasks();
  }

  function allTasks(){
      $fh.cloud({
        "path": "/bpm/loadTasks",
        "method": "POST",
        "contentType": "application/json",
        "data": {
          "username": window.localStorage.getItem("bpm_username"),
          "password": window.localStorage.getItem("bpm_password"),
          "ip": window.localStorage.getItem("bpm_ip"),
          "port": window.localStorage.getItem("bpm_port")
        }
      }, function(res) {
        $scope.noticeMessage = null;
        $scope.tasks = res.taskSummaryList;
        $scope.hide();
      }, function(msg,err) {
        $scope.tasks = null;
        $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
        // Clear loading
        $scope.hide();
      });
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');

  };

  $scope.completeTask = function(task){
      $scope.show();
      $fh.cloud({
        "path": "/bpm/completeTask",
        "method": "POST",
        "contentType": "application/json",
        "data": {
          "username": window.localStorage.getItem("bpm_username"),
          "password": window.localStorage.getItem("bpm_password"),
          "ip": window.localStorage.getItem("bpm_ip"),
          "port": window.localStorage.getItem("bpm_port"),
          "taskId": task.id
        }
      }, function(res) {
        allTasks();
      }, function(msg,err) {
        $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
        $scope.tasks = null;
        // Clear loading
        $scope.hide();
      });
  };

  $scope.claimTask = function(task){
      $scope.show();
      $fh.cloud({
        "path": "/bpm/claimTask",
        "method": "POST",
        "contentType": "application/json",
        "data": {
          "username": window.localStorage.getItem("bpm_username"),
          "password": window.localStorage.getItem("bpm_password"),
          "ip": window.localStorage.getItem("bpm_ip"),
          "port": window.localStorage.getItem("bpm_port"),
          "taskId": task.id
        }
      }, function(res) {
          allTasks();
      }, function(msg,err) {
        $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
        $scope.tasks = null;
        // Clear loading
        $scope.hide();
      });
  };

  $scope.startTask = function(task){
      $scope.show();
      $fh.cloud({
        "path": "/bpm/startTask",
        "method": "POST",
        "contentType": "application/json",
        "data": {
          "username": window.localStorage.getItem("bpm_username"),
          "password": window.localStorage.getItem("bpm_password"),
          "ip": window.localStorage.getItem("bpm_ip"),
          "port": window.localStorage.getItem("bpm_port"),
          "taskId": task.id
        }
      }, function(res) {
          allTasks();
      }, function(msg,err) {
        $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
        $scope.tasks = null;
        // Clear loading
        $scope.hide();
      });
  };

  $scope.releaseTask = function(task){
      $scope.show();
      $fh.cloud({
        "path": "/bpm/releaseTask",
        "method": "POST",
        "contentType": "application/json",
        "data": {
          "username": window.localStorage.getItem("bpm_username"),
          "password": window.localStorage.getItem("bpm_password"),
          "ip": window.localStorage.getItem("bpm_ip"),
          "port": window.localStorage.getItem("bpm_port"),
          "taskId": task.id
        }
      }, function(res) {
          allTasks();
      }, function(msg,err) {
        $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
        $scope.tasks = null;
        // Clear loading
        $scope.hide();
      });
  };

  $scope.statusIsReserved = function(task){
        if (task.status == 'Reserved') {
          return true;
        }
        return false;
  };

  $scope.statusIsInProgress = function(task){
      if (task.status == 'InProgress') {
        return true;
      }
      return false;
  };

  $scope.statusIsReady = function(task){
      if (task.status == 'Ready') {
        return true;
      }
      return false;
  };


})

.controller('TaskDetailCtrl', function($scope, $stateParams, $ionicLoading) {
  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
  };

  // Hide loading...
  $scope.hide = function(){
    $ionicLoading.hide();
  };

$scope.getTaskContent = function(){
  $scope.show();
  $fh.cloud({
    "path": "/bpm/loadTaskContent",
    "method": "POST",
    "contentType": "application/json",
    "data": {
      "username": window.localStorage.getItem("bpm_username"),
      "password": window.localStorage.getItem("bpm_password"),
      "ip": window.localStorage.getItem("bpm_ip"),
      "port": window.localStorage.getItem("bpm_port"),
      "taskId": $stateParams.taskId
    },
    "timeout": 25000
  }, function(res) {
    $scope.noticeMessage = null;
    $scope.taskContent = res.contentMap;
    $scope.hide();
  }, function(msg,err) {
    $scope.taskContent = null;
    $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
    $scope.hide();
  });
  // Stop the ion-refresher from spinning
  $scope.$broadcast('scroll.refreshComplete');
}
})
