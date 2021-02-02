// https://observablehq.com/@ncastaldo/change-of-hospital-beds-in-ue@494
import define1 from "./a33468b95d0b15b0@699.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# % Change of total Hospital Beds in UE

Percentual Change of total Hospital Beds per 100,000 inhabitants in UE from *2007* to *2017*

Data: [EUROSTAT](https://ec.europa.eu/eurostat/data/database)`
)});
  main.variable(observer()).define(["legend","fnColor"], function(legend,fnColor){return(
legend({
  color: fnColor,
  title: "%Change from 2007 to 2017",
  tickFormat: "+%"
})
)});
  main.variable(observer("chart")).define("chart", ["d3","fnGeoProjection","width","height","topojson","europe","mapping","fnColor","fnGeoPath"], function(d3,fnGeoProjection,width,height,topojson,europe,mapping,fnColor,fnGeoPath)
{
  const svg = d3.create("svg")
  .attr("viewBox", [0, 0, 975, 610])
  .attr("stroke-linecap", "round")
  .attr("stroke-linejoin", "round");
  
  fnGeoProjection.fitExtent(
    [[0, 0],[width, height]], 
    topojson.feature(europe, europe.objects.nutsrg)
  )
  
  svg.selectAll("path")
    .data(topojson.feature(europe, europe.objects.nutsrg).features)
    .enter()
    .append("path")
    .attr("fill", d => 
          d.properties.id in mapping && mapping[d.properties.id].change
          ? fnColor(mapping[d.properties.id].change)
          : '#aaa' 
     )
    .attr("d", fnGeoPath)
    .on("mouseover", fnOver)
    .on("mouseout", fnOut)
  

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  const text = svg.append("text")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("font-size", "18px")
    .style("pointer-events", "none")
    .attr("opacity", 0)
    
  function fnOver(d) {
    d3.select(this).attr('fill-opacity', 0.4)
    const v = mapping[d.properties.id].change
    text.text(`${capitalizeFirstLetter(d.properties.na.toLowerCase())}: ${v ? d3.format("+.1%")(v) : '?%'}`)
      .transition()
      .attr("opacity", 1)
  }
  
  function fnOut() {
    d3.select(this).attr('fill-opacity', null)
    text.transition().attr("opacity", 0)
  }
  
  function fnMove() {
    const p = d3.mouse(this)
    text.attr('x', p[0])
      .attr('y', p[1] - 20)
  }
   
  svg.on("mousemove", fnMove)

  svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "#222")
    .attr("stroke-width", 0.5)
    .style("pointer-events", "none")
    .attr("d", fnGeoPath(topojson.mesh(europe, europe.objects.nutsrg)))

  return svg.node();

}
);
  main.variable(observer("fnGeoProjection")).define("fnGeoProjection", ["d3"], function(d3){return(
d3.geoMercator()
)});
  main.variable(observer("fnGeoPath")).define("fnGeoPath", ["d3","fnGeoProjection"], function(d3,fnGeoProjection){return(
d3.geoPath(fnGeoProjection)
)});
  main.variable(observer("width")).define("width", function(){return(
975
)});
  main.variable(observer("height")).define("height", function(){return(
610
)});
  main.variable(observer("mapping")).define("mapping", ["bedsData"], function(bedsData){return(
Object.keys(bedsData.dimension.geo.category.index)
  .reduce((acc, key, i) => {
    const arr = Object.values(bedsData.dimension.time.category.index)
      .map((j, _, times) => bedsData.value[ i * times.length + j])
      .filter((_, j, values) => j === 0 || j === 10) // first and 11th -> 2007 and 2017
    return {
      ...acc,
      [key]: { 
        change: arr[0] && arr[1] ? (arr[1] - arr[0]) / arr[0] : null,
        arr
      }
    }
  }, {})
)});
  main.variable(observer("fnColor")).define("fnColor", ["d3","mapping"], function(d3,mapping){return(
d3.scaleDiverging(d3.interpolateRdYlGn)
  .domain([
    d3.min(Object.values(mapping), d => d.change), 
    0, 
    d3.max(Object.values(mapping), d => d.change)
  ])
)});
  main.variable(observer()).define(["fnColor"], function(fnColor){return(
fnColor(0)
)});
  main.variable(observer("bedsData")).define("bedsData", ["d3"], async function(d3){return(
await d3.json('https://ec.europa.eu/eurostat/wdds/rest/data/v2.1/json/en/' + 
  'hlth_rs_bds?filterNonGeo=1&precision=1&sinceTimePeriod=2007&unit=P_HTHAB&unitLabel=code&facility=HBEDT')
)});
  main.variable(observer("europe")).define("europe", ["d3"], async function(d3){return(
await d3.json('https://raw.githubusercontent.com/eurostat/Nuts2json/master/2016/4258/20M/0.json')
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require('topojson@3')
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3@5')
)});
  const child1 = runtime.module(define1);
  main.import("legend", child1);
  return main;
}
