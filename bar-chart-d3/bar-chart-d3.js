function drawChart(data) {
    //console.log(data)

    data = data.sort((a, b) => d3.descending(a.value, b.value))

    let color = "steelblue"
    let height = 300
    let width = 500
    let margin = {top: 30, right: 0, bottom: 30, left: 40}

    let container = d3.select("#container")

    let svg = container
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        //.attr('width', width)
        //.attr('height', height)

    let x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1)

    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)]).nice()
        .range([height - margin.bottom, margin.top])

    svg.append("g")
        .attr("fill", color)
        .selectAll("rect")
        .data(data)
        .join("rect")
            .attr("x", (d, i) => x(i))
            .attr("y", d => y(d.value))
            .attr("height", d => y(0) - y(d.value))
            .attr("width", x.bandwidth());

    svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x)
    .tickFormat(i => data[i].name).tickSizeOuter(0))

    svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(null, "%"))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(data.y))


    return svg.node();

}



d3.csv("data.csv",
    function(d) { 
        return  {
        name: d.letter,
        value: +d.frequency
        }
    })
    .then(drawChart)
    .catch(e => console.log(e))



