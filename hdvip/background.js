// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Simple extension to replace lolcat images from
// http://icanhascheezburger.com/ with loldog images instead.

var from = "^http://plist.vn-hd.com/(.*)_(?:320|480|640|800|1024)_(.*.m3u8)";
var to = {
	1080: "http://plist.vn-hd.com/$1_1866_$2",
	720: "http://plist.vn-hd.com/$1_1280_$2",
	};

var MAX_QUALITY = null;
chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
	var pattern = new RegExp(from, "ig");
	var match = info.url.match(pattern);
    // Redirect the lolcal request to a random loldog URL.
	var toPattern = to[MAX_QUALITY];
	if (match && toPattern) {
		var redirectUrl = info.url.replace(pattern, toPattern);
		return  {redirectUrl: redirectUrl};
	}
  },
  // filters
  {
    urls: [
      "http://plist.vn-hd.com/*.m3u8"
    ]
  },
  // extraInfoSpec
  ["blocking"]);
  
chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
	return {cancel: true};
  },
  // filters
  {
    urls: [
      "http://*.serving-sys.com/*",
      "http://*.doubleclick.net/*"
    ]
  },
  // extraInfoSpec
  ["blocking"]);
  
// Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'movies.hdviet.com' },
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
  
  chrome.runtime.onMessage.addListener(function (message){
	 if (message.type === "QUALITY") {
		 MAX_QUALITY = message.maxQuality;
	 }
  });
  
/**chrome.runtime.onInstalled.addListener(function() {
  console.log("Installed.");

  // Register a webRequest rule to redirect bing to google.
  var wr = chrome.declarativeWebRequest;
  chrome.declarativeWebRequest.onRequest.addRules([{
    id: "0",
    conditions: [new wr.RequestMatcher({url: {hostSuffix: ".serving-sys.com"}})],
    actions: [new wr.CancelRequest()]
  }]);
});
**/
