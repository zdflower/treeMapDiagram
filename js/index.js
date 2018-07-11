// TO DO:
// Agregar una leyenda con id="legend"
// Usar una escala de colores con uno para cada categoría.
// Agregar texto sobre los rectángulos, en la posición correspondiente.

var DATA_URL = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json";

// Hasta que entienda mejor cómo usar los datos para definir el dominio de la escala de color, explicito las categorías.
var CATEGORIAS = ["Kickstarter", "Drinks", "Gadgets", "Art", "Apparel", "Sculpture", "Games", "Food", "Wearables", "Web", "Gaming Hardware", "Television", "Narrative Film", "3D Printing", "Hardware", "Technology", "Sound", "Video Games", "Tabletop Games", "Product Design"];

var w = 1000;
var h = 450;
var padding = 60;
var margin = { right: 20, left: 20, top: 40, bottom: 40 };

var color = d3.scaleOrdinal().range(d3.schemePiYG[7]);
// color.range(["red", "blue", "green"])
// .attr("fill", (d)=> d.children ? "orange" : color(d.parent.category)

var tooltip = d3.select("body").append("div").attr("id", "tooltip").style("opacity", 0);

var svg = d3.select("body").append("svg").attr("width", w + margin.right + margin.left).attr("height", h + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("text").attr("id", "title").attr("x", (w - margin.right - margin.left) / 2).attr("y", 0 - margin.top / 2).attr("text-anchor", "middle").text("Kickstarter funding data");

svg.append("text").attr("id", "description").attr("x", (w - margin.right - margin.left) / 2).attr("y", h - margin.bottom / 2).attr("text-anchor", "middle").text("Top 100 Most Pledged Kickstarter Campaigns Grouped By Category");

// D3 in Depth http://d3indepth.com/layouts
var treemapLayout = d3.treemap();
treemapLayout.size([w - margin.right - margin.left, h - margin.top - margin.bottom]).paddingOuter(5);

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

    // el dominio deberían ser los nombres de las categorías de los datos
    //console.error(root.descendants())
    color.domain(CATEGORIAS);

    svg.selectAll("rect").data(root.leaves()).enter().append("rect").attr('class', 'tile').attr('x', function (d) {
      return d.x0;
    }).attr('y', function (d) {
      return d.y0;
    }).attr('width', function (d) {
      return d.x1 - d.x0;
    }).attr('height', function (d) {
      return d.y1 - d.y0;
    }).attr("fill", function (d) {
      //console.error(d);
      return d.children ? "orange" : color(d.parent.data.name);
    }).attr('data-name', function (d) {
      return d.data.name;
    }).attr('data-category', function (d) {
      return d.data.category;
    }).attr('data-value', function (d) {
      return d.data.value;
    }).on("mouseover", function (d) {
      tooltip.attr('data-value', d.data.value);
      tooltip.transition().duration(200).style("opacity", 0.9);
      var name = d.data.name;
      var category = d.data.category.toUpperCase();
      var value = d.data.value;
      var text = '';
      if (name) {
        text += '<p><strong>' + name + '</strong></p>';
      }
      if (category) {
        text += '<p>' + category + '</p>';
      }
      if (value) {
        text += '<p>' + value + '</p>';
      }
      tooltip.html(text);
      tooltip.style("left", d3.event.pageX + "px").style("top", d3.event.pageY - 28 + "px");
    }).on("mouseout", function () {
      return tooltip.transition().duration(500).style("opacity", 0);
    });
  }
}