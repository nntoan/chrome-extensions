function isBookPage() {
  var el = $("#nav-subnav");
  var category = el.attr("data-category");
  return (el && (category == "books" || category == "digital-text"));
};

function getBookTitle() {
  return $("#productTitle, #btAsinTitle")
    .text()
    .replace("[Kindle Edition]", "")
    .replace("[Paperback]", "")
    .replace("[Hardcover]", "");
}

function queryLibGen(query) {
  var url = "http://libgen.io/search.php?open=0&view=simple&column=def&req=" + encodeURIComponent(query);
  var loader_image = chrome.extension.getURL("images/ajax-loader.gif");
  var loading = $("<div style='background-color: #FFFFFF;'><center><img src='" + loader_image + "' /><h4>Searching the awesome Library Genesis..</h4></center></div>");
  var nav_element = $("#nav-subnav");
  nav_element.after(loading);

  $.get(url)
    .done(function(data) {
      var results = $("<div>").append(data).find(".c");

      if(results.find("tr").length == 1) { // only table header is received
        loading.html("<div style='background-color: #F0AD4E; padding: 5px'><center><h3>Couldn't find anything on LibGen</h3></div>");
      } else {
        results.find("a").each(function() {
          if($(this).attr("href").indexOf("http://") != 0) {
            $(this).attr("href", "http://libgen.io/" + $(this).attr("href"));
          }
        });
        loading.html(results);
      }
    });

}

(function main() {
  if(isBookPage()) {
    var title = getBookTitle();
    queryLibGen(title);
  }
})();