const width = 900;
const height = 600;
const margin = { top: 40, right: 40, bottom: 50, left: 70 };
let currentScene = 1;
let svg, xScale, yScale, colorScale, radiusScale, data;

// Load data
d3.csv("data/cars2017.csv").then(raw => {
  data = raw.map(d => ({
    cylinders: +d.EngineCylinders,
    cityMPG: +d.AverageCityMPG,
    highwayMPG: +d.AverageHighwayMPG,
    fuel: d.Fuel,
    make: d.Make,
    model: d.Model
  }));
  initScales();
  drawScene1();
});

// Initialize scales
function initScales() {
  const cyl = data.map(d => d.cylinders || 0.5);
  xScale = d3.scaleLog().domain([0.5, d3.max(cyl)]).range([margin.left, width - margin.right]);
  yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.cityMPG)]).range([height - margin.bottom, margin.top]);
  colorScale = d3.scaleOrdinal()
    .domain(["Gasoline", "Diesel", "Hybrid", "Electricity"])
    .range(["gray", "brown", "green", "blue"]);
  radiusScale = d3.scaleSqrt().domain([0, d3.max(data, d => d.highwayMPG)]).range([2, 10]);
}

// Clear and setup SVG
function setupSVG(title) {
  d3.select("#vis").html("");
  svg = d3.select("#vis")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Axes
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).ticks(6, "~s"));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale));

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .text("Engine Cylinders (log scale)");

  svg.append("text")
    .attr("x", -height / 2)
    .attr("y", 20)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("Average City MPG");

  d3.select("#title").text(title);
}

// Draw points
function drawPoints(filteredData) {
  svg.selectAll("circle")
    .data(filteredData)
    .join("circle")
    .attr("cx", d => xScale(d.cylinders || 0.5))
    .attr("cy", d => yScale(d.cityMPG))
    .attr("r", d => radiusScale(d.highwayMPG))
    .attr("fill", d => colorScale(d.fuel))
    .attr("opacity", 0.7)
    .on("mouseover", (event, d) => {
      d3.select("#title").text(`${d.make} ${d.model}: ${d.fuel} (${d.cityMPG} MPG city)`);
    })
    .on("mouseout", () => {
      d3.select("#title").text("Cars 2017 Narrative Visualization");
    });
}

// Annotations
function addAnnotation(note, x, y) {
  const annotations = [
    {
      note: { title: note },
      x: xScale(x),
      y: yScale(y),
      dy: -40,
      dx: 40
    }
  ];
  const makeAnnotations = d3.annotation().annotations(annotations);
  svg.append("g").call(makeAnnotations);
}

// Scene 1
function drawScene1() {
  setupSVG("Scene 1: Overview of Cars");
  drawPoints(data);
  addAnnotation("Most cars cluster here", 4, 20);
}

// Scene 2
function drawScene2() {
  setupSVG("Scene 2: Gasoline/Diesel Focus");
  const filtered = data.filter(d => d.fuel === "Gasoline" || d.fuel === "Diesel");
  drawPoints(filtered);
  addAnnotation("Larger engines → lower MPG", 8, 15);
}

// Scene 3
function drawScene3() {
  setupSVG("Scene 3: Alternative Fuels");
  const filtered = data.filter(d => d.fuel !== "Gasoline" && d.fuel !== "Diesel");
  drawPoints(filtered);
  addAnnotation("Electric/Hybrid cars stand out", 0.5, 100);

  // Change button text for exploration
  d3.select("#next-button").text("Explore");
}

// Enable exploration
function enableExploration() {
  setupSVG("Explore Freely (Hover for details)");
  drawPoints(data);
  d3.select("#next-button").remove();
}

// Button trigger
d3.select("#next-button").on("click", () => {
  currentScene++;
  if (currentScene === 2) drawScene2();
  else if (currentScene === 3) drawScene3();
  else enableExploration();
});
