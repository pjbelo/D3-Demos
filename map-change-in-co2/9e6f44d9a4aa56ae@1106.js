// https://observablehq.com/@djr4/change-in-co2-and-gdp-ppp-over-years@1106
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Change in CO<sub>2</sub> and GDP (PPP) over years`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
We show bivariate choropleth that illustrates annual GDP per capita and
CO<sub>2</sub> emissions in metric kg (kilograms) per capita over the years.

For some countries there is no data for all years. 
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Note: Use slider to investigate concrete year`
)});
  main.variable(observer("viewof range")).define("viewof range", ["html"], function(html){return(
html`<input type=range min=1990 max=2017 value=2017 />`
)});
  main.variable(observer("range")).define("range", ["Generators", "viewof range"], (G, _) => G.input(_));
  main.variable(observer("viewof colors")).define("viewof colors", ["html","schemes"], function(html,schemes)
{
  const form = html`<form><select name=i>${schemes.map(c => Object.assign(html`<option>`, {textContent: c.name}))}</select>`;
  form.i.selectedIndex = 1;
  form.oninput = () => form.value = schemes[form.i.selectedIndex].colors;
  form.oninput();
  return form;
}
);
  main.variable(observer("colors")).define("colors", ["Generators", "viewof colors"], (G, _) => G.input(_));
  main.variable(observer("map")).define("map", ["d3","DOM","legend","topojson","europe","path","iso_codes","color","range","data","format"], function(d3,DOM,legend,topojson,europe,path,iso_codes,color,range,data,format)
{

  let svg = d3.select(DOM.svg(960, 900))
    .style("max-width", "100%")
    .style("height", "auto")
  
  // legend
  svg.append(legend)
    .attr("transform", "translate(870,450)");
  
  svg.selectAll('path')
    .data(topojson.feature(europe, europe.objects.europe).features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('class', function(d) {
      return iso_codes.find(c => { return c.ISO_3166_2 === d.id }).ISO_3166_3;
    })
    .attr('fill', function(d) {
       let code = iso_codes.find(c => { return c.ISO_3166_2 === d.id }).ISO_3166_3;
       return color[range](data[range].get(code));
    })
    .attr("stroke", "white")
    .attr("stroke-linejoin", "round")
    .append("title")
    .text(d => {
      let code = iso_codes.find(c => { return c.ISO_3166_2 === d.id }).ISO_3166_3;
    return `${d.properties.NAME},
      ${format(data[range].get(code))}`
     });
    ;

 // year ticker
 svg
  .append('g')
 	.append('text')
  .attr('x', function(d) { return '20'; })
  .attr('y', function(d) { return '70'; })
  .style('font-family', 'sans-serif')
  .style('font-size', 52)
  .text(function(d) { 
    return `${range}`;
  })
  .style('fill', '#aaa');

  return svg.node();
  
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`
## Sources:
- https://data.worldbank.org
- http://www.globalcarbonatlas.org/en/CO2-emissions
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Utilities`
)});
  main.variable(observer("legend")).define("legend", ["DOM","svg","n","d3","colors","data","range","labels"], function(DOM,svg,n,d3,colors,data,range,labels){return(
() => {
  const k = 24;
  const arrow = DOM.uid();
  return svg`<g font-family=sans-serif font-size=10>
  <g transform="translate(-${k * n / 2},-${k * n / 2}) rotate(-45 ${k * n / 2},${k * n / 2})">
    <marker id="${arrow.id}" markerHeight=10 markerWidth=10 refX=6 refY=3 orient=auto>
      <path d="M0,0L9,3L0,6Z" />
    </marker>
    ${d3.cross(d3.range(n), d3.range(n)).map(([i, j]) => svg`<rect width=${k} height=${k} x=${i * k} y=${(n - 1 - j) * k} fill=${colors[j * n + i]}>
      <title>${data[range].title[0]}${labels[i] && ` (${labels[i]})`}
${data[range].title[1]}${labels[j] && ` (${labels[j]})`}</title>
    </rect>`)}
    <line marker-end="${arrow}" x1=0 x2=${n * k} y1=${n * k} y2=${n * k} stroke=black stroke-width=1.5 />
    <line marker-end="${arrow}" y2=0 y1=${n * k} stroke=black stroke-width=1.5 />
    <text font-weight="bold" dy="0.71em" transform="rotate(90) translate(${n / 2 * k},6)" text-anchor="middle">${data[range].title[0]}</text>
    <text font-weight="bold" dy="0.71em" transform="translate(${n / 2 * k},${n * k + 6})" text-anchor="middle">${data[range].title[1]}</text>
  </g>
</g>`;
}
)});
  main.variable(observer("schemes")).define("schemes", function(){return(
[
  {
    name: "RdBu", 
    colors: [
      "#e8e8e8", "#e4acac", "#c85a5a",
      "#b0d5df", "#ad9ea5", "#985356",
      "#64acbe", "#627f8c", "#574249"
    ]
  },
  {
    name: "BuPu", 
    colors: [
      "#e8e8e8", "#ace4e4", "#5ac8c8",
      "#dfb0d6", "#a5add3", "#5698b9", 
      "#be64ac", "#8c62aa", "#3b4994"
    ]
  },
  {
    name: "GnBu", 
    colors: [
      "#e8e8e8", "#b5c0da", "#6c83b5",
      "#b8d6be", "#90b2b3", "#567994",
      "#73ae80", "#5a9178", "#2a5a5b"
    ]
  },
  {
    name: "PuOr", 
    colors: [
      "#e8e8e8", "#e4d9ac", "#c8b35a",
      "#cbb8d7", "#c8ada0", "#af8e53",
      "#9972af", "#976b82", "#804d36"
    ]
  }
]
)});
  main.variable(observer("labels")).define("labels", function(){return(
["low", "", "high"]
)});
  main.variable(observer("n")).define("n", ["colors"], function(colors){return(
Math.floor(Math.sqrt(colors.length))
)});
  main.variable(observer("start_year")).define("start_year", function(){return(
1990
)});
  main.variable(observer("end_year")).define("end_year", function(){return(
2018
)});
  main.variable(observer("x")).define("x", ["start_year","end_year","d3","data","n"], function(start_year,end_year,d3,data,n)
{
  let tmp = [];
 for(let i = start_year; i < end_year; i++) {
   tmp[i] = (d3.scaleQuantile(Array.from(data[i].values(), d => d[0]), d3.range(n)));
 }
  
  return tmp;
}
);
  main.variable(observer("y")).define("y", ["start_year","end_year","d3","data","n"], function(start_year,end_year,d3,data,n)
{ 
 let tmp = [];
 for(let i = start_year; i < end_year; i++) {
   tmp[i] = (d3.scaleQuantile(Array.from(data[i].values(), d => d[1]), d3.range(n)))
 }
  
 return tmp;
}
);
  main.variable(observer("color")).define("color", ["start_year","end_year","colors","y","x","n"], function(start_year,end_year,colors,y,x,n)
{
  let f = [];
  for(let i = start_year; i < end_year; i++) {
    f[i]=
      value => {
        if (!value) return "#fff";
        let [a, b] = value;
        return colors[y[i](b) + x[i](a) * n];
      }
   
  }
  return f;
}
);
  main.variable(observer("format")).define("format", ["d3","data","range","labels","x","y"], function(d3,data,range,labels,x,y){return(
(value) => {
  if (!value) return "N/A";
  let [a, b] = value;
  return `\n${a === 0 ? 'N/A' : d3.format(",")(parseInt(a)) + '$'} ${data[range].title[0]}${labels[x[range](a)] && ` (${labels[x[range](a)]})`}
${b && !isNaN(b) ? b.toFixed(4) : 'N/A'} ${data[range].title[1]}${labels[y[range](b)] && ` (${labels[y[range](b)]})`}`;
}
)});
  main.variable(observer("lMargin")).define("lMargin", function(){return(
20
)});
  main.variable(observer("iso_codes")).define("iso_codes", ["d3"], async function(d3){return(
await d3.csv('https://gist.githubusercontent.com/djr4/c06e72fdde0d2780e0831343b1c03c9f/raw/e1894b3b9ac2e448619a1d62266b49c46f949f36/iso3166_alpha2_alpha3.csv')
)});
  main.variable(observer("gdp")).define("gdp", ["d3"], async function(d3){return(
await d3.csv('https://gist.githubusercontent.com/djr4/f688121dc9cb208ec4daca7e337273cb/raw/3056f701e33ebd9c8c1ab1b1297ac15dd311c0a6/gdp_per_capita_ppp_1990-2017.csv')
)});
  main.variable(observer("data")).define("data", ["start_year","end_year","gdp","c02"], function(start_year,end_year,gdp,c02)
{
 
  let a = [];
  for(let i = start_year; i < end_year; i++) {
    let obj = gdp.map(d => {
      let co2_f = c02.find(c => { return d.country_name === c.country_name; });

      return [d.country_code, [+d[i], co2_f ? parseFloat(co2_f[i]) : null ]]
    })
    
    a[i] = Object.assign(new Map(obj), {  title : ["GDP per capita", "C02 in kg"] });

  }
  
  return a;
}
);
  main.variable(observer("c02")).define("c02", ["d3","population","start_year","end_year"], async function(d3,population,start_year,end_year){return(
(await d3.csv('https://gist.githubusercontent.com/djr4/badcf11d61e352e9672337084ec502d4/raw/e6a5ebd78a477a8b6b11ea11c287a40e82ad8d9f/co2_emissions_1960_2017.csv'))
.map(d => {
  const pop = population.find(p => { return p.country_name === d.country_name });
  console.log(pop);
  for(let i = start_year; i < end_year; i++) {
    if(d && pop && d[i] && pop[i]) { 
       d[i] = parseFloat(d[i]) / parseInt(pop[i]) * 1000; // to kg
    }
  }
  
  return d;
})
)});
  main.variable(observer("population")).define("population", ["d3"], async function(d3){return(
await d3.csv('https://gist.githubusercontent.com/djr4/5badd79baa7b870f06e46243e2365806/raw/535c85e0ff0095dd6a8abcfdaf42be6376017bc0/world_population_1960_2017.csv')
)});
  main.variable(observer("europe")).define("europe", function(){return(
fetch('https://gist.githubusercontent.com/djr4/6a8e88d0efdf52d4e75edd9a133917f3/raw/821143de54ba6bf406d1a1588428b076feb33383/europe.topojson').then(res => res.json())
)});
  main.variable(observer("width")).define("width", function(){return(
800
)});
  main.variable(observer("height")).define("height", function(){return(
600
)});
  main.variable(observer("margin")).define("margin", function(){return(
15
)});
  main.variable(observer("projection")).define("projection", ["d3","width","height"], function(d3,width,height){return(
d3.geoMercator()
  .center([13, 52]) 					
	.translate([width/2, height/1.2]) 		
	.scale([width/1.3])
)});
  main.variable(observer("path")).define("path", ["d3","projection"], function(d3,projection){return(
d3.geoPath().projection(projection)
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("https://d3js.org/d3.v5.min.js")
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require("topojson-client@3")
)});
  return main;
}
