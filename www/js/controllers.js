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
        $scope.processName = res.name;
        $scope.hide();
      }, function(msg,err) {
      });
    }

    $scope.case = {
    }

    // Called when the form is submitted
    $scope.createCase = function(){
      $scope.show();
      // check if userInput is defined
      if ($scope.case.errorMessage) {
        /**
         * Pass the userInput to the module containing the $fh.cloud call.
         *
         * Notice that the defer.resolve and defer.reject functions are passed to the module.
         * One of these functions will be called when the $fh.cloud function has completed successully or encountered
         * an error.
         */
        var url = 'http://' + username + ':' + password + '@' + ip + ':' + port + '/business-central/rest/task/query';
        $fh.cloud({
          "path": "/bpm/startProcess",
          "method": "POST",
          "contentType": "application/json",
          "data": {
            "username": window.localStorage.getItem("bpm_username"),
            "password": window.localStorage.getItem("bpm_password"),
            "ip": window.localStorage.getItem("bpm_ip"),
            "port": window.localStorage.getItem("bpm_port"),
            "errorMessage": $scope.case.errorMessage
          },
          "timeout": 25000
        }, function(res) {
          // Clear form values
          $scope.case.errorMessage = '';
          // Clear loading
          $scope.hide();
          //alert('Got response from cloud:' + JSON.stringify(res));
        }, function(msg,err) {
          // Clear form values
          $scope.case.errorMessage = '';
          // Clear loading
          $scope.hide();
          //alert('Cloud call failed with error message:' + msg + '. Error properties:' + JSON.stringify(err));
        });
      }else {
        $scope.noticeMessage  = "Please fill the form";
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
        $scope.tasks = res.taskSummaryList;
        $scope.hide();
      }, function(msg,err) {
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
        $scope.hide();
      }, function(msg,err) {
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
    $scope.taskContent = res.contentMap;
    $scope.hide();
  }, function(msg,err) {

    //alert('Cloud call failed with error message:' + msg + '. Error properties:' + JSON.stringify(err));
  });
})
