$(document).ready(function() {
  window.loadToDoList();
});

window.loadToDoList = function() {
  var e = [];
  $("#lnk_todo").hide();
  $(".todo-panel").hide();
  $(".todo_list ul").empty();
  if (localStorage.getItem("todoList")) {
    e = JSON.parse(localStorage.getItem("todoList"));
    e.forEach(e => {
      let o = e.id;
      let t = e.value;
      let l = e.status;
      let a = $("<li>");
      a.html(`<input type="checkbox" id="${o}" class="markDone"><label for="${o}">${t}</label><i class="dl_btn" dl-for="${o}"></i>`);
      a.css({
        display: "none"
      });
      $(".todo_list ul").append(a);
      a.fadeIn();
      if (l === "checked") {
        $(`#${o}`).prop("checked", true);
        $(`#${o}`).next("label").css({
          "text-decoration": "line-through",
          opacity: ".5"
        });
      }
    });
    o();
  }
  if (localStorage.getItem("hideTodoPanel") == "yes") {
    $(".todo-panel").fadeOut();
    $(".todo-panel").addClass("hide_panel");
  } else {
    $(".todo-panel").fadeIn();
    $(".todo-panel").removeClass("hide_panel");
  }
  if (localStorage.getItem("enable_todo") == "no") {
    $("#lnk_todo").fadeOut();
    $(".todo-panel").fadeOut();
  } else {
    $("#lnk_todo").fadeIn();
  }
  $("#enable_todo").prop("checked", localStorage.getItem("enable_todo") === "yes");
  $("#enable_todo").off("change");
  $("#enable_todo").on("change", function() {
    if (!$("#enable_todo").is(":checked")) {
      localStorage.setItem("enable_todo", "no");
      localStorage.setItem("hideTodoPanel", "yes");
      $("#lnk_todo").fadeOut();
      $(".todo-panel").fadeOut();
      $(".todo-panel").addClass("hide_panel");
    } else {
      localStorage.setItem("enable_todo", "yes");
      localStorage.setItem("hideTodoPanel", "no");
      $("#lnk_todo").fadeIn();
      $(".todo-panel").fadeIn();
      $(".todo-panel").removeClass("hide_panel");
    }
    chrome.runtime.sendMessage({
      changeOptions: utils.getGlobalOptions()
    });
    utils.localstorage2cookie();
  });
  $("#newToDo").off("keypress");
  $("#newToDo").on("keypress", function(t) {
    if (t.which === 13 && $(this).val().length > 0) {
      let t = [];
      e.forEach(e => {
        t.push(Number(e.id));
      });
      let l = 1;
      if (t.length > 0) {
        l = Math.max(...t) + 1;
      }
      let a = $(this).val().charAt(0).toUpperCase() + $(this).val().slice("1");
      let n = $("<li>");
      n.html(`<input type="checkbox" id="${l}" class="markDone"><label for="${l}">${a.toString()}</label><i class="dl_btn" dl-for="${l}"></i>`);
      n.css({
        display: "none"
      });
      $(".todo_list ul").append(n);
      n.fadeIn();
      $(this).val("");
      let s = {
        id: l,
        value: a,
        status: "uncheck"
      };
      e.push(s);
      localStorage.setItem("todoList", JSON.stringify(e));
      chrome.runtime.sendMessage({
        changeOptions: utils.getGlobalOptions()
      });
      utils.localstorage2cookie();
      o();
    }
  });
  function o() {
    $(".markDone").off("change");
    $(".markDone").on("change", function() {
      let o = $(this).attr("id");
      let t = e[0];
      e.forEach((l, a) => {
        if (Number(l.id) === Number(o)) {
          t = e[a];
        }
      });
      if ($(this).is(":checked")) {
        t.status = "checked";
        $(this).next("label").css({
          "text-decoration": "line-through",
          opacity: ".5"
        });
      } else {
        t.status = "uncheck";
        $(this).next("label").css({
          "text-decoration": "unset",
          opacity: "1"
        });
      }
      localStorage.setItem("todoList", JSON.stringify(e));
      chrome.runtime.sendMessage({
        changeOptions: utils.getGlobalOptions()
      });
      utils.localstorage2cookie();
    });
    $(".dl_btn").off("click");
    $(".dl_btn").on("click", function() {
      let o = $(this).attr("dl-for");
      e.forEach((t, l) => {
        if (Number(t.id) === Number(o)) {
          e.splice(l, 1);
        }
      });
      localStorage.setItem("todoList", JSON.stringify(e));
      chrome.runtime.sendMessage({
        changeOptions: utils.getGlobalOptions()
      });
      utils.localstorage2cookie();
      $(this).parent().fadeOut(function() {
        $(this).remove();
      });
    });
  }
  $("#lnk_todo, #hide_todoPanel").off("click");
  $("#lnk_todo, #hide_todoPanel").on("click", function() {
    var e = localStorage.getItem("hideTodoPanel");
    if (e === "no") {
      e = "yes";
      $(".todo-panel").fadeOut();
    } else {
      e = "no";
      $(".todo-panel").fadeIn(function() {
        $("#newToDo").focus();
      });
    }
    $(".todo-panel").toggleClass("hide_panel");
    localStorage.setItem("hideTodoPanel", e);
    chrome.runtime.sendMessage({
      changeOptions: utils.getGlobalOptions()
    });
    utils.localstorage2cookie();
  });
};