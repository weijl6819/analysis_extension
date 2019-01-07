var defaultColor = "style";

function loadOptions() {
	var favColor = localStorage["favColor"];

	// valid colors are dark, style, green and gold
	if (favColor == undefined || (favColor != "dark" && favColor != "style" && favColor != "green" && favColor != "gold")) {
		favColor = defaultColor;
	}

	var select = document.getElementById("color");
	for (var i = 0; i < select.children.length; i++) {
		var child = select.children[i];
			if (child.value == favColor) {
			child.selected = "true";
			break;
		}
	}
}

function saveOptions() {
	var select = document.getElementById("color");
	var color = select.children[select.selectedIndex].value;
	localStorage["favColor"] = color;
}

function eraseOptions() {
	localStorage.removeItem("favColor");
	location.reload();
}