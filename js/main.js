let currentScene = 0;
let explorationUnlocked = false;
let selectedFuel = "All";
let globalData = null;

const width = 1000, height = 700;
const svg = d3.select("#vis").append("svg")
  .attr("width", width)
  .attr("height", height);

const tooltip = d3.select("#tooltip");
const fuelFilter = d3.select("#fuelFilter");
const description = d3.select("#description");

// Scene descriptions
const sceneDescriptions = [
  "Welcome to our exploration of 2017 car fuel efficiency! This scatter plot shows the relationship between city and highway miles per gallon (MPG). Each point represents a car, with the size indicating the number of engine cylinders. Notice how most cars cluster in the middle range, showing typical fuel efficiency patterns.",
  
  "Now let's examine fuel types more closely. The colors represent different fuel types: orange for gasoline, green for diesel, and purple for electric vehicles. This reveals how fuel choice affects efficiency across the automotive landscape.",
  
  "Electric vehicles stand out as clear outliers! They achieve much higher efficiency ratings, particularly in city driving. This demonstrates the significant advantage of electric powertrains in urban environments where regenerative braking can be maximized.",
  
  "Time to explore! You can now interact with the data. Hover over any point to see detailed information about that specific car, including its make, fuel type, engine cylinders, and MPG ratings. Use the dropdown menu to filter by fuel type and discover patterns within specific categories."
];

// Scene configuration parameters
const sceneConfig = {
  0: {
    colorScheme: "uniform",
    pointOpacity: 0.6,
    showGrid: true,
    annotations: [
      { title: "Overview", label: "Most cars cluster between 20–40 MPG.", x: 200, y: 200, dy: -50, dx: 50 },
      { title: "Pattern", label: "Notice the general upward trend - better city MPG often means better highway MPG.", x: 400, y: 300, dy: 30, dx: -50 }
    ]
  },
  1: {
    colorScheme: "fuel",
    pointOpacity: 0.8,
    showGrid: true,
    annotations: [
      { title: "Fuel Types", label: "Different colors represent fuel types.", x: 400, y: 150, dy: -50, dx: 50 },
      { title: "Gasoline Dominance", label: "Orange points show gasoline cars dominate the market.", x: 250, y: 250, dy: -30, dx: -50 },
      { title: "Diesel Efficiency", label: "Green diesel vehicles show good highway efficiency.", x: 350, y: 180, dy: -40, dx: 60 }
    ]
  },
  2: {
    colorScheme: "fuel",
    pointOpacity: 0.9,
    showGrid: false,
    annotations: [
      { title: "Electric Revolution", label: "Purple electric vehicles achieve exceptional efficiency!", x: 500, y: 120, dy: -60, dx: 60 },
      { title: "Outlier Analysis", label: "Electric cars are clear outliers with 2-3x better efficiency than traditional vehicles.", x: 450, y: 100, dy: -80, dx: -40 },
      { title: "Future Trend", label: "This pattern suggests the potential for widespread adoption of electric vehicles.", x: 300, y: 150, dy: 40, dx: -60 }
    ]
  },
  3: {
    colorScheme: "fuel",
    pointOpacity: 1.0,
    showGrid: false,
    annotations: [
      { title: "Interactive Exploration", label: "Hover for details or filter by fuel type.", x: 250, y: 200, dy: -50, dx: 50 },
      { title: "Data Discovery", label: "Use the dropdown to explore patterns within specific fuel categories.", x: 400, y: 300, dy: 30, dx: -50 }
    ]
  }
};

d3.csv("data/cars2017.csv").then(data => {
  globalData = data;
  data.forEach(d => {
    d.AverageCityMPG = +d.AverageCityMPG;
    d.AverageHighwayMPG = +d.AverageHighwayMPG;
    d.EngineCylinders = +d.EngineCylinders;
  });

  const fuels = Array.from(new Set(data.map(d => d.Fuel)));
  fuelFilter.selectAll("option")
    .data(["All"].concat(fuels))
    .enter().append("option")
    .attr("value", d => d)
    .text(d => d);

  const xScale = d3.scaleLog().domain([10, 150]).range([60, width - 40]);
  const yScale = d3.scaleLog().domain([10, 150]).range([height - 60, 40]);

  const xAxis = d3.axisBottom(xScale)
    .tickValues([10, 20, 50, 100])
    .tickFormat(d3.format("~s"));
  const yAxis = d3.axisLeft(yScale)
    .tickValues([10, 20, 50, 100])
    .tickFormat(d3.format("~s"));

  // Create base SVG elements
  svg.append("g").attr("class", "x-axis")
    .attr("transform", `translate(0, ${height - 60})`);
  svg.append("g").attr("class", "y-axis")
    .attr("transform", `translate(60, 0)`);

  // Add axis labels
  svg.append("text")
    .attr("class", "x-label")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .text("City MPG (Miles Per Gallon)");

  svg.append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 15)
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .text("Highway MPG (Miles Per Gallon)");

  function drawAnnotations(annotations) {
    const annotationElements = annotations.map(ann => ({
      note: { title: ann.title, label: ann.label },
      x: ann.x,
      y: ann.y,
      dy: ann.dy,
      dx: ann.dx
    }));
    
    const makeAnnotations = d3.annotation().annotations(annotationElements);
    svg.append("g").attr("class", "annotation-layer").call(makeAnnotations);
  }

  function getColor(d) {
    const config = sceneConfig[currentScene];
    if (config.colorScheme === "uniform") return "steelblue";
    if (config.colorScheme === "fuel") {
      if (d.Fuel === "Electricity") return "purple";
      if (d.Fuel === "Diesel") return "green";
      return "orange";
    }
    return "steelblue";
  }

  function filterData() {
    if (!explorationUnlocked || selectedFuel === "All") return globalData;
    return globalData.filter(d => d.Fuel === selectedFuel);
  }

  function drawPoints() {
    const config = sceneConfig[currentScene];
    const filtered = filterData();
    
    // Clear existing points
    svg.selectAll(".point").remove();
    
    const points = svg.selectAll(".point")
      .data(filtered, d => d.Make + d.AverageCityMPG);

    points.join("circle")
      .attr("class", "point")
      .attr("cx", d => xScale(d.AverageCityMPG))
      .attr("cy", d => yScale(d.AverageHighwayMPG))
      .attr("r", d => 2 + d.EngineCylinders)
      .attr("fill", getColor)
      .style("opacity", config.pointOpacity)
      .on("mouseover", (event, d) => {
        if (explorationUnlocked) {
          tooltip.transition().style("opacity", 1);
          tooltip.html(`<strong>${d.Make}</strong><br/>
            Fuel: ${d.Fuel}<br/>
            Cylinders: ${d.EngineCylinders}<br/>
            City MPG: ${d.AverageCityMPG}<br/>
            Highway MPG: ${d.AverageHighwayMPG}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px");
        }
      })
      .on("mouseout", () => tooltip.transition().style("opacity", 0));
  }

  function updateScene() {
    // Clear previous scene elements
    svg.selectAll("g.annotation-layer").remove();
    svg.selectAll(".grid-line").remove();

    // Update parameters based on scene
    explorationUnlocked = (currentScene === 3);
    fuelFilter.style("display", explorationUnlocked ? "inline" : "none");

    // Update description
    description.html(sceneDescriptions[currentScene]);

    // Update button states
    d3.select("#prev").property("disabled", currentScene === 0);
    d3.select("#next").property("disabled", currentScene === 3);

    // Get current scene configuration
    const config = sceneConfig[currentScene];

    // Draw grid if needed
    if (config.showGrid) {
      const gridLines = svg.selectAll(".grid-line")
        .data([...Array(5).keys()].map(i => 20 + i * 20))
        .enter().append("line")
        .attr("class", "grid-line")
        .attr("x1", 60)
        .attr("x2", width - 40)
        .attr("y1", d => yScale(d))
        .attr("y2", d => yScale(d))
        .style("stroke", "#eee")
        .style("stroke-width", 1)
        .style("opacity", 0.5);
    }

    // Draw points with scene-specific styling
    drawPoints();

    // Update axes
    svg.select(".x-axis").call(xAxis);
    svg.select(".y-axis").call(yAxis);

    // Draw annotations
    drawAnnotations(config.annotations);
  }

  // Event listeners (triggers)
  d3.select("#next").on("click", () => {
    currentScene = Math.min(currentScene + 1, 3);
    updateScene();
  });

  d3.select("#prev").on("click", () => {
    currentScene = Math.max(currentScene - 1, 0);
    updateScene();
  });

  fuelFilter.on("change", event => {
    selectedFuel = event.target.value;
    updateScene();
  });

  // Initialize first scene
  updateScene();
});
