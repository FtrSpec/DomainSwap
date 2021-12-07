window.addEventListener("DOMContentLoaded", (event) => {
    //console.debug("DOMContentLoaded");
    cmdAdd.addEventListener("click", function() { addSwap(); });
    cmdDel.addEventListener("click", function() { del(); });
    fillList();
});

function addSwap(){
	//console.debug("Adding");
	const add = document.getElementById("txtSource").value + ":" + document.getElementById("txtDest").value;
	//console.debug("Adding " + add);
	if (add.length < 2){
		console.log("Must be at least 2 characters.");
		return;
	}
	chrome.extension.getBackgroundPage().addSwap(add);
	fillList();
	document.getElementById("txtSource").value = "";
	document.getElementById("txtDest").value = "";
}

function del(){
	const item = swapList.value;
	//console.debug("del " + item);
	if (item != ""){
		const sourceDest = item.split(":");
		document.getElementById("txtSource").value = sourceDest[0];
		document.getElementById("txtDest").value = sourceDest[1];
		chrome.extension.getBackgroundPage().del(item,fillList);
		console.log("Deleted")
	}
}

function fillList(){
	swapList.innerHTML = "";
	const swaps = chrome.extension.getBackgroundPage().swapList;
	if (swaps != []){
		for (let i = 0; i < swaps.length; i++){
			let opt = document.createElement("option");
			opt.value = swaps[i];
			opt.innerHTML = swaps[i];
			swapList.appendChild(opt);
		}
	}
}

