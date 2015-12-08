/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.window.html
 */
/*chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('chrome.html', {
    state:"maximized"

  });
});*/


// chrome.app.runtime.onLaunched.addListener(function(launchData) {
//   console.debug(launchData);
//   chrome.app.window.create('chrome.html', {
//     state:"maximized"
//
//   });
// });

chrome.app.runtime.onLaunched.addListener(function() {
  // Center window on screen.
  var screenWidth = screen.availWidth;
  var screenHeight = screen.availHeight;


  chrome.app.window.create('chrome.html', {
    "minWidth": 800,
		"minHeight": 500,
    frame: 'chrome',
    innerBounds: {
        minWidth: 800,
        minHeight: 600,
        width: 900,
        height: 600,
    }

  });
});
