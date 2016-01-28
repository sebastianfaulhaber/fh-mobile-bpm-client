cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/es6-promise-plugin/www/promise.js",
        "id": "es6-promise-plugin.Promise",
        "pluginId": "es6-promise-plugin",
        "runs": true
    },
    {
        "file": "plugins/aerogear-cordova-push/www/aerogear.ajax.js",
        "id": "aerogear-cordova-push.AeroGear.ajax",
        "pluginId": "aerogear-cordova-push",
        "clobbers": [
            "ajax"
        ]
    },
    {
        "file": "plugins/aerogear-cordova-push/www/aerogear-push.js",
        "id": "aerogear-cordova-push.AeroGear.UnifiedPush",
        "pluginId": "aerogear-cordova-push",
        "clobbers": [
            "push"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "es6-promise-plugin": "3.0.2",
    "aerogear-cordova-push": "2.0.4"
}
// BOTTOM OF METADATA
});