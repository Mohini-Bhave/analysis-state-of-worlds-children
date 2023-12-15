// Path to the GitHub raw JSON data
// const dataUrl = 'https://raw.githubusercontent.com/Mohini-Bhave/analysis-state-of-worlds-children/main/data/nutrition_data.json';

// Path to the JSON data
const dataUrl = "./data/nutrition_data_updated.json";

// Column names for the dropdown
const columns = [
  "Weight at birth - Low Birthweight (2015)",
  "Weight at birth -  Unweighed at birth  (2015–2021)",
  "Malnutrition among preschool-aged children (0–4 years of age)   Stunted (2020)",
  "Malnutrition among preschool-aged children (0–4 years of age)   Wasted (2015-2022) Severe",
  "Malnutrition among preschool-aged children (0–4 years of age)   Wasted (2015-2022) Moderate and Severe",
  "Malnutrition among preschool-aged children (0–4 years of age)   Overweight (2020)",
  "Vitamin A supplementation, (%) 2021",
  "Malnutrition among school-aged children (5–19 years of age) 2016 Thinness",
  "Malnutrition among school-aged children (5–19 years of age) 2016 Overweight",
  "Malnutrition among women Underweight 18+ years (%) (2016)",
  "Malnutrition among women Anaemia 15–49 years (%) (2019)",
  "Percentage of households consuming iodized salt (2015–2021)"
];

// Function to create and update the bubble chart
function createBubbleChart(dataUrl, selectedColumn) {
  // Load the data
  d3.json(dataUrl).then(function(data) {
    console.log("Loaded data:", data); // Debug: Log the loaded data

  if (data.length > 0) {
      console.log("Columns in the data:", Object.keys(data[0]));
  }
    // Create the SVG container if it doesn't exist
    let svg = d3.select("#plot-container").select("svg");
    if (svg.empty()) {
      svg = d3.select("#plot-container")
        .append("svg")
        .attr("style", "max-width: 100%; height: auto; font: 16px sans-serif;")
        .attr("text-anchor", "middle");
    }

    // Specify the dimensions of the chart.
    const width = 1600; // Adjust as needed
    const height = 1200; // Adjust as needed
    const margin = 1; // Margin to avoid clipping

    // Set the size of the SVG
    svg.attr("width", width)
       .attr("height", height)
       .attr("viewBox", [-margin, -margin, width, height]);

    // Create a categorical color scale.
    const color = d3.scaleOrdinal(d3.schemeSet3);

    // Create the pack layout.
    const pack = d3.pack()
        .size([width - margin * 2, height - margin * 2])
        .padding(3);

    function parseColumnValue(value) {
      if (value === "–" || value === undefined || value === null) {
        return 0; // Return 0 for missing or non-numeric data
      }
      return parseFloat(value); // Parse the string as a floating-point number
    }

    // Function to render/update the chart
    function renderChart(selectedColumn) {
      // Compute the hierarchy and apply the pack layout.
      const root = pack(d3.hierarchy({ children: data })
        .sum(d => parseColumnValue(d[selectedColumn]))
        .sort((a, b) => b.value - a.value)); // Sort the nodes by value

      console.log("Rendering column:", selectedColumn);

      // Select all the node groups and bind the data
      const node = svg.selectAll("g.node")
                      .data(root.leaves(), d => d.data.Countries);

      // Enter selection for the nodes
      const nodeEnter = node.enter()
                           .append("g")
                           .attr("class", "node")
                           .attr("transform", d => `translate(${d.x},${d.y})`);

      // Append title tooltip to each node
      nodeEnter.append("title")
               .text(d => `${d.data.Countries}: ${parseColumnValue(d[selectedColumn])}%`);

      // Append circles to each node
      nodeEnter.append("circle")
               .attr("r", d => d.r)
               .attr("fill", d => color(d.data.Countries))
               .attr("fill-opacity", 0.7);

      // Append text labels to each node
      nodeEnter.append("text")
               .attr("text-anchor", "middle")
               .selectAll("tspan")
               .data(d => [d.data.Countries, `${parseColumnValue(d[selectedColumn])}%`])
               .enter()
               .append("tspan")
               .attr("x", 0)
               .attr("y", (d, i, nodes) => `${(i - nodes.length / 2 + 0.8) * 1.2}em`)
               .text(d => d);

      // Update and exit selections...
    }

    // Initial rendering of the chart
    renderChart(selectedColumn);
  });
}

// Create the dropdown element
const dropdown = d3.select("#dropdown-container")
  .append("select")
  .on("change", function() {
    createBubbleChart(dataUrl, this.value);
  });

// Add options to the dropdown
dropdown.selectAll("option")
  .data(columns)
  .enter()
  .append("option")
  .text(d => d)
  .attr("value", d => d);

// Initial call to create the chart with the first column
createBubbleChart(dataUrl, columns[0]);
