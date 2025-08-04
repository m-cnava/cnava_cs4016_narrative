let currentScene = 0;
let explorationUnlocked = false;
let selectedFuel = "All";

const width = 800, height = 600;
const svg = d3.select("#vis").append("svg")
  .attr("width", width)
  .attr("height", height);

const tooltip = d3.select("#tooltip");
const fuelFilter = d3.select("#fuelFilter");

d3.csv("data/cars2017.csv").then(data => {
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

  svg.append("g").attr("class", "x-axis")
    .attr("transform", `translate(0, ${height - 60})`);
  svg.append("g").attr("class", "y-axis")
    .attr("transform", `translate(60, 0)`);

  function drawAnnotations(title, label, x, y) {
    const annotations = [
      { note: { title, label }, x, y, dy: -50, dx: 50 }
    ];
    const makeAnnotations = d3.annotation().annotations(annotations);
    svg.append("g").call(makeAnnotations);
  }

  function getColor(d) {
    if (currentScene === 1 || currentScene === 2 || explorationUnlocked) {
      if (d.Fuel === "Electricity") return "purple";
      if (d.Fuel === "Diesel") return "green";
      return "orange";
    }
    return "steelblue";
  }

  function filterData() {
    if (!explorationUnlocked || selectedFuel === "All") return data;
    return data.filter(d => d.Fuel === selectedFuel);
  }

  function drawPoints() {
    const filtered = filterData();
    const points = svg.selectAll(".point")
      .data(filtered, d => d.Make + d.AverageCityMPG);

    points.join("circle")
      .attr("class", "point")
      .attr("cx", d => xScale(d.AverageCityMPG))
      .attr("cy", d => yScale(d.AverageHighwayMPG))
      .attr("r", d => 2 + d.EngineCylinders)
      .attr("fill", getColor)
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
    svg.selectAll("g.annotation-group").remove();

    // Lock interactions until final scene
    explorationUnlocked = (currentScene === 3);
    fuelFilter.style("display", explorationUnlocked ? "inline" : "none");

    drawPoints();

    svg.select(".x-axis").call(xAxis);
    svg.select(".y-axis").call(yAxis);

    if (currentScene === 0) {
      drawAnnotations("Overview", "Most cars cluster between 20–40 MPG.", 200, 200);
    } else if (currentScene === 1) {
      drawAnnotations("Fuel Types", "Different colors represent fuel types.", 400, 150);
    } else if (currentScene === 2) {
      drawAnnotations("Electric Cars", "Electric vehicles are outliers with high efficiency.", 500, 120);
    } else {
      drawAnnotations("Explore", "Hover for details or filter by fuel type.", 250, 200);
    }
  }

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

  updateScene();
});
