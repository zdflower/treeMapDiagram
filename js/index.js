// TO DO:
// agregar una leyenda con id="legend"
// agregar un tooltip

var DATA_URL = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json";

var w = 1000;
var h = 450;
var padding = 60;
var margin = { right: 20, left: 20, top: 40, bottom: 40 };

// const color = d3.scaleOrdinal();
// color.range(["red", "blue", "green"])
//    			.attr("fill", (d)=> d.children ? "orange" : color(d.parent.category)

var svg = d3.select("body").append("svg").attr("width", w + margin.right + margin.left).attr("height", h + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("text").attr("id", "title").attr("x", (w - margin.right - margin.left) / 2).attr("y", 0 - margin.top / 2).attr("text-anchor", "middle").text("Kickstarter funding data");

svg.append("text").attr("id", "description").attr("x", (w - margin.right - margin.left) / 2).attr("y", h - margin.bottom / 2).attr("text-anchor", "middle").text("Description");

// D3 in Depth http://d3indepth.com/layouts
var treemapLayout = d3.treemap();
treemapLayout.size([w - margin.right - margin.left, h - margin.top - margin.bottom]).paddingOuter(10);

d3.queue().defer(d3.json, DATA_URL).await(ready);

function ready(error, data) {
  if (error) console.error(error);else {
    var root = d3.hierarchy(data);
    root.sum(function (d) {
      return d.value;
    });
    root.sort(function (a, b) {
      return a.value - b.value;
    });
    treemapLayout(root);

    svg.append("g").attr("transform", "translate(" + 40 + "," + 40 + ")");

    svg.selectAll("rect").data(root.descendants()).enter().append("rect").attr('class', 'tile').attr('x', function (d) {
      return d.x0;
    }).attr('y', function (d) {
      return d.y0;
    }).attr('width', function (d) {
      return d.x1 - d.x0;
    }).attr('height', function (d) {
      return d.y1 - d.y0;
    }).attr("fill", function (d) {
      return d.children ? "orange" : "green";
    }).attr('data-name', function (d) {
      return d.data.name;
    }).attr('data-category', function (d) {
      return d.data.category;
    }).attr('data-value', function (d) {
      return d.data.value;
    }).append("title").text(function (d) {
      var name = d.data.name;
      var category = d.data.category;
      var value = d.data.value;
      var text = '';
      if (name) {
        text += name;
      }
      if (category) {
        text += ' - ' + category;
      }
      if (value) {
        text += ' - ' + value;
      }

      return text;
    });
  }
}