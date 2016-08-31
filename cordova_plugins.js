cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.coviu.rtc/dist/coviu-mobile-rtc.js",
        "id": "com.coviu.rtc.WebRTC",
        "pluginId": "com.coviu.rtc",
        "clobbers": [
            "COVIURTC"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.0.0",
    "com.coviu.rtc": "0.1.1"
}
// BOTTOM OF METADATA
});