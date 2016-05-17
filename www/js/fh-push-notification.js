/* JBoss, Home of Professional Open Source
 * Copyright Red Hat, Inc., and individual contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var app = {
   // Application Constructor
   initialize: function () {
      this.bindEvents();
   },
   // Bind Event Listeners
   //
   // Bind any events that are required on startup. Common events are:
   // 'load', 'deviceready', 'offline', and 'online'.
   bindEvents: function () {
      document.addEventListener('deviceready', this.register, false);
   },
   // deviceready Event Handler
   //
   // The scope of 'this' is the event. In order to call the 'receivedEvent'
   // function, we must explicity call 'app.receivedEvent(...);'
   register: function () {
      $fh.push(app.onNotification, successHandler, errorHandler);

      function successHandler() {
         app.clearMessages();
         document.getElementById('waiting').style.display = 'none';
         document.getElementById('pushenabled').style.display = 'block';
      }

      function errorHandler(error) {
        document.getElementById('waiting').style.display = 'none';
        document.getElementById('pushregistererror').style.display = 'block';
        document.getElementById('pushregistererror-msg').innerHTML = error;
      }
   },
   onNotification: function (event) {
      app.addMessage('Sabine Sachbearbeiter', event.alert || event.version);
   },
   addMessage: function (from, message) {
     document.getElementById('nomessages').style.display = 'none';
      var messages = document.getElementById("messages");
      var el = document.createElement("a");
      el.innerHTML = '<img ng-src="img/women.jpg" src="img/women.jpg"><h2>' + from + '</h2><p>' + message + '</p>';
      el.setAttribute('class', 'item item-avatar');
      el.setAttribute('href', '#');
      messages.appendChild(el);
   },
   clearMessages: function() {
    // Remove all messages
    var myNode = document.getElementById("messages");
      while (myNode.firstChild) {
          myNode.removeChild(myNode.firstChild);
      }

      // Add nothing here message
      var el = document.createElement("a");
      el.innerHTML = '<p>No messages.</p>';
      el.setAttribute('id', 'nomessages');
      el.setAttribute('class', 'item');
      el.setAttribute('href', '#');
      myNode.appendChild(el);
   }
};
