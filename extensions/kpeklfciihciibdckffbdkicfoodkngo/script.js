window.onload = function() {
  document.getElementById("searchBox").focus();
};

function updateCard() {
	var specialCharacters = [["æ", "ae"], ["â", "a"], ["á", "a"], ["à", "a"], ["é", "e"], ["ö", "o"], ["û", "u"], ["ú", "u"]];
	var specialCards = [["1996 world champion", "http://i.imgur.com/CjG5oKs.jpg"], ["shichifukujin dragon", "http://i.imgur.com/GXfgpA0.jpg"], ["splendid genesis", "http://i.imgur.com/ESnPx8h.jpg"], ["fraternal exaltation", "http://i.imgur.com/HkACLRX.jpg"], ["proposal", "http://i.imgur.com/7fcqz6U.jpg"], ["ghazban ogre", "http://i.imgur.com/hJMExno.jpg"]];
	var cardContainer = document.getElementById("cardContainer");
	var cardName = document.getElementById("searchBox").value.toLowerCase();

	//Replace special characters
	for(var i = 0; i < cardName.length; i++) {
		for(var n = 0; n < specialCharacters.length; n++) {
			if(cardName[i] == specialCharacters[n][0]) {
				cardName = cardName.replace(cardName[i], specialCharacters[n][1]);
			}
		}
	}

	//Display card back if error
	cardImage.addEventListener('error', function () {
		cardImage.src = "assets/default.jpg";
		document.getElementById("searchBox").value = cardName;
	});

	//Change card image source
	cardImage.src = "http://gatherer.wizards.com/Handlers/Image.ashx?type=card&name=" + cardName;

	//Check for special case errors
	if(cardName === '"' || cardName === "") {
		cardImage.src = "assets/default.jpg";
	}

	//Replace image if special card
	for(var i = 0; i < specialCards.length; i++) {
		if(cardName == specialCards[i][0]) {
			cardImage.src = specialCards[i][1];
		}
	}

	//Store card name in alt
	document.getElementById("cardImage").alt = cardName;

	//Display card and buttons
	document.getElementById("cardImage").style.display = "block";
	document.getElementById("gathererButton").style.display = "inline-block";
	document.getElementById("tcgButton").style.display = "inline-block";
}

document.getElementById("gathererButton").onclick = function() {
	chrome.tabs.create({ url: "http://gatherer.wizards.com/Pages/Card/Details.aspx?name=" + document.getElementById("cardImage").alt });
};

document.getElementById("tcgButton").onclick = function() {
	chrome.tabs.create({ url: "http://shop.tcgplayer.com/magic/product/show?ProductName=" + document.getElementById("cardImage").alt });
};

document.getElementById("searchButton").onclick = function() {
	updateCard();
};

document.getElementById("searchBox").onkeypress = function(key) {
	if(key.keyCode == 13) {
		updateCard();
	}
};
