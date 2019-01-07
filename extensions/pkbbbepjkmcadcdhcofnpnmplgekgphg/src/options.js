const config = require('../theme_config.json');

class Options
{

  runOptions()
  {
    var checked = [];
    document.addEventListener("DOMContentLoaded", function(){
      var video = localStorage.getItem("video");
      /*--------------------------------------------------------------
      get the inserted quicklinks from storage
      --------------------------------------------------------------*/
      if(localStorage.getItem("checked")){
        checked = JSON.parse(localStorage.getItem("checked"));
        var inputs = document.getElementById("quicklinks").childNodes;
        var check;
        var label;
        /*----------------------------------
          for the length of the quicklinks search a 'free' checkbox
          to insert the quicklink
        ----------------------------------*/
        for(var j=0; j < checked.length; j++){
          for(var i=0; i<inputs.length; i++){
            if(inputs[i].className =="checkbox" && inputs[i].style.display === "none"){
              check = inputs[i];
              i = inputs.length;
            }
          }
          try{
            var id = check.id;
            id = id.replace("d","");
            // get the corresponding label
            label = document.getElementById("l"+id);
            // url an title of quicklink
            var url = checked[j].url;
            var title = checked[j].title;
            //for identification get the child label and set url as id
            for(var k=0; k< check.childNodes.length; k++){
              if(check.childNodes[k].tagName == "LABEL"){
                check.childNodes[k].id = url;
              }
            }
            check.style.display = "inline";
            label.style.display = "inline";
            document.getElementById("b"+id).style.display = "inline";

            //remove the content of label and insert favicon and title
            while(label.firstChild){
              label.removeChild(label.firstChild);
            }
            var favicon = document.createElement("img");
            favicon.src = "chrome://favicon/" + url;
            label.appendChild(favicon);
            var text = document.createElement('div');
            text.appendChild(document.createTextNode(title));
            text.style.marginLeft = "5px";
            text.style.display = "inline";
            label.appendChild(text);

            // load quicklinks into wallpaper
            var bmc = document.getElementById("bmc");
            var a = document.createElement("a");
            a.href = url;
            a.id = "a" +id;
            var favicon = document.createElement("img");
            favicon.src = "chrome://favicon/" + url;
            a.appendChild(favicon);
            bmc.appendChild(a);

          }//if error happens
          catch(err){
            alert(err)
          }
        }
      }else{
        var checked = [];
      }
    });




    /*--------------------------------------------------
     submit of a quicklink
    --------------------------------------------------*/
    document.getElementById("submit1").addEventListener("click", function(e){
      var input = document.getElementById("quicklink");

      if(localStorage.getItem("checked")){
        checked = JSON.parse(localStorage.getItem("checked"));
      }
      if(input.value != ""){
        var url = input.value;
        var inputs = document.getElementById("quicklinks").childNodes;
        var check;
        var label;
        for(var i=0; i<inputs.length; i++){
          if(inputs[i].className =="checkbox" && inputs[i].style.display == "none"){
            check = inputs[i];
            check.childNodes[0].checked = true;
            i = inputs.length;
          }
        }
        /*----------------------------------------
          get the title of Webpage
          add it to settings quicklink content
          and to documents display of quicklinks
        -----------------------------------------*/
        $.ajax({
          url: url,
          async: true,
          success: function(data) {
            try{
              //getting a title of max 25 characters
              var matches = data.match(/<title(.*?)>(.*?)<\/title>/);
              var replace = data.match(/<title(.*?)>/);
              if(matches){
                matches = matches[0];
                matches = matches.replace(replace[0],"");
                matches = matches.replace("</title>","");
              }
              else{
                matches = "";
              }
              if(matches.length > 25){
                matches = matches.slice(0,24);
              }
              var id = check.id;
              id = id.replace("d","");
              //putting id for identification to child label
              for(var k=0; k< check.childNodes.length; k++){
                if(check.childNodes[k].tagName == "LABEL"){
                  check.childNodes[k].id = url;
                }
              }
              //get representative label and add favicon and title
              label = document.getElementById("l"+id);
              var favicon = document.createElement("img");
              favicon.src = "chrome://favicon/"+ url;
              while(label.firstChild){
                label.removeChild(label.firstChild);
              }
              label.appendChild(favicon);
              var text = document.createElement('div');
              text.appendChild(document.createTextNode(matches));
              text.style.marginLeft = "5px";
              text.style.display = "inline";
              label.appendChild(text);
              label.style.display = "inline";
              document.getElementById("b"+id).style.display = "inline";
              // add the quicklink properties to the checked array
              checked.push({
                "url":url,
                "title":matches
              });
              //set checked to localStorage
              localStorage.setItem("checked",JSON.stringify(checked));
              check.style.display = "inline";

              // load quicklinks favicon to documents content
              var bmc = document.getElementById("bmc");
              var a = document.createElement("a");
              a.id = "a" +id;
              a.href = url;
              var favicon = document.createElement("img");
              favicon.src = "chrome://favicon/" + url;
              a.appendChild(favicon);
              bmc.appendChild(a);
            } catch(err){
              //not more than five quicklinks possible
              console.log(err);
            }
          }
        });
      }
    });

    /*---------------------------------------------------
    remove quicklink wenn checkbox is clicked
    --------------------------------------------------*/
    document.addEventListener("click", function(e){
      if(e.target.classList.contains("labelInput")){
          var id = e.target.parentNode.id.replace("d","");
          var lab = document.getElementById("l"+id);
          lab.style.display = "none";
          e.target.parentNode.style.display = "none"
          document.getElementById("b"+id).style.display = "none";
          if(localStorage.getItem("checked")){
            checked = JSON.parse(localStorage.getItem("checked"));
          }
          var a = document.getElementById("a"+id);
          //remove a tag for quicklink from document
          a.remove();
          // remove quicklink from checked array via the child label id
          for(var i = 0; i<checked.length; i++){
            if(checked[i].url == e.target.id){
              checked.splice(i,1);
            }
          }
          localStorage.setItem("checked", JSON.stringify(checked));
      }
    });

  }
  /**
    * Dynamic suggestion divs
    */
    displaySuggestions()
    {
      let length = config['playlists'].length;
      if(length>0 && config['playlists'][0]!=""){
        for(let i = 0; i < length; i++)
        {

          let sugg = document.createElement('div');
          sugg.className = 'suggestion';
          sugg.id = 'suggestion' + i;
          let img = document.createElement('img');
          img.src = 'images/youtube.png';

          sugg.appendChild(img);
          sugg.appendChild(document.createTextNode(chrome.i18n.getMessage("suggestion" + i)));
          document.getElementById('video').appendChild(sugg);

          /*----------------------------
          play video suggestion
          ----------------------------*/
          sugg.addEventListener("click", function(e){
            let url = config['playlists'][i];
            document.getElementById("v").value = url;
            localStorage.setItem("video", url);
          });

        }
      }else{
        $('#sugg_desc').hide();
      }
    }

}

module.exports = Options;
