var numPinnedTabs = 0;
var numRegularTabs = 0;
var workspaces = {};
var order = [];
var editMode = false;
var workspacesToggled = false;
var currentID = "";

/////////////////////////
// COMMON
/////////////////////////

// Hide New Workspace Dialogue On Mouse Click Elsewhere
document.addEventListener('mouseup', function (e) {
  var sidebar = document.getElementById("sidebar");
  var exitButton = document.getElementById("closeSidebar");
  var addButton = document.getElementById("addWorkspaceButton");
  var workspaceTitle = document.getElementById("workspaceTitle");
  if (( !sidebar.contains(e.target) || e.target == exitButton) &&
      (e.target != addButton && e.target != workspaceTitle)) {
		currentID = "";
    if (getComputedStyle(sidebar).display == "block") {
      toggleSidebar();
    }
  } else if (e.target == addButton && currentID != "") {
		currentID = "";
		toggleSidebar();
	}

}.bind(this));

// Toggle Sidebar
function toggleSidebar() {
  $("#sidebar").animate({width:'toggle'},350);
}

/////////////////////////
// TAB ENTRY
/////////////////////////

// Add Pinned Tab Entry
document.getElementById("addPinnedTab").onclick = function() {
  numPinnedTabs++;
  addTab("pinnedTab");
};

// Add Regular Tab Entry
document.getElementById("addRegularTab").onclick = function() {
  numRegularTabs++;
  addTab("regularTab");
};

// Add Tab Entry
function addTab(type, site) {
  var tabs = document.getElementById(type + "s");
  var tab = document.querySelector("#tabTemplate");
  var clone = document.importNode(tab.content, true);
  var input = clone.querySelector("input");
  var removeTab = clone.querySelector("button");

  input.className = type;
	if (site) {
		input.value = site;
	}
  removeTab.onclick = function() {
    this.parentNode.remove();
  }
  tabs.appendChild(clone);
}

/////////////////////////
// WORKSPACES
/////////////////////////

// Create New Workspace
document.getElementById("saveWorkspace").onclick = function() {
  var workspaceTabs = [];
  var pinnedTabs = document.getElementsByClassName("pinnedTab");
  var regularTabs = document.getElementsByClassName("regularTab");
  var workspacesDiv = document.getElementById("workspaces");
  var errorMsg = document.getElementById("workspaceError");
  var successMsg = document.getElementById("workspaceSuccess");
  var tab, i, workspaceName, id, newWorkspace, workspace;

  errorMsg.innerHTML = "";
  workspaceName = document.getElementById("workspaceName").value.trim();
  id = workspaceName.trim().replace(/\s+/g, '-').toLowerCase() + "-ws";

  for (i = 0; i < pinnedTabs.length; i++) {
    tab = {
      url: pinnedTabs[i].value,
      pinned: true,
      active: false
    }
    workspaceTabs.push(tab);
  }

  for (i = 0; i < regularTabs.length; i++) {
    tab = {
      url: regularTabs[i].value,
      pinned: false,
      active: false
    }
    workspaceTabs.push(tab);
  }

  newWorkspace = {
    name: workspaceName,
    tabs: workspaceTabs
  }

	if (currentID != id && workspaces.hasOwnProperty(id)) {
		errorMsg.innerHTML = "Workspace with same name already exists.";
		return;
	}

	if (workspaceName.trim() == "") {
		errorMsg.innerHTML = "Don't forget to name your workspace.";
		errorMsg.className = "workspaceError"
		return;
	}

	if (!/^[a-z\d_\s]+$/i.test(workspaceName)) {
		errorMsg.innerHTML = "Workspace names cannot contain symbols.";
		return;
	}

	successMsg = document.getElementById("workspaceSuccess");

	if (currentID) {
		var index = order.indexOf(currentID)
		order[index] = id;

		workspaces[id] = newWorkspace;
		if (currentID != id) {
			delete workspaces[currentID];
		}

		chrome.storage.sync.set({workspaces: workspaces, order: order});

		var workspaceElement = document.getElementById(currentID);
		var newworkspaceElement = createWorkspaceButton(workspaceName, id);
		workspaceElement.parentNode.replaceChild(newworkspaceElement, workspaceElement);

		successMsg.innerHTML = "Workspace saved!";
	  setTimeout(success, 1700);
	} else {
		workspaces[id] = newWorkspace;
		order.unshift(id);
		chrome.storage.sync.set({workspaces: workspaces, order: order});

		updateNoWorkspaceMessage();
		showNewWorkspace(workspaceName, id);

		successMsg.innerHTML = "Workspace created!";
	  setTimeout(success, 1700);
	}
}

// Delay for Successful Creation
function success() {
  toggleSidebar();
  resetWorkspaceForm();
}

// Add New Workspace to View
function showNewWorkspace(workspaceName, id) {
  var workspacesDiv = document.getElementById("workspaces");
  var firstWorkspace = document.getElementsByClassName("workspaceItem")[0];
  var workspace = createWorkspaceButton(workspaceName, id);
  workspacesDiv.insertBefore(workspace, firstWorkspace);
	$('#workspaces').animate({scrollLeft: 0}, 400);
}

document.getElementById("deleteWorkspace").onclick = function() {
	var workspace = document.getElementById(currentID);
	var index = order.indexOf(currentID);
	var	successMsg = document.getElementById("workspaceSuccess");

	if (index > -1) {
	    order.splice(index, 1);
	}

	delete workspaces[currentID];

	workspace.parentNode.removeChild(workspace);

	chrome.storage.sync.set({workspaces: workspaces, order: order});

	updateNoWorkspaceMessage();

	successMsg.innerHTML = "Workspace deleted!";
	setTimeout(success, 1700);
}

// Load Workspaces on Startup
function initializeWorkspaces() {
  chrome.storage.sync.get({workspaces: {}, order: []}, function(data) {
    workspaces = data.workspaces;
		order = data.order;
		loadWorkspaces();
		updateNoWorkspaceMessage();
  });
}

// Load Workspaces
function loadWorkspaces() {
	var workspacesDiv = document.getElementById("workspaces");
  var i, clone, workspaceName, workspace, id;

	for (i = 0; i < order.length; i++) {
		workspaceName = workspaces[order[i]].name;
		workspace = createWorkspaceButton(workspaceName, order[i]);
		workspacesDiv.appendChild(workspace);
	}
}

// Returns the Button of a Workspace
function createWorkspaceButton(workspaceName, id) {
  var workspacesDiv = document.getElementById("workspaces");
  var workspaceTemplate = document.querySelector("#workspaceTemplate");
  var workspace = document.importNode(workspaceTemplate.content, true).querySelector("li");
  var workspaceNameText;

	workspaceNameText = workspaceName.toUpperCase();
  workspace.querySelector("p").innerHTML = workspaceNameText;

	workspace.id = id;
  workspace.onclick = function() {
		if (editMode) {
			currentID = workspace.id;
			openEditSideBar(workspace.id);
		}
		else {
	    openWorkspace(workspaceName, id);
			showHelperMessage(workspaceNameText + " WORKSPACE HAS BEEN LAUNCHED", 5000)
			setTimeout(closeLauncher, 3000);
		}
	}
	if (editMode) {
		workspace.style.float = "left";
	}

  return workspace;
}

function closeLauncher() {
	chrome.tabs.getCurrent( function(tab){
		chrome.tabs.remove(tab.id);
	})
}

// Open Workspace Clicked
function openWorkspace(workspaceName, id) {
  var i;
  var tabs = [];
  var workspace = {};

  workspace = getWorkspace(id);
  tabs = workspace.tabs;

  for (i = 0; i < tabs.length; i++) {
    chrome.tabs.create(tabs[i]);
  }
}

// Returns Workspace of Given Name
function getWorkspace(id) {
  return workspaces[id];
}

// Resets Workspace Form to Default View
function resetWorkspaceForm() {
  var errorMsg = document.getElementById("workspaceError");
  var successMsg = document.getElementById("workspaceSuccess");
  var tabs = document.getElementsByClassName('tab');

  numRegularTabs = 0;
  numPinnedTabs = 0;

  while(tabs[0]) {
    tabs[0].parentNode.removeChild(tabs[0]);
  }
  errorMsg.innerHTML = "";
  successMsg.innerHTML = "";
  addTab("regularTab");
  var nameInput = document.getElementById('workspaceName');
  nameInput.value = "";
}

// Handle Clicking of Add Workspace Button
document.getElementById("addWorkspaceButton").onclick = function() {
	var deleteButton = document.getElementById('deleteWorkspace');
	deleteButton.style.display = "none";
	resetWorkspaceForm();
	toggleSidebar();
}

// Show All Workspace View
document.getElementById("workspaceTitle").onclick = function() {
	toggleWorkspaces();
}

document.getElementById("workspacesShowAllButton").onclick = function() {
	toggleWorkspaces();
}


// Hide All Workspace View
document.getElementById("workspacesBackButton").onclick = function() {
	toggleWorkspaces();
}

function toggleWorkspaces(noRetoggle) {
	var workspaces = document.getElementById("workspaces");
	var workspacesContainer = document.getElementById("workspacesContainer");
	var websitesContainer = document.getElementById("websitesContainer");
	var workspacesShowAllButton = document.getElementById("workspacesShowAllButton");

	if (editMode) {
		return;
	}

	if (noRetoggle && workspacesToggled) {
		return
	}

	if (window.getComputedStyle(workspaces).getPropertyValue("overflow-y") == "hidden" ||
		workspaces.style.overflowY == "hidden") {
		workspaces.style.whiteSpace = "normal";
		workspaces.style.height = "auto";
		workspaces.style.width = "115%";
		workspaces.style.overflowX = "hidden";
		workspaces.style.overflowY = "scroll";
		workspaces.style.padding = "0px";
		workspacesContainer.style.height = "auto";
		websitesContainer.style.display = "none";
		workspacesShowAllButton.style.display = "none"
		$("#workspacesBackButton").show();
		workspacesToggled = true;
	} else {
		workspaces.style.whiteSpace = "nowrap";
		workspaces.style.height = "210px";
		workspaces.style.width = "auto";
		workspaces.style.overflowX = "scroll";
		workspaces.style.overflowY = "hidden";
		workspaces.style.padding = "0px 0px 50px 0px";
		workspacesContainer.style.height = "120px";
		websitesContainer.style.display = "block";
		workspacesShowAllButton.style.display = "inline-block"

		$("#workspacesBackButton").hide();
		$("#workspacesDoneButton").hide();
		workspacesToggled = false;
	}
}

// Helper for Correct Timing of Back Button
function setDefaultWorkspaceDiv() {
  var workspaces = document.getElementById("workspaces");
	workspaces.style.height = "210px";
  workspaces.style.whiteSpace = "nowrap";
}

// Activate Organization of Workspaces
document.getElementById("workspacesEditButton").onclick = function() {
	toggleWorkspaces(true);
	editMode = true;
	this.className = this.className + " activeButton";
	this.style.cursor = "default";

  $('#workspaces li').css('float','left');
  $("#workspaces").sortable({
		disabled: false,
    handle: 'button',
    cancel: '',
    placeholder: 'placeholder',
    forcePlaceholderSize: true,
		update: function(event, ui) {
			saveOrder();
		}
  }).disableSelection();
	$("#workspacesDoneButton").show();
	$("#workspacesBackButton").hide();

	showHelperMessage("DRAG & DROP TO REORDER or CLICK TO EDIT", 4000)
}

function saveOrder() {
	var workspaceItems = document.getElementsByClassName('workspaceItem');
	var newOrder = [];

	for (var i = 0; i < workspaceItems.length; i++) {
		newOrder.push(workspaceItems[i].id);
	}
	order = newOrder;
	chrome.storage.sync.set({order: newOrder});
}

function openEditSideBar(id) {
	var tabs = document.getElementsByClassName('tab');
	var workspaceName = document.getElementById('workspaceName');
	var deleteButton = document.getElementById('deleteWorkspace');
	deleteButton.style.display = "block";

  while(tabs[0]) {
    tabs[0].parentNode.removeChild(tabs[0]);
  }

	workspace = getWorkspace(id);
	tabs = workspace.tabs;

	var tab, type;
	for (var i = 0; i < tabs.length; i++) {
		tab = tabs[i];
		if (tab.pinned) {
			type = "pinnedTab";
		} else {
			type = "regularTab";
		}
		addTab(type, tab.url)
	}

	workspaceName.value = workspace.name;
	toggleSidebar();
}

// Done Editing of Workspaces
document.getElementById("workspacesDoneButton").onclick = function() {
	editMode = false;
	var editButton = document.getElementById("workspacesEditButton");
	var workspaceItems = document.getElementsByClassName('workspaceItem');

	editButton.className = "headerButton fade";
	editButton.style.cursor = "pointer";
	$('#workspaces li').css('float','none');
	$("#workspaces").sortable({
		disabled: true
	});

	$("#workspacesDoneButton").hide();
	$("#workspacesBackButton").show();
}

// Show helper message
function showHelperMessage(message, duration) {
	$("#helperMessage").html(message);
	$("#helperMessageContainer").slideDown();
	setTimeout(hideHelperMessage, duration)
}

// Hide helper message
function hideHelperMessage() {
	$("#helperMessageContainer").slideUp();
}

// Update No Workspace Message
function updateNoWorkspaceMessage() {
	var no_workspaces = document.getElementById("no_workspaces");
	if (Object.keys(workspaces).length != 0) {
		no_workspaces.style.display = "none";
	} else {
		no_workspaces.style.display = "block";
	}
}

/////////////////////////
// INITIALIZE
/////////////////////////

addTab("regularTab");
initializeWorkspaces();
