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
        "path": "/bpm/getProcessInstance",
        "method": "POST",
        "contentType": "application/json",
        "data": {
          "params": {
            "username": window.localStorage.getItem("bpm_username"),
            "password": window.localStorage.getItem("bpm_password"),
            "ip": window.localStorage.getItem("bpm_ip"),
            "port": window.localStorage.getItem("bpm_port")
          }
        }
      }, function(res) {
        if(res.code == 'ECONNREFUSED'){
          $scope.noticeMessage = 'Connection to mBaaS refused';
          $scope.processName = null;
        }else if(res.error != null){
          $scope.noticeMessage = 'Connection to BPM refused'
          $scope.processName = null;
        }else{
          $scope.noticeMessage = null;
          $scope.processName = res.name;
        }
      }, function(msg,err) {
        $scope.processName = null;
        $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
      });
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    }
})

.controller('ProcessCtrl', function($scope, $ionicLoading) {

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

    $scope.case = {
    }

    // Called when the form is submitted
    $scope.createCase = function(){
      $scope.show();
      // check if userInput is defined
      if ($scope.case.firstname && $scope.case.lastname && $scope.case.request) {
        $fh.cloud({
          "path": "/bpm/startProcess",
          "method": "POST",
          "contentType": "application/json",
          "data": {
            "params": {
              "username": window.localStorage.getItem("bpm_username"),
              "password": window.localStorage.getItem("bpm_password"),
              "ip": window.localStorage.getItem("bpm_ip"),
              "port": window.localStorage.getItem("bpm_port")
            },
            "firstname": $scope.case.firstname,
            "lastname": $scope.case.lastname,
            "request": $scope.case.request,
            "decision": $scope.case.decision,
            "decisioncomment": $scope.case.decisioncomment
          },
          "timeout": 25000
        }, function(res) {
          if(res.code == 'ECONNREFUSED'){
            $scope.noticeMessage = 'Connection to mBaaS refused';
            $scope.processName = null;
            // Clear loading
            $scope.hide();
          }else if(res.error != null){
            $scope.noticeMessage = 'Connection to BPM refused'
            $scope.processName = null;
            // Clear loading
            $scope.hide();
          }else{
            $scope.noticeMessage = null;
            // Clear form values
            $scope.case.firstname = '';
            $scope.case.lastname = '';
            $scope.case.request = '';
            $scope.case.decision = '';
            $scope.case.decisioncomment = '';
            // Clear loading
            $scope.hide();
          }
        }, function(msg,err) {
          $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
          // Clear loading
          $scope.hide();
        });
      }else {
        $scope.noticeMessage  = "Please fill out the form";
        // Clear loading
        $scope.hide();
      }
    }
})

.controller('AccountCtrl', function($scope, $ionicLoading) {
  var message = '';
  // Show loading...
  $scope.show = function() {
    $ionicLoading.show({
      template: '<div class="ion-checkmark">&nbsp;'+message+'</div>',
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
        message = 'Success';
        $scope.show();
        // store the credentials to the mobile device
        window.localStorage.setItem("bpm_username", $scope.login.username);
        window.localStorage.setItem("bpm_password", $scope.login.password);
        window.localStorage.setItem("bpm_ip", $scope.login.ip);
        window.localStorage.setItem("bpm_port", $scope.login.port);
  };

  $scope.initCredentials = function() {
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

  function isBlank(str) {
    return (!str || /^\s*$/.test(str));
  }

  function allTasks(){
      $fh.cloud({
        "path": "/bpm/loadTasks",
        "method": "POST",
        "contentType": "application/json",
        "data": {
          "params": {
            "username": window.localStorage.getItem("bpm_username"),
            "password": window.localStorage.getItem("bpm_password"),
            "ip": window.localStorage.getItem("bpm_ip"),
            "port": window.localStorage.getItem("bpm_port")
          }
        }
      }, function(res) {
        if(res.code == 'ECONNREFUSED'){
          $scope.noticeMessage = 'Connection to mBaaS refused';
          $scope.tasks = null;
          $scope.hide();
        }else if(res.error != null){
          $scope.noticeMessage = 'Connection to BPM refused'
          $scope.tasks = null;
          $scope.hide();
        }else{
          $scope.noticeMessage = null;
          $scope.tasks = res.taskSummaryList;
          if(res.taskSummaryList.length == 0){
            $scope.noticeMessage  = 'Tasklist is empty';
          }else{
            for (i = 0; i < res.taskSummaryList.length; i++) {
              if(isBlank(res.taskSummaryList[i]['actual-owner']))
              res.taskSummaryList[i]['actual-owner'] = 'Ownerless';
            }
            $scope.tasks = res.taskSummaryList;
          }
          $scope.hide();
        }
      }, function(msg,err) {
        $scope.tasks = null;
        $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
        // Clear loading
        $scope.hide();
      });
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');

  };

  $scope.claimTask = function(task){
      $scope.show();
      $fh.cloud({
        "path": "/bpm/claimTask",
        "method": "POST",
        "contentType": "application/json",
        "data": {
          "params": {
            "username": window.localStorage.getItem("bpm_username"),
            "password": window.localStorage.getItem("bpm_password"),
            "ip": window.localStorage.getItem("bpm_ip"),
            "port": window.localStorage.getItem("bpm_port")
          },
          "taskId": task.id
        }
      }, function(res) {
        if(res.code == 'ECONNREFUSED'){
          $scope.noticeMessage = 'Connection to mBaaS refused';
          $scope.tasks = null;
          $scope.hide();
        }else if(res.error != null){
          $scope.noticeMessage = 'Connection to BPM refused'
          $scope.tasks = null;
          $scope.hide();
        }else{
          allTasks();
        }
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
          "params": {
            "username": window.localStorage.getItem("bpm_username"),
            "password": window.localStorage.getItem("bpm_password"),
            "ip": window.localStorage.getItem("bpm_ip"),
            "port": window.localStorage.getItem("bpm_port")
          },
          "taskId": task.id
        }
      }, function(res) {
        if(res.code == 'ECONNREFUSED'){
          $scope.noticeMessage = 'Connection to mBaaS refused';
          $scope.tasks = null;
          $scope.hide();
        }else if(res.error != null){
          $scope.noticeMessage = 'Connection to BPM refused'
          $scope.tasks = null;
          $scope.hide();
        }else{
          allTasks();
        }
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
          "params": {
            "username": window.localStorage.getItem("bpm_username"),
            "password": window.localStorage.getItem("bpm_password"),
            "ip": window.localStorage.getItem("bpm_ip"),
            "port": window.localStorage.getItem("bpm_port")
          },
          "taskId": task.id
        }
      }, function(res) {
        if(res.code == 'ECONNREFUSED'){
          $scope.noticeMessage = 'Connection to mBaaS refused';
          $scope.tasks = null;
          $scope.hide();
        }else if(res.error != null){
          $scope.noticeMessage = 'Connection to BPM refused'
          $scope.tasks = null;
          $scope.hide();
        }else{
          allTasks();
        }
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

.controller('TaskDetailCtrl', function($scope, $stateParams, $ionicLoading, $ionicModal) {
  $scope.readOnly = 'readonly';

  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
  };

  // Hide loading...
  $scope.hide = function(){
    $ionicLoading.hide();
  };

  function showSuccessMessage() {
    $ionicLoading.show({
      template: '<div class="ion-checkmark">&nbsp; Success</div>',
      duration: 1000
    });
    //Reloading the Task-Tab
    window.location.reload(true);
  };

  $scope.getTaskContent = function(){
    $scope.show();
    loadTaskContent();
  }

  function loadTaskContent(){
    $fh.cloud({
      "path": "/bpm/loadTaskContent",
      "method": "POST",
      "contentType": "application/json",
      "data": {
        "params": {
          "username": window.localStorage.getItem("bpm_username"),
          "password": window.localStorage.getItem("bpm_password"),
          "ip": window.localStorage.getItem("bpm_ip"),
          "port": window.localStorage.getItem("bpm_port")
        },
        "taskId": $stateParams.taskId
      }
    }, function(res) {
      if(res.code == 'ECONNREFUSED'){
        $scope.noticeMessage = 'Connection to mBaaS refused';
        $scope.taskContent = null;
        $scope.hide();
      }else if(res.error != null){
        $scope.noticeMessage = 'Connection to BPM refused'
        $scope.taskContent = null;
        $scope.hide();
      }else{
        $scope.noticeMessage = null;
        $scope.taskContent = res.contentMap;
        $scope.hide();
      }
    }, function(msg,err) {
      $scope.taskContent = null;
      $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
      $scope.hide();
    });
    // Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  };

  function completeTask(){
      $scope.show();
      $fh.cloud({
        "path": "/bpm/completeTask",
        "method": "POST",
        "contentType": "application/json",
        "data": {
          "params": {
            "username": window.localStorage.getItem("bpm_username"),
            "password": window.localStorage.getItem("bpm_password"),
            "ip": window.localStorage.getItem("bpm_ip"),
            "port": window.localStorage.getItem("bpm_port")
          },
          "taskId": $stateParams.taskId,
          "firstname": $scope.taskContent.firstname,
          "lastname": $scope.taskContent.lastname,
          "request": $scope.taskContent.request,
          "decision": $scope.taskContent.decision,
          "decisioncomment": $scope.taskContent.decisioncomment
        }
      }, function(res) {
        if(res.code == 'ECONNREFUSED'){
          $scope.noticeMessage = 'Connection to mBaaS refused';
          $scope.taskContent = null;
          $scope.hide();
        }else if(res.error != null){
          $scope.noticeMessage = 'Connection to BPM refused'
          $scope.taskContent = null;
          $scope.hide();
        }else{
          $scope.hide();
          showSuccessMessage();
        }
      }, function(msg,err) {
        $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
        $scope.taskContent = null;
        // Clear loading
        $scope.hide();
      });
  };

  $scope.statusIsInProgress = function(){
      if ($stateParams.status == 'InProgress') {
        return true;
      }
      return false;
  };

  $scope.statusIsReserved = function(){
        if ($stateParams.status == 'Reserved') {
          return true;
        }
        return false;
  };

  // Load the modal from the given template URL
  $ionicModal.fromTemplateUrl('templates/task-detail-edit.html', function($ionicModal) {
    $scope.modal = $ionicModal;
  }, {
    // Use our scope for the scope of the modal to keep it simple
    scope: $scope,
    // The animation we want to use for the modal entrance
    animation: 'slide-in-up'
  });

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

   $scope.modalCancel = function(){
    $scope.modal.hide();
    $scope.show();
    loadTaskContent();
  }

  $scope.modalComplete = function(){
    completeTask();
    $scope.modal.hide();
    location.href = '#/tab/tasks';
  }

  $scope.modalSave = function(){
    $scope.modal.hide();
  }

})
