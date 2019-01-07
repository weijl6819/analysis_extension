var firstLine = $('#firstLine');
var author = $('#author');
var book = $('#book');

$.getJSON( "https://api.myjson.com/bins/125w29", function( data ) {
  var rnd = Math.floor(Math.random() * (data.length));

  firstLine.append(data[rnd].firstline);
  book.append(data[rnd].book);
  author.append("&mdash; " + data[rnd].author);
});