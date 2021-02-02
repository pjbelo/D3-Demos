// https://observablehq.com/@djr4/standard-of-living-in-europe@902
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Standard of Living in Europe
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Data collected in March, 2019`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Different metrics can be used to evaluate standard of living among which are wealth levels, comfort, goods, and necessities that are available to people of different socioeconomic classes. 

However we want to show how life standard plays out for individual seeking to live in one of Europe city capitals , we do this by investigating existing data from more angles and looking for some corelations along the way.

It should be noted that this research is more accurate for single persons meaning not in social unions (like marriage) then for families.

Countries have diverse policies in place to fight negative natality. (including different taxation policies)

Also different countries have different health care policies, for some countries using universal health care model, health care is accounted for in salary taxations as this is compulsory (pay as you earn). However some countries delegate this responsability to the employee. So bare in mind that figures may somewhat vary from this research.

To give an example for most expensive health care system in Europe (Switzerland expenditure on health care is around 11% of GDP) for premium healthcare service you would have to pay additional 300e per month.

However for other counties this is regulated by the state (say France), so our analysis should be correct.

Now that this is clear, we can deep dive into data. Let's start by **average** income. (while we keep in mind that median is much better metric.)
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Average Income
First let's start by showing Europe **average** monthly income by capital city.
(**after tax**)

Note: currency is not shown on vizualization but all figures are in Euros (€)`
)});
  main.variable(observer("averageIncomeMap")).define("averageIncomeMap", ["d3","DOM","width","height","topojson","europe","path","salary_cost_of_living","colorScale","europeCities","projection"], function(d3,DOM,width,height,topojson,europe,path,salary_cost_of_living,colorScale,europeCities,projection)
{
  const svg = d3.select(DOM.svg(width, height))
    .style("max-width", "100%")
    .style("height", "auto")
  
  const g = svg.append("g");
  
  g
    .selectAll("path")
    .data(topojson.feature(europe, europe.objects.europe).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", function(d) {
       var prop = salary_cost_of_living.find(s => { return d.id === s['ISO-3166-2']; });
       if(prop && prop['average_monthly_net_salary_eur']) {
         var color = colorScale(prop['average_monthly_net_salary_eur']);
        return color ? color : '#fff';
       } else {
        return '#efefef'; 
       }
    })
    .attr("stroke", "#E8D7CE")
    .attr("stroke-opacity", 0.7)
    .attr("opacity", 0.5);
  
    // values
    g.selectAll(".city-label")
    .data(europeCities)
    .enter()
    .append("text")
    .attr("class", "city-label")
    .attr("transform", function(d) { return "translate(" + 
      projection([d['CapitalLongitude'], d['CapitalLatitude']])
      + ")"; })
      .attr("dy", "-.2em")
    .attr("dx", function(d) {
      if(d['CountryCode'] === 'AT') { return '-2em'; }
    })
    .text(function(d) { 
      var prop = salary_cost_of_living.find(s => { return d['CountryCode'] === s['ISO-3166-2']; });
      
      return prop && Math.ceil(prop['average_monthly_net_salary_eur']) ? Math.ceil(prop['average_monthly_net_salary_eur']): '';
    })
    .attr("fill", "#900C3F")
    .attr("font-family", "sans-serif")
    .attr("font-size", 14);
  
  // city points
      g.selectAll(".city-point")
    .data(europeCities)
    .enter()
    .append("circle")
    .attr("class", "city-point")
    .attr("transform", function(d) { return "translate(" + 
      projection([d['CapitalLongitude'], d['CapitalLatitude']])
      + ")"; })
    .attr("opacity", 0.3)
    .attr("fill", "#900C3F")
    .attr("r", 2);

  return svg.node()
}
);
  main.variable(observer()).define(["md","salary_cost_of_living"], function(md,salary_cost_of_living){return(
md`Top 10 Europian capitals by income in absolute terms

${[...salary_cost_of_living].filter(s => s.single_person_monthly_costs_eur).sort((a, b) => { return b['average_monthly_net_salary_eur'] - a['average_monthly_net_salary_eur']}).slice(0,10).reduce(((acc, i) => { acc += "\n- " + i.capital + ' (' + i.country + ') ' + Math.floor(i['average_monthly_net_salary_eur']) + '€'; return acc; } ), "")}

`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
Partial explanation for such high income figures in Switzerland (compared to others) is due to long periods of stability and economic growth backed up by implementation of neutrality principle (1815. - present).

However, high income per se doesn't mean much. Let's take a look at average cost of living in Europe capitals.
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Average cost of living`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Average cost of living per month per person (**without rent**) in €`
)});
  main.variable(observer("averageCostOfLivingMap")).define("averageCostOfLivingMap", ["d3","DOM","width","height","topojson","europe","path","salary_cost_of_living","colorScaleCostOfLiving","europeCities","projection"], function(d3,DOM,width,height,topojson,europe,path,salary_cost_of_living,colorScaleCostOfLiving,europeCities,projection)
{
  const svg = d3.select(DOM.svg(width, height))
    .style("max-width", "100%")
    .style("height", "auto")
  
  const g = svg.append("g");
  
  g
    .selectAll("path")
    .data(topojson.feature(europe, europe.objects.europe).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", function(d) {
       var prop = salary_cost_of_living.find(s => { return d.id === s['ISO-3166-2']; });
       if(prop && prop['single_person_monthly_costs_eur']) {
         var color = colorScaleCostOfLiving(prop['single_person_monthly_costs_eur']);
        return color ? color : '#fff';
       } else {
        return '#efefef'; 
       }
    })
    .attr("stroke", "#FDEBE1")
    .attr("stroke-opacity", 0.7)
    .attr("opacity", 0.5);
  
    // values
    g.selectAll(".city-label")
    .data(europeCities)
    .enter()
    .append("text")
    .attr("class", "city-label")
    .attr("transform", function(d) { return "translate(" + 
      projection([d['CapitalLongitude'], d['CapitalLatitude']])
      + ")"; })
      .attr("dy", "-.2em")
    .attr("dx", function(d) {
      if(d['CountryCode'] === 'AT') { return '-2em'; }
    })
    .text(function(d) { 
      var prop = salary_cost_of_living.find(s => { return d['CountryCode'] === s['ISO-3166-2']; });
      
      return prop && Math.ceil(prop['single_person_monthly_costs_eur']) ? Math.ceil(prop['single_person_monthly_costs_eur']): '';
    })
    .attr("fill", "#900C3F")
    .attr("font-family", "sans-serif")
    .attr("font-size", 14);
  
  // city points
      g.selectAll(".city-point")
    .data(europeCities)
    .enter()
    .append("circle")
    .attr("class", "city-point")
    .attr("transform", function(d) { return "translate(" + 
      projection([d['CapitalLongitude'], d['CapitalLatitude']])
      + ")"; })
    .attr("opacity", 0.3)
    .attr("fill", "#900C3F")
    .attr("r", 2);

  return svg.node()
}
);
  main.variable(observer()).define(["md","salary_cost_of_living"], function(md,salary_cost_of_living){return(
md`10 Most expensive cities in absolute terms without accounting for rent

${[...salary_cost_of_living].filter(s => s.single_person_monthly_costs_eur).sort((a, b) => { return b['single_person_monthly_costs_eur'] - a['single_person_monthly_costs_eur']}).slice(0, 10).reduce(((acc, i) => { acc += "\n- " + i.capital + ' (' + i.country + ') ' + Math.floor(i['single_person_monthly_costs_eur']) + '€'; return acc; } ), "")}

`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Now let's combine this data in a basic way. How much person is left with when cost of living is accounted for?
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
- ami - average monthly income after tax
- col - cost of living per person in europe city capital **without rent**

Formula: **ami - col**
`
)});
  main.variable(observer("amiColMap")).define("amiColMap", ["d3","DOM","width","height","topojson","europe","path","salary_cost_of_living","colorScaleAvgSalary","europeCities","projection"], function(d3,DOM,width,height,topojson,europe,path,salary_cost_of_living,colorScaleAvgSalary,europeCities,projection)
{
  const svg = d3.select(DOM.svg(width, height))
    .style("max-width", "100%")
    .style("height", "auto")
  
  const g = svg.append("g");
  
  g
    .selectAll("path")
    .data(topojson.feature(europe, europe.objects.europe).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", function(d) {
       var prop = salary_cost_of_living.find(s => { return d.id === s['ISO-3166-2']; });
       if(prop && prop['average_monthly_net_salary_eur'] && prop['single_person_monthly_costs_eur']) {
         var color = colorScaleAvgSalary(prop['average_monthly_net_salary_eur'] - prop['single_person_monthly_costs_eur']);
        return color ? color : '#fff';
       } else {
        return '#efefef'; 
       }
    })
    .attr("stroke", "#E8D7CE")
    .attr("stroke-opacity", 0.7)
    .attr("opacity", 0.5);
  
    // values
    g.selectAll(".city-label")
    .data(europeCities)
    .enter()
    .append("text")
    .attr("class", "city-label")
    .attr("transform", function(d) { return "translate(" + 
      projection([d['CapitalLongitude'], d['CapitalLatitude']])
      + ")"; })
      .attr("dy", "-.2em")
    .attr("dx", function(d) {
      if(d['CountryCode'] === 'AT') { return '-2em'; }
    })
    .text(function(d) { 
      var prop = salary_cost_of_living.find(s => { return d['CountryCode'] === s['ISO-3166-2']; });
      
      return prop && Math.ceil(prop['average_monthly_net_salary_eur']) ? Math.ceil(prop['average_monthly_net_salary_eur'] - prop['single_person_monthly_costs_eur']): '';
    })
    .attr("fill", "#900C3F")
    .attr("font-family", "sans-serif")
    .attr("font-size", 14);
  
  // city points
      g.selectAll(".city-point")
    .data(europeCities)
    .enter()
    .append("circle")
    .attr("class", "city-point")
    .attr("transform", function(d) { return "translate(" + 
      projection([d['CapitalLongitude'], d['CapitalLatitude']])
      + ")"; })
    .attr("opacity", 0.3)
    .attr("fill", "#900C3F")
    .attr("r", 2);

  return svg.node()
}
);
  main.variable(observer()).define(["md","salary_cost_of_living"], function(md,salary_cost_of_living){return(
md`
We notice interesting data is coming to light, Balkan and [Levant](https://en.wikipedia.org/wiki/Levant) capitals have negative score even without rent.

Capitals with negative score:
${[...salary_cost_of_living].filter(d => { return d['average_monthly_net_salary_eur'] - d['single_person_monthly_costs_eur'] < 0 }).reduce(((acc, i) => { 
  acc += "\n- " + i.capital + ' (' + i.country + ') ' + Math.floor(i['average_monthly_net_salary_eur'] - i['single_person_monthly_costs_eur']) + '€'; return acc; 
} ), "")}

On the other hand Switzerland capital Bern keeps top score.

Let's look at the same data, now with number showing what percentage of income you have to pay to cover averge cost of living in Europe city capitals (**without rent**).
`
)});
  main.variable(observer("amiColPctMap")).define("amiColPctMap", ["d3","DOM","width","height","topojson","europe","path","salary_cost_of_living","colorScalePercent","europeCities","projection"], function(d3,DOM,width,height,topojson,europe,path,salary_cost_of_living,colorScalePercent,europeCities,projection)
{
  const svg = d3.select(DOM.svg(width, height))
    .style("max-width", "100%")
    .style("height", "auto")
  
  const g = svg.append("g");
  
  g
    .selectAll("path")
    .data(topojson.feature(europe, europe.objects.europe).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", function(d) {
       var prop = salary_cost_of_living.find(s => { return d.id === s['ISO-3166-2']; });
       if(prop && prop['average_monthly_net_salary_eur'] && prop['single_person_monthly_costs_eur']) {
         var color = colorScalePercent(Math.floor(prop['single_person_monthly_costs_eur'] / prop['average_monthly_net_salary_eur'] * 100.0));
        return color ? color : '#fff';
       } else {
        return '#efefef'; 
       }
    })
    .attr("stroke", "#E8D7CE")
    .attr("stroke-opacity", 0.7)
    .attr("opacity", 0.5);
  
    // values
    g.selectAll(".city-label")
    .data(europeCities)
    .enter()
    .append("text")
    .attr("class", "city-label")
    .attr("transform", function(d) { return "translate(" + 
      projection([d['CapitalLongitude'], d['CapitalLatitude']])
      + ")"; })
      .attr("dy", "-.4em")
    .attr("dx", function(d) {
      if(d['CountryCode'] === 'AT') { return '-2em'; }
    })
    .text(function(d) { 
      var prop = salary_cost_of_living.find(s => { return d['CountryCode'] === s['ISO-3166-2']; });
      
      return prop && Math.ceil(prop['average_monthly_net_salary_eur']) ? Math.floor(prop['single_person_monthly_costs_eur'] / prop['average_monthly_net_salary_eur'] * 100.0) + '%': '';
    })
    .attr("fill", "#900C3F")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12);
  
  // city points
      g.selectAll(".city-point")
    .data(europeCities)
    .enter()
    .append("circle")
    .attr("class", "city-point")
    .attr("transform", function(d) { return "translate(" + 
      projection([d['CapitalLongitude'], d['CapitalLatitude']])
      + ")"; })
    .attr("opacity", 0.3)
    .attr("fill", "#900C3F")
    .attr("r", 4);

  return svg.node()
}
);
  main.variable(observer()).define(["md","capitals_cost"], function(md,capitals_cost){return(
md`**Least** 5 expensive cities compared to average income:
${[...capitals_cost].slice(0, 5).reduce(((acc, i) => { acc += "\n- " + i.capital + ' (' + i.country + ') ' + Math.floor(i['single_person_monthly_costs_eur'] / i['average_monthly_net_salary_eur'] * 100) + '% of income'; return acc; } ), "")}
`
)});
  main.variable(observer()).define(["md","capitals_cost"], function(md,capitals_cost){return(
md`**Most** 5 expensive cities compared to average income:
${[...capitals_cost].reverse().slice(0, 5).reduce(((acc, i) => { acc += "\n- " + i.capital + ' (' + i.country + ') ' + Math.floor(i['single_person_monthly_costs_eur'] / i['average_monthly_net_salary_eur'] * 100)+ '% of income'; return acc; } ), "")}
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
Can we provide some explanation for this negative score, how people live seeing single person needs more then average salary to live?

Some ideas for exploration may include:
- Is there positive coorelation between negative score (ami - col) and young adults aged 24-35 working full time and living with parents?
- How migration within EU affect share of young adults living with parents?
- Social unions?
- Roomates?
- Other modern fenomena?

It turns out this is not easy to coorelate, so we leave this topic for one of our next researches.

For now we continue.
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`So far we've shown maps without housing element which we suspect is really havy on budget.
Without rent, it turns out that average income is still main determinant of life standard (event after substracting cost of living per month), 
but we want to investigate rent cost to see if things change.

First we investigate how things change when we include renting single room apartment in **city center**. 

- ami - average monthly income after tax
- col - cost of living per person in europe city capital without rent
- rent - apartment rent per month (on this occasion single room apartment in city center)

Note: Later we'll show outside of city center as well.

Our formula: ami - col - rent
`
)});
  main.variable(observer("amiColRentMap")).define("amiColRentMap", ["d3","DOM","width","height","topojson","europe","path","salary_cost_of_living","colorScaleWithRent","europeCities","projection"], function(d3,DOM,width,height,topojson,europe,path,salary_cost_of_living,colorScaleWithRent,europeCities,projection)
{
  const svg = d3.select(DOM.svg(width, height))
    .style("max-width", "100%")
    .style("height", "auto")
  
  const g = svg.append("g");
  
  g
    .selectAll("path")
    .data(topojson.feature(europe, europe.objects.europe).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", function(d) {
       var prop = salary_cost_of_living.find(s => { return d.id === s['ISO-3166-2']; });
       if(prop && prop['average_monthly_net_salary_eur']) {
         var color = colorScaleWithRent(prop['average_monthly_net_salary_eur'] - prop['single_person_monthly_costs_eur'] - parseFloat(prop['single_room_apartment_center']));
        return color ? color : '#fff';
       } else {
        return '#efefef'; 
       }
    })
    .attr("stroke", "#E8D7CE")
    .attr("stroke-opacity", 0.7)
    .attr("opacity", 0.5);
  
    // values
    g.selectAll(".city-label")
    .data(europeCities)
    .enter()
    .append("text")
    .attr("class", "city-label")
    .attr("transform", function(d) { return "translate(" + 
      projection([d['CapitalLongitude'], d['CapitalLatitude']])
      + ")"; })
      .attr("dy", "-.2em")
    .attr("dx", function(d) {
      if(d['CountryCode'] === 'AT') { return '-2em'; }
    })
    .text(function(d) { 
      var prop = salary_cost_of_living.find(s => { return d['CountryCode'] === s['ISO-3166-2']; });
      
      return prop && Math.ceil(prop['average_monthly_net_salary_eur']) ? Math.ceil(prop['average_monthly_net_salary_eur'] - prop['single_person_monthly_costs_eur'] - parseFloat(prop['single_room_apartment_center'])) : '';
    })
    .attr("fill", "#900C3F")
    .attr("font-family", "sans-serif")
    .attr("font-size", 14);
  
  // city points
      g.selectAll(".city-point")
    .data(europeCities)
    .enter()
    .append("circle")
    .attr("class", "city-point")
    .attr("transform", function(d) { return "translate(" + 
      projection([d['CapitalLongitude'], d['CapitalLatitude']])
      + ")"; })
    .attr("opacity", 0.3)
    .attr("fill", "#900C3F")
    .attr("r", 2);

  return svg.node()
}
);
  main.variable(observer()).define(["md","capitals_cost_with_rent"], function(md,capitals_cost_with_rent){return(
md`
Let's list cities with positive value after paying rent in city center.

${[...capitals_cost_with_rent].filter(c => { return c['income_after_rent'] > 0 ? true: false }).sort((a, b) => { return b['income_after_rent'] - a['income_after_rent']}).reduce(((acc, i) => { acc += "\n- " + i.capital + ' (' + i.country + ') ' + i['income_after_rent'] + '€'; return acc; } ), "")}

`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
Only **14** cities where after paying rent in city center, on average you can have positive income.

This of course begs the question, what about renting outside of city center?

Would we have more cities with positive outcome?

Let's see!
`
)});
  main.variable(observer("amiColRentOutsideMap")).define("amiColRentOutsideMap", ["d3","DOM","width","height","topojson","europe","path","salary_cost_of_living","colorScaleWithRentOutside","europeCities","projection"], function(d3,DOM,width,height,topojson,europe,path,salary_cost_of_living,colorScaleWithRentOutside,europeCities,projection)
{
  const svg = d3.select(DOM.svg(width, height))
    .style("max-width", "100%")
    .style("height", "auto")
  
  const g = svg.append("g");
  
  g
    .selectAll("path")
    .data(topojson.feature(europe, europe.objects.europe).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", function(d) {
       var prop = salary_cost_of_living.find(s => { return d.id === s['ISO-3166-2']; });
       if(prop && prop['average_monthly_net_salary_eur']) {
         var color = colorScaleWithRentOutside(prop['average_monthly_net_salary_eur'] - prop['single_person_monthly_costs_eur'] - parseFloat(prop['single_room_apartment_outside_center']));
        return color ? color : '#fff';
       } else {
        return '#efefef'; 
       }
    })
    .attr("stroke", "#E8D7CE")
    .attr("stroke-opacity", 0.7)
    .attr("opacity", 0.5);
  
    // values
    g.selectAll(".city-label")
    .data(europeCities)
    .enter()
    .append("text")
    .attr("class", "city-label")
    .attr("transform", function(d) { return "translate(" + 
      projection([d['CapitalLongitude'], d['CapitalLatitude']])
      + ")"; })
      .attr("dy", "-.2em")
    .attr("dx", function(d) {
      if(d['CountryCode'] === 'AT') { return '-2em'; }
    })
    .text(function(d) { 
      var prop = salary_cost_of_living.find(s => { return d['CountryCode'] === s['ISO-3166-2']; });
      
      return prop && Math.ceil(prop['average_monthly_net_salary_eur']) ? Math.ceil(prop['average_monthly_net_salary_eur'] - prop['single_person_monthly_costs_eur'] - parseFloat(prop['single_room_apartment_outside_center'])) : '';
    })
    .attr("fill", "#900C3F")
    .attr("font-family", "sans-serif")
    .attr("font-size", 14);
  
  // city points
      g.selectAll(".city-point")
    .data(europeCities)
    .enter()
    .append("circle")
    .attr("class", "city-point")
    .attr("transform", function(d) { return "translate(" + 
      projection([d['CapitalLongitude'], d['CapitalLatitude']])
      + ")"; })
    .attr("opacity", 0.3)
    .attr("fill", "#900C3F")
    .attr("r", 2);

  return svg.node()
}
);
  main.variable(observer()).define(["md","capitals_cost_with_rent_outside_center"], function(md,capitals_cost_with_rent_outside_center){return(
md`
Let's list cities with positive value after paying rent **outside** city center.

${[...capitals_cost_with_rent_outside_center].filter(c => { return c['income_after_rent'] > 0 ? true: false }).reduce(((acc, i) => { acc += "\n- " + i.capital + ' (' + i.country + ') ' + i['income_after_rent'] + '€'; return acc; } ), "")}

`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
Now we have some more cities with positive score (after paying rent outside of city center).

In total **21** cities.

What new cities made the cut now? (after paying rent outside of city center)
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
- Paris (France) 147€
- Tallinn (Estonia) 143€
- Ljubljana (Slovenia) 74€
- Dublin (Ireland) 48€
- Warsaw (Poland) 41€
- Madrid (Spain) 41€
- Bratislava (Slovakia) 3€
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
This concludes our research on Europe city capitas.
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Conclusion


`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Authors:

- Djordje - https://rs.linkedin.com/in/djordje-rakonjac-50b8b979

Works as CTO at Datamap AG (https://datamap.io) with focus on mobility.
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Data sources:
- https://numbeo.com
`
)});
  main.variable(observer("capitals_cost")).define("capitals_cost", ["salary_cost_of_living"], function(salary_cost_of_living){return(
salary_cost_of_living.map(c => { return {...c, pct:  Math.floor(c['single_person_monthly_costs_eur'] / c['average_monthly_net_salary_eur'] * 100.0) } }).filter(c => c.pct).sort((a,b) => { return a.pct - b.pct; })
)});
  main.variable(observer("capitals_cost_with_rent")).define("capitals_cost_with_rent", ["salary_cost_of_living"], function(salary_cost_of_living){return(
salary_cost_of_living.map(c => { return {...c, income_after_rent: Math.ceil(c['average_monthly_net_salary_eur'] - c['single_person_monthly_costs_eur'] - c['single_room_apartment_center'])  } }).filter(c => c.income_after_rent).sort((a,b) => { return b.income_after_rent - a.income_after_rent; })
)});
  main.variable(observer("capitals_cost_with_rent_outside_center")).define("capitals_cost_with_rent_outside_center", ["salary_cost_of_living"], function(salary_cost_of_living){return(
salary_cost_of_living.map(c => { return {...c, income_after_rent: Math.ceil(c['average_monthly_net_salary_eur'] - c['single_person_monthly_costs_eur'] - c['single_room_apartment_outside_center'])  } }).filter(c => c.income_after_rent).sort((a,b) => { return b.income_after_rent - a.income_after_rent; })
)});
  main.variable(observer("domain")).define("domain", ["d3","salary_cost_of_living"], function(d3,salary_cost_of_living){return(
d3.extent(salary_cost_of_living, function(d) { return +d['average_monthly_net_salary_eur']-(+d['single_person_monthly_costs_eur']) })
)});
  main.variable(observer("domainWithRent")).define("domainWithRent", ["d3","salary_cost_of_living"], function(d3,salary_cost_of_living){return(
d3.extent(salary_cost_of_living, function(d) { return +d['average_monthly_net_salary_eur']-+d['single_person_monthly_costs_eur'] - parseFloat(d['single_room_apartment_center']) })
)});
  main.variable(observer("domainWithRentOutside")).define("domainWithRentOutside", ["d3","salary_cost_of_living"], function(d3,salary_cost_of_living){return(
d3.extent(salary_cost_of_living, function(d) { return +d['average_monthly_net_salary_eur']-+d['single_person_monthly_costs_eur'] - parseFloat(d['single_room_apartment_outside_center']) })
)});
  main.variable(observer("domainCostOfLiving")).define("domainCostOfLiving", ["d3","salary_cost_of_living"], function(d3,salary_cost_of_living){return(
d3.extent(salary_cost_of_living, function(d) { return +d['single_person_monthly_costs_eur'] })
)});
  main.variable(observer("domainAvgSalary")).define("domainAvgSalary", ["d3","salary_cost_of_living"], function(d3,salary_cost_of_living){return(
d3.extent(salary_cost_of_living, function(d) { return d['average_monthly_net_salary_eur'] - d['single_person_monthly_costs_eur'] })
)});
  main.variable(observer("rangeColors")).define("rangeColors", ["d3"], function(d3){return(
d3.schemeOrRd[5]
)});
  main.variable(observer("colorScale")).define("colorScale", ["d3","domain"], function(d3,domain){return(
d3.scaleQuantize()
    .domain(domain)
    .range(d3.schemeOrRd[5])
)});
  main.variable(observer("colorScaleWithRent")).define("colorScaleWithRent", ["d3","domainWithRent"], function(d3,domainWithRent){return(
d3.scaleQuantize()
    .domain(domainWithRent)
    .range(d3.schemeOrRd[5])
)});
  main.variable(observer("colorScaleWithRentOutside")).define("colorScaleWithRentOutside", ["d3","domainWithRent"], function(d3,domainWithRent){return(
d3.scaleQuantize()
    .domain(domainWithRent)
    .range(d3.schemeOrRd[5])
)});
  main.variable(observer("colorScaleCostOfLiving")).define("colorScaleCostOfLiving", ["d3","domainCostOfLiving"], function(d3,domainCostOfLiving){return(
d3.scaleQuantize()
    .domain(domainCostOfLiving)
    .range(d3.schemeOrRd[5])
)});
  main.variable(observer("colorScaleAvgSalary")).define("colorScaleAvgSalary", ["d3","domainAvgSalary"], function(d3,domainAvgSalary){return(
d3.scaleQuantize()
    .domain(domainAvgSalary)
    .range(d3.schemeOrRd[5])
)});
  main.variable(observer("colorScalePercent")).define("colorScalePercent", ["d3","capitals_cost"], function(d3,capitals_cost){return(
d3.scaleQuantize()
    .domain(d3.extent(capitals_cost, function(d) { return d.pct; }))
    .range(d3.schemeOrRd[5])
)});
  main.variable(observer("projection")).define("projection", ["d3","width","height"], function(d3,width,height){return(
d3.geoMercator()
  .center([13, 52]) 					
	.translate([width/2, height/1.6]) 		
	.scale([width/1.5])
)});
  main.variable(observer("path")).define("path", ["d3","projection"], function(d3,projection){return(
d3.geoPath(projection)
)});
  main.variable(observer("width")).define("width", function(){return(
960
)});
  main.variable(observer("height")).define("height", function(){return(
800
)});
  main.variable(observer("salary_cost_of_living")).define("salary_cost_of_living", ["d3"], function(d3){return(
d3.csv('https://gist.githubusercontent.com/djr4/2b7478e1e485dfa623671d262e39f781/raw/55f4994be84bade26df2e0203a7b5befb1dad204/salary_cost_of_living_europe.csv')
)});
  main.variable(observer("cities")).define("cities", ["d3"], function(d3){return(
d3.csv('https://gist.githubusercontent.com/djr4/bc23371c77420d22f2144c5f910e16a0/raw/b44baa5fcb3cc48d4c9b710f5c13e0d907a05b1c/country_captial_coordiantes.csv')
)});
  main.variable(observer("europeCities")).define("europeCities", ["cities"], function(cities){return(
cities.filter(d => { return d['ContinentName'] === 'Europe'; })
)});
  main.variable(observer("europe")).define("europe", function(){return(
fetch('https://gist.githubusercontent.com/djr4/6a8e88d0efdf52d4e75edd9a133917f3/raw/821143de54ba6bf406d1a1588428b076feb33383/europe.topojson').then(res => res.json())
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require("topojson-client@3")
)});
  return main;
}
