// Path to the generated JSON data
const dataUrl = './data/nutrition_data.json';

// Load the data
d3.json(dataUrl).then(function(data) {
  // Set the dimensions of the canvas/graph
  const margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

  // Set the ranges with scaling
  const x = d3.scaleLinear().range([0, width]);
  const y = d3.scaleOrdinal().range([height, 0]);

  // Define the SVG element
  const svg = d3.select("#plot")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Set domains for the scales
  x.domain([0, d3.max(data, d => d.underweight_percentage)]);
  y.domain(data.map(d => d.country));

  // Create a tooltip
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Draw the bubble plot with smaller points and a different color
  svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
      .attr("cx", d => x(d.underweight_percentage))
      .attr("cy", (d, i) => y(d.country))
      .attr("r", 3)  // Smaller radius for points
      .style("fill", "steelblue")  // Use a different color
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(`${d.country}: ${d.underweight_percentage}%`)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => tooltip.transition().duration(500).style("opacity", 0));

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
});
