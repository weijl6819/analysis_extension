document.getElementById("createNewWorkspace").onclick = function() {
	chrome.storage.sync.get({workspaces: {}, order: []}, function(data) {
    workspaces = data.workspaces;
		order = data.order;
    chrome.tabs.getAllInWindow(function(tabs) {
      var workspaceTabs = [];

      for (i = 0; i < tabs.length; i++) {
        var tab = {
          url: tabs[i].url,
          pinned: tabs[i].pinned,
          active: false
        }
        workspaceTabs.push(tab);
      }

			var msg = document.getElementById("message");

			msg.innerHTML = "";
			var workspaceName = document.getElementById("workspaceName").value;
			id = workspaceName.trim().replace(/\s+/g, '-').toLowerCase() + "-ws";

			if (workspaces.hasOwnProperty(id)) {
				msg.innerHTML = "Workspace with same name already exists.";
				msg.className = "workspaceError"
				return;
			}

			if (workspaceName.trim() == "") {
		    msg.innerHTML = "Don't forget to name your workspace.";
				msg.className = "workspaceError"
		    return;
		  }

			if (!/^[a-z\d_\s]+$/i.test(workspaceName)) {
				msg.innerHTML = "Workspace names cannot contain symbols.";
				msg.className = "workspaceError"
				return;
			}

      var newWorkspace = {
        name: workspaceName,
        tabs: workspaceTabs
      }

			workspaces[id] = newWorkspace;
			order.unshift(id);
			chrome.storage.sync.set({workspaces: workspaces, order: order});

			msg.innerHTML = "Workspace created!";
			msg.className = "workspaceSuccess"
			setTimeout(hide, 1000);
    });
  });
}

function hide() {
	window.close();
}
