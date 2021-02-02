// https://observablehq.com/@bagami/factbook-json-europe-explorer@214
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["factbook@2.json",new URL("./files/5e0a0375bb769741e6999824000a3482b76bc2110d2dc1377f6336f424519dfc29f594aca53d5a695333377d8fcf8639d191c2ae009dd76f2d1ba0f18a2ac7c0",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Factbook.json Europe explorer

A map view with on-hover country info.

Data: [factbook.json - World Factbook Country Profiles in JSON](https://github.com/factbook/factbook.json)
`
)});
  main.variable(observer("map")).define("map", ["width","height","d3","DOM","areas"], function(width,height,d3,DOM,areas)
{
  const W = width;
  const H = (W * height) / width;
  const svg = d3
    .select(DOM.svg(W, H))
    .style("border", "1px solid #000")
    .style("background", "#eee");
  const g = svg.append("g");
  const g_countries = g.append("g");

  const graticules = g
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "rgba(0,0,0,.1)");

  let x = 0;
  let z = 1;

  const projection = d3
    .geoConicConformal()
    .parallels([40, 68])
    .rotate([-10 + x / z / 15, 0])
    .center([8 - 10, 53.823])
    .scale(width * 1.36 * z)
    .translate([W / 2, H / 2]);

  const path = d3.geoPath().projection(projection);

  const countries = g_countries.selectAll("path").data(areas);

  countries
    .enter()
    .append("path")
    .attr('class', 'country')
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-linejoin", "round")
    .merge(countries)
    .attr("d", path);

  const tooltip = svg.append("g");

  graticules.attr("d", path(d3.geoGraticule().step([20, 20])()));

  return svg.node();
}
);
  main.variable(observer("styles")).define("styles", ["html"], function(html){return(
html`
  <style>

  .svg-tooltip {
    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple   Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    background: rgba(69,77,93,.9);
    border-radius: .1rem;
    color: #fff;
    display: block;
    font-size: 13px;
    max-width: 600px;
    padding: .2rem .4rem;
    position: absolute;
    white-space: pre-wrap;
    word-wrap: break-word;    
    z-index: 300;
    visibility: hidden;
  }
</style>`
)});
  main.variable(observer("formatTooltip")).define("formatTooltip", function(){return(
(name, country) => {
  if (!country) return '💩';
  else {
    return `${name}
🤴 ${country['Government']['Government type'].text}
🧑‍🤝‍🧑 ${country['People and Society']['Population'].text}
💰 ${country['Economy']['GDP - per capita (PPP)'].text}
📜 ${country.Introduction.Background.text}`;
  }
}
)});
  main.variable(observer("tooltip")).define("tooltip", ["map","d3","formatTooltip","factbook"], function(map,d3,formatTooltip,factbook)
{
  map;

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .text("I'm a circle!");

  d3.selectAll(".country")
    .on("mouseover", function() {
      d3.select(this)
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .raise();

      return tooltip.style("visibility", "visible");
    })
    .on("mousemove", (event, d) => {
      let country = d.properties.iso_a2.toLowerCase();
      tooltip.text(formatTooltip(d.properties.name, factbook[country]));
      return tooltip
        .style("top", event.pageY - 10 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      d3.select(this)
        .attr("stroke", 'black')
        .attr("stroke-width", 1)
        .lower();
      return tooltip.style("visibility", "hidden");
    });
}
);
  main.variable(observer("factbook")).define("factbook", ["FileAttachment"], function(FileAttachment){return(
FileAttachment('factbook@2.json').json()
)});
  main.variable(observer("height")).define("height", ["width","ratio"], function(width,ratio){return(
width / ratio
)});
  main.variable(observer("ratio")).define("ratio", function(){return(
1.1925
)});
  main.variable(observer("path")).define("path", ["d3","projection"], function(d3,projection){return(
d3.geoPath().projection(projection)
)});
  main.variable(observer("projection")).define("projection", ["d3","width","height"], function(d3,width,height){return(
d3
  .geoConicConformal()
  .parallels([40, 68])
  .rotate([-9.05, 0])
  .center([9.5 - 9.05, 54.1])
  .scale(1690)
  .translate([width / 2, height / 2])
)});
  main.variable(observer("graticule")).define("graticule", ["d3"], function(d3){return(
d3.geoGraticule10()
)});
  main.variable(observer()).define(["areas"], function(areas){return(
areas
  .map(d => {
    return { name: d.properties.sovereignt, code: d.properties.iso_a2 };
  })
  .filter(d => d.name == 'Slovakia')
)});
  main.variable(observer("areas")).define("areas", ["world"], function(world){return(
world.features

  // select only countries in europe
  .filter(
    o =>
      o.properties.continent == "Europe" ||
      o.properties.name == "Morocco" ||
      o.properties.name == "Algeria" ||
      o.properties.name == "Libya" ||
      o.properties.name == "Egypt" ||
      o.properties.name == "Jordan" ||
      o.properties.name == "Israel" ||
      o.properties.name == "Lebanon" ||
      o.properties.name == "Syria" ||
      o.properties.name == "Tunisia" ||
      o.properties.name == "Turkey" ||
      o.properties.name == "Greenland"
  )

  // flatten multipolygons into polygons
  .reduce((countries2, feature) => {
    if (feature.geometry.type == "Polygon") {
      countries2.push(feature);
    } else {
      // MultiPolygon
      feature.geometry.coordinates.forEach(coordinates => {
        countries2.push({
          type: "Feature",
          properties: feature.properties,
          geometry: { type: "Polygon", coordinates }
        });
      });
    }

    return countries2;
  }, [])
)});
  main.variable(observer("world")).define("world", ["d3"], function(d3){return(
d3.json(
  "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson"
)
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require("topojson-client@3")
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3@6')
)});
  return main;
}
