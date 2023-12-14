// Path to the generated JSON data
const dataUrl = './data/nutrition_data.json';

// Load the data
d3.json(dataUrl).then(function(data) {
  // Filter the data to remove entries with values less than 4%
  data = data.filter(d => d.underweight_percentage >= 4);

  // Specify the dimensions of the chart.
  const width = 1600; /* 4 times larger */
  const height = 1200; /* 4 times larger */
  const margin = 1; // to avoid clipping the root circle stroke
  const names = d => d.country.split(" "); // Modify data accessors as needed

  // Number format for values
  const format = d3.format(",d");

  // Create a categorical color scale.
  const color = d3.scaleOrdinal(d3.schemeSet3);

  // Create the pack layout.
  const pack = d3.pack()
      .size([width - margin * 2, height - margin * 2])
      .padding(3);

  // Compute the hierarchy from the (flat) data; expose the values
  // for each node; lastly apply the pack layout.
  const root = pack(d3.hierarchy({children: data})
      .sum(d => d.underweight_percentage));

  // Create the SVG container.
  const svg = d3.select("#plot")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-margin, -margin, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 16px sans-serif;") /* Adjust the font size */
      .attr("text-anchor", "middle");

  // Place each (leaf) node according to the layout’s x and y values.
  const node = svg.append("g")
    .selectAll()
    .data(root.leaves())
    .join("g")
      .attr("transform", d => `translate(${d.x},${d.y})`);

  // Add a title.
  node.append("title")
      .text(d => `${d.data.country}\n${format(d.data.underweight_percentage)}%`);

  // Add a filled circle.
  node.append("circle")
      .attr("fill-opacity", 0.7)
      .attr("fill", d => color(d.data.country))
      .attr("r", d => d.r);

  // Add a label.
  const text = node.append("text")
      .attr("clip-path", d => `circle(${d.r})`);

  // Add a tspan for each word in the country name.
  text.selectAll()
    .data(d => names(d.data))
    .join("tspan")
      .attr("x", 0)
      .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.35}em`)
      .text(d => d);

  // Add a tspan for the node’s value.
  text.append("tspan")
      .attr("x", 0)
      .attr("y", d => `${names(d.data).length / 2 + 0.35}em`)
      .attr("fill-opacity", 0.7)
      .text(d => `${format(d.data.underweight_percentage)}%`);
});
