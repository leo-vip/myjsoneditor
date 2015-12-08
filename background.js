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


chrome.app.runtime.onLaunched.addListener(function(launchData) {
  console.debug(launchData);
  chrome.app.window.create('chrome.html', {
    state:"maximized"

  });
});
