var swapList = [];
var KEY = "DOMAINSWAPKEY"

chrome.webRequest.onBeforeRequest.addListener(swapDomain, {urls: ["<all_urls>"]}, ["blocking"]);
getSwapList();

function swapDomain(info) {
    let lnkUrl = new webkitURL(info.url);
    let item = swapIt(lnkUrl.host);
    //console.log("swapDomain:swapIt(" + lnkUrl.host + ") = " + item);
    if (item != null) {
        chrome.tabs.get(info.tabId, function (tab) {
            if (info.type == "main_frame" & tab != undefined) {
                const sourceDest = item.split(":");
                chrome.tabs.update(info.tabId, {url: info.url.replace(sourceDest[0], sourceDest[1])});
                //console.log(sourceDest[0] +":" + sourceDest[1]);
                return {cancel: true};
            }
        });
    }
}

function swapIt(url) {
    for (let i = 0; i < swapList.length; i++) {
        const sourceDest = swapList[i].split(":");
        if (url.includes(sourceDest[0])) {
            return swapList[i];
        }
    }
    return null;
}

function addSwap(item) {
    swapList.push(item.toLowerCase());
    swapList.sort();
    let toSave = {};
    toSave[KEY] = JSON.stringify(swapList);
    chrome.storage.local.set(toSave, function () {
        console.log("Added")
    });
}

function del(item, callback) {
    swapList.splice(swapList.indexOf(item.toLowerCase()), 1);
    swapList.sort();

    let toSave = {};
    toSave[KEY] = JSON.stringify(swapList);
    chrome.storage.local.set(toSave, callback);
}

function cleanlist() {
    var tempList = []
    for (var i = 0; i < swapList.length; i++) {
        if (swapList[i].length > 2) {
            tempList.push(swapList[i])
        }
    }
    swapList = tempList;
}

function getSwapList() {
    chrome.storage.local.get(KEY,
        function (item) {
            if (Object.keys(item).length === 0) { //not found
                console.log("Domain Swap List not found");
                swapList = [];
            } else {
                swapList = JSON.parse(item[KEY]);
                cleanlist();
            }
        }
    );
}