var id = 100;

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.captureVisibleTab(function (screenshotUrl) {
    console.log(screenshotUrl);
    var currentId = id++;
    var viewTabUrl = chrome.extension.getURL('gitorade.html?id=' + currentId);
    chrome.tabs.create({ url: viewTabUrl }, function (tab) { 
      var targetId = tab.id;
      var addSnapshotImageToTab = function (tabId, changedProps) {
        if (tabId != targetId || changedProps.status != 'complete') {
          return;
        }

        chrome.tabs.onUpdated.removeListener(addSnapshotImageToTab);
        var views = chrome.extension.getViews();
        for (var i  = 0; i < views.length; ++i) {
          var view = views[i];
          if (view.location.href == viewTabUrl) {
            view.Gitorade.setScreenShot(screenshotUrl, currentId);
            break;
          }
        }
      };

      chrome.tabs.onUpdated.addListener(addSnapshotImageToTab);
    });
  });
});