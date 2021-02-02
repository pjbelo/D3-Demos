// https://observablehq.com/@d3/marimekko-chart@186
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["sales.csv",new URL("./files/2378a45ba7042c019ad46d1361a4658e3b8e5de47a2049d3ddf19fd8b675db1e14994d017a36452566ea2ad346c6954891a12a35868ad44a082aa31a8840e0a1",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Marimekko Chart

This Marimekko chart is a two-level “slice-and-dice” [treemap](/@mbostock/d3-treemap).`
)});
  main.variable(observer("chart")).define("chart", ["treemap","data","d3","width","height","format","color"], function(treemap,data,d3,width,height,format,color)
{
  const root = treemap(data);

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .style("font", "10px sans-serif");

  const node = svg.selectAll("g")
    .data(root.descendants())
    .join("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

  const column = node.filter(d => d.depth === 1);

  column.append("text")
      .attr("x", 3)
      .attr("y", "-1.7em")
      .style("font-weight", "bold")
      .text(d => d.data[0]);

  column.append("text")
      .attr("x", 3)
      .attr("y", "-0.5em")
      .attr("fill-opacity", 0.7)
      .text(d => format(d.value));

  column.append("line")
      .attr("x1", -0.5)
      .attr("x2", -0.5)
      .attr("y1", -30)
      .attr("y2", d => d.y1 - d.y0)
      .attr("stroke", "#000")

  const cell = node.filter(d => d.depth === 2);

  cell.append("rect")
      .attr("fill", d => color(d.data[0]))
      .attr("fill-opacity", (d, i) => d.value / d.parent.value)
      .attr("width", d => d.x1 - d.x0 - 1)
      .attr("height", d => d.y1 - d.y0 - 1);

  cell.append("text")
      .attr("x", 3)
      .attr("y", "1.1em")
      .text(d => d.data[0]);

  cell.append("text")
      .attr("x", 3)
      .attr("y", "2.3em")
      .attr("fill-opacity", 0.7)
      .text(d => format(d.value));

  return svg.node();
}
);
  main.variable(observer("treemap")).define("treemap", ["d3","width","margin","height"], function(d3,width,margin,height){return(
data => d3.treemap()
    .round(true)
    .tile(d3.treemapSliceDice)
    .size([
      width - margin.left - margin.right, 
      height - margin.top - margin.bottom
    ])
  (d3.hierarchy(d3.group(data, d => d.x, d => d.y)).sum(d => d.value))
  .each(d => {
    d.x0 += margin.left;
    d.x1 += margin.left;
    d.y0 += margin.top;
    d.y1 += margin.top;
  })
)});
  main.variable(observer("format")).define("format", function(){return(
d => d.toLocaleString()
)});
  main.variable(observer("color")).define("color", ["d3","data"], function(d3,data){return(
d3.scaleOrdinal(d3.schemeCategory10).domain(data.map(d => d.y))
)});
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("sales.csv").text(), ({market, segment, value}) => ({x: market, y: segment, value}))
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 30, right: -1, bottom: -1, left: 1}
)});
  main.variable(observer("height")).define("height", ["width"], function(width){return(
width
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  return main;
}
