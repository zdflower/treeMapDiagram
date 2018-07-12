// TO DO:
// Agregar texto sobre los rectángulos, en la posición correspondiente.
// Mejorar todo.

var DATA_URL = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json";

// Hasta que entienda mejor cómo usar los datos para definir el dominio de la escala de color, explicito las categorías.
var CATEGORIAS = ["Kickstarter", "Drinks", "Gadgets", "Art", "Apparel", "Sculpture", "Games", "Food", "Wearables", "Web", "Gaming Hardware", "Television", "Narrative Film", "3D Printing", "Hardware", "Technology", "Sound", "Video Games", "Tabletop Games", "Product Design"];

var color = {
  "Kickstarter": 'red',
  "Drinks": 'green',
  "Gadgets": 'blue',
  "Art": 'orange',
  "Apparel": 'purple',
  "Sculpture": 'lime',
  "Games": 'violet',
  "Food": 'darkgoldenrod',
  "Wearables": 'teal',
  "Web": 'olive',
  "Gaming Hardware": 'navy',
  "Television": 'maroon',
  "Narrative Film": "burlywood",
  "3D Printing": "coral",
  "Hardware": "chartreuse",
  "Technology": "crimson",
  "Sound": "cadetblue",
  "Video Games": "darkkhaki",
  "Tabletop Games": "darkorchid",
  "Product Design": "lightgreen"
};

var w = 1000;
var h = 500;
var padding = 60;
var margin = { right: 20, left: 20, top: 40, bottom: 40 };

//   const color = d3.scaleOrdinal()
//   .range(d3.schemePiYG[7]);
// color.range(["red", "blue", "green"])
// .attr("fill", (d)=> d.children ? "orange" : color(d.parent.category)

var tooltip = d3.select("body").append("div").attr("id", "tooltip").style("opacity", 0);

var svg = d3.select("body").append("svg").attr("width", w + margin.right + margin.left).attr("height", h + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("text").attr("id", "title").attr("x", (w - margin.right - margin.left) / 2).attr("y", 0 - margin.top / 2).attr("text-anchor", "middle").text("Kickstarter funding data");

svg.append("text").attr("id", "description").attr("x", (w - margin.right - margin.left) / 2).attr("y", h - margin.bottom / 2).attr("text-anchor", "middle").text("Top 100 Most Pledged Kickstarter Campaigns Grouped By Category");

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

    // el dominio deberían ser los nombres de las categorías de los datos
    //console.error(root.descendants())
    //   color.domain(CATEGORIAS);

    svg.selectAll("rect").data(root.leaves()).enter().append("rect").attr('class', 'tile').attr('x', function (d) {
      return d.x0;
    }).attr('y', function (d) {
      return d.y0;
    }).attr('width', function (d) {
      return d.x1 - d.x0;
    }).attr('height', function (d) {
      return d.y1 - d.y0;
    }).attr("fill", function (d) {
      // console.error(d);
      return d.children ? "orange" : color[d.parent.data.name];
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

    // Agregar etiquetas a las categorías
    // adaptado de http://d3indepth.com/layouts/
    var nodes = d3.select('svg g').selectAll('g').data(root.descendants()).enter().append('g').attr('transform', function (d) {
      return 'translate(' + [d.x0, d.y0] + ')';
    });

    nodes.append('text').attr('dx', 4).attr('dy', 5).style("font-size", "0.6em").style("font-weight", "bold").style("text-transform", "uppercase").text(function (d) {
      var name = '';
      if (d.children) name = d.data.name;
      return name;
    });
    // fin agregado de etiquetas
  } // ready function    

  var legend = d3.select("body").append("svg").attr("width", "400px").attr("height", "1000px").append("g").attr("id", "legend").attr("transform", "translate(" + 40 + "," + 20 + ")");

  // colour rectangles
  legend.selectAll("rect").data(CATEGORIAS).enter().append("rect").attr("fill", function (d) {
    return color[d];
  }).attr("stroke", "black").attr("stroke-width", "1px").attr("width", 30).attr("height", 20).attr("x", 0).attr("y", function (d, i) {
    return i * 20;
  }).attr("class", "legend-item");

  legend.selectAll("text").data(CATEGORIAS).enter().append("text").attr("x", 40).attr("y", function (d, i) {
    return 15 + i * 20;
  }).text(function (d) {
    return d;
  });
}