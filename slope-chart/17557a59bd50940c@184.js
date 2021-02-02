// https://observablehq.com/@d3/slope-chart@184
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["government-receipts-of-gdp.csv",new URL("./files/1f3a7284ee0057fb10c882c6348cb22a8633a1454de1ab7eec14971c1f212b61d120f213b836b82cf9336d91dbf5a955aa9f5dce81660c4cf42d7661e5b403d3",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Slope Chart

Also known as a *slopegraph*, this chart shows change between two (or a few) discrete points in time. An iterative *dodge* method avoids label overlap. The values here are government receipts as a percentage of GDP. Based on [Tufte](https://www.edwardtufte.com/bboard/q-and-a-fetch-msg?msg_id=0003nk).`
)});
  main.variable(observer("chart")).define("chart", ["d3","width","height","data","x","line","padding","n","formatNumber","dodge","y","halo"], function(d3,width,height,data,x,line,padding,n,formatNumber,dodge,y,halo)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("font-family", "sans-serif")
      .attr("font-size", 10);

  svg.append("g")
      .attr("text-anchor", "middle")
    .selectAll("g")
    .data(data.columns)
    .join("g")
      .attr("transform", (d, i) => `translate(${x(i)},20)`)
      .call(g => g.append("text").text(d => d))
      .call(g => g.append("line").attr("y1", 3).attr("y2", 9).attr("stroke", "currentColor"));

  svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "currentColor")
    .selectAll("path")
    .data(data)
    .join("path")
      .attr("d", d => line(d.values));

  svg.append("g")
    .selectAll("g")
    .data(data.columns)
    .join("g")
      .attr("transform", (d, i) => `translate(${x(i) + (i === 0 ? -padding : i === n - 1 ? padding : 0)},0)`)
      .attr("text-anchor", (d, i) => i === 0 ? "end" : i === n - 1 ? "start" : "middle")
    .selectAll("text")
    .data((d, i) => d3.zip(
      data.map(i === 0 ? d => `${d.name} ${formatNumber(d.values[i])}`
        : i === n - 1 ? d => `${formatNumber(d.values[i])} ${d.name}`
        : d => `${formatNumber(d.values[i])}`),
      dodge(data.map(d => y(d.values[i])))))
    .join("text")
      .attr("y", ([, y]) => y)
      .attr("dy", "0.35em")
      .text(([text]) => text)
      .call(halo);

  return svg.node();
}
);
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment)
{
  const data = d3.csvParseRows(await FileAttachment("government-receipts-of-gdp.csv").text());
  return Object.assign(data.slice(1).map(([name, ...values]) => ({name, values: values.map(x => +x)})), {
    columns: data[0].slice(1)
  });
}
);
  main.variable(observer("dodge")).define("dodge", ["d3"], function(d3){return(
function dodge(positions, separation = 10, maxiter = 10, maxerror = 1e-1) {
  positions = Array.from(positions);
  let n = positions.length;
  if (!positions.every(isFinite)) throw new Error("invalid position");
  if (!(n > 1)) return positions;
  let index = d3.range(positions.length);
  for (let iter = 0; iter < maxiter; ++iter) {
    index.sort((i, j) => d3.ascending(positions[i], positions[j]));
    let error = 0;
    for (let i = 1; i < n; ++i) {
      let delta = positions[index[i]] - positions[index[i - 1]];
      if (delta < separation) {
        delta = (separation - delta) / 2;
        error = Math.max(error, delta);
        positions[index[i - 1]] -= delta;
        positions[index[i]] += delta;
      }
    }
    if (error < maxerror) break;
  }
  return positions;
}
)});
  main.variable(observer("n")).define("n", ["data"], function(data){return(
data.columns.length
)});
  main.variable(observer("halo")).define("halo", function(){return(
function halo(text) {
  text.clone(true)
      .each(function() { this.parentNode.insertBefore(this, this.previousSibling); })
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 4)
      .attr("stroke-linejoin", "round");
}
)});
  main.variable(observer("line")).define("line", ["d3","x","y"], function(d3,x,y){return(
d3.line()
    .x((d, i) => x(i))
    .y(y)
)});
  main.variable(observer("x")).define("x", ["d3","n","margin","width"], function(d3,n,margin,width){return(
d3.scalePoint()
    .domain(d3.range(n))
    .range([margin.left, width - margin.right])
    .padding(0.5)
)});
  main.variable(observer("y")).define("y", ["d3","data","height","margin"], function(d3,data,height,margin){return(
d3.scaleLinear()
    .domain(d3.extent(data.flatMap(d => d.values)))
    .range([height - margin.bottom, margin.top])
)});
  main.variable(observer("formatNumber")).define("formatNumber", ["y"], function(y){return(
y.tickFormat(100)
)});
  main.variable(observer("height")).define("height", function(){return(
600
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 40, right: 50, bottom: 10, left: 50}
)});
  main.variable(observer("padding")).define("padding", function(){return(
3
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  return main;
}
