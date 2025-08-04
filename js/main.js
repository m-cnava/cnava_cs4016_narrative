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
const description = d3.select("#description .description-content");
const legend = d3.select("#legend .legend-content");

// Global variables for visibility state
let descriptionVisible = true;
let legendVisible = true;
let chartAnnotationsVisible = true;

// Toggle functions for description and legend
window.toggleDescription = function() {
  descriptionVisible = !descriptionVisible;
  const descriptionContainer = d3.select("#description");
  const closeBtn = descriptionContainer.select(".close-btn");
  
  if (descriptionVisible) {
    descriptionContainer.classed("hidden", false);
    closeBtn.text("×");
    // Restore the description content for the current scene
    description.html(sceneDescriptions[currentScene]);
  } else {
    descriptionContainer.classed("hidden", true);
    closeBtn.text("+");
  }
};

window.toggleLegend = function() {
  legendVisible = !legendVisible;
  const legendContainer = d3.select("#legend");
  if (legendVisible) {
    legendContainer.classed("hidden", false);
  } else {
    legendContainer.classed("hidden", true);
  }
};

window.toggleChartAnnotations = function() {
  chartAnnotationsVisible = !chartAnnotationsVisible;
  const toggleButton = d3.select(".annotation-toggle");
  
  if (chartAnnotationsVisible) {
    toggleButton.text("Hide Annotations").classed("hidden", false);
    svg.selectAll("g.annotation-group").style("display", "block");
  } else {
    toggleButton.text("Show Annotations").classed("hidden", true);
    svg.selectAll("g.annotation-group").style("display", "none");
  }
};

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
      { title: "Overview", label: "Most cars cluster between 20–40 MPG.", x: 300, y: 300, dy: -80, dx: 60 },
      { title: "Pattern", label: "Notice the general upward trend - better city MPG often means better highway MPG.", x: 500, y: 400, dy: 40, dx: -80 }
    ]
  },
  1: {
    colorScheme: "fuel",
    pointOpacity: 0.8,
    showGrid: true,
    annotations: [
      { title: "Fuel Types", label: "Different colors represent fuel types.", x: 400, y: 200, dy: -60, dx: 80 },
      { title: "Gasoline Dominance", label: "Orange points show gasoline cars dominate the market.", x: 250, y: 350, dy: -40, dx: -60 },
      { title: "Diesel Efficiency", label: "Green diesel vehicles show good highway efficiency.", x: 350, y: 250, dy: -50, dx: 70 }
    ]
  },
  2: {
    colorScheme: "fuel",
    pointOpacity: 0.9,
    showGrid: false,
    annotations: [
      { title: "Electric Revolution", label: "Purple electric vehicles achieve exceptional efficiency!", x: 600, y: 150, dy: -70, dx: 90 },
      { title: "Outlier Analysis", label: "Electric cars are clear outliers with 2-3x better efficiency than traditional vehicles.", x: 550, y: 120, dy: -90, dx: -50 },
      { title: "Future Trend", label: "This pattern suggests the potential for widespread adoption of electric vehicles.", x: 400, y: 200, dy: 50, dx: -80 }
    ]
  },
  3: {
    colorScheme: "fuel",
    pointOpacity: 1.0,
    showGrid: false,
    annotations: [
      { title: "Interactive Exploration", label: "Hover for details or filter by fuel type.", x: 300, y: 300, dy: -60, dx: 70 },
      { title: "Data Discovery", label: "Use the dropdown to explore patterns within specific fuel categories.", x: 500, y: 400, dy: 40, dx: -90 }
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
    annotations.forEach(ann => {
      // Create annotation group
      const annotationGroup = svg.append("g").attr("class", "annotation-group");
      
      // Calculate better positioning
      const boxWidth = Math.max(ann.title.length * 7, ann.label.length * 5.5);
      const boxHeight = 50;
      const padding = 10;
      
      // Position the box to avoid overlapping with data points
      let boxX = ann.x + (ann.dx || 0);
      let boxY = ann.y + (ann.dy || 0);
      
      // Adjust position if box would go off-screen
      if (boxX + boxWidth > width - 20) {
        boxX = ann.x - boxWidth - 20;
      }
      if (boxY + boxHeight > height - 20) {
        boxY = ann.y - boxHeight - 20;
      }
      
      // Create annotation box with better styling
      const box = annotationGroup.append("g")
        .attr("transform", `translate(${boxX}, ${boxY})`);
      
      // Create background with shadow effect
      box.append("rect")
        .attr("width", boxWidth + padding * 2)
        .attr("height", boxHeight + padding * 2)
        .attr("rx", 8)
        .style("fill", "rgba(255, 255, 255, 0.95)")
        .style("stroke", "#ddd")
        .style("stroke-width", 1)
        .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");
      
      // Add title with better typography
      box.append("text")
        .attr("x", padding)
        .attr("y", padding + 15)
        .style("font-weight", "600")
        .style("font-size", "13px")
        .style("fill", "#333")
        .text(ann.title);
      
      // Add label with better typography
      box.append("text")
        .attr("x", padding)
        .attr("y", padding + 32)
        .style("font-size", "11px")
        .style("fill", "#666")
        .style("line-height", "1.3")
        .text(ann.label);
      
      // Create a subtle connecting line
      const lineStartX = ann.x;
      const lineStartY = ann.y;
      const lineEndX = boxX + (boxWidth + padding * 2) / 2;
      const lineEndY = boxY + (boxHeight + padding * 2) / 2;
      
      annotationGroup.append("line")
        .attr("x1", lineStartX)
        .attr("y1", lineStartY)
        .attr("x2", lineEndX)
        .attr("y2", lineEndY)
        .style("stroke", "#999")
        .style("stroke-width", 1.5)
        .style("opacity", 0.6)
        .style("stroke-dasharray", "3,3");
    });
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

  function createLegend() {
    // Clear existing legend
    legend.html("");
    
    // Check if data is loaded
    if (!globalData || globalData.length === 0) {
      legend.append("p").text("Loading legend...");
      return;
    }
    
    // Add title
    legend.append("h3").text("Circle Size Legend - Engine Cylinders");
    
    // Create table
    const table = legend.append("table").attr("class", "legend-table");
    
    // Add header
    const header = table.append("thead").append("tr");
    header.append("th").text("Circle Size");
    header.append("th").text("Engine Cylinders");
    header.append("th").text("Example");
    
    // Add body
    const tbody = table.append("tbody");
    
    // Get unique cylinder counts from data
    const cylinderCounts = Array.from(new Set(globalData.map(d => d.EngineCylinders))).sort((a, b) => a - b);
    
    cylinderCounts.forEach(cylinders => {
      const row = tbody.append("tr");
      const radius = 2 + cylinders;
      
      row.append("td").text(`${radius}px radius`);
      row.append("td").text(cylinders === 0 ? "Electric (0)" : `${cylinders} cylinders`);
      
      // Create visual example
      const exampleCell = row.append("td");
      exampleCell.append("div")
        .attr("class", "circle-example")
        .style("width", `${radius * 2}px`)
        .style("height", `${radius * 2}px`);
    });
  }

  function updateScene() {
    // Clear previous scene elements
    svg.selectAll("g.annotation-group").remove();
    svg.selectAll(".grid-line").remove();

    // Update parameters based on scene
    explorationUnlocked = (currentScene === 3);
    fuelFilter.style("display", explorationUnlocked ? "inline" : "none");

    // Update description - only if it's visible
    if (descriptionVisible) {
      description.html(sceneDescriptions[currentScene]);
    }

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
    
    // Update legend
    createLegend();
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
  
  // Create initial legend after data is loaded
  createLegend();
});
