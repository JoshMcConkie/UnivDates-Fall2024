const data = [
    {
        university: "Brigham Young University (BYU)",
        add: "9/11/2024",
        start: "9/4/2024",
        tuition: "8/28/2024"
    },
    {
        university: "Iowa State University (Early)",
        add: "9/7/2024",
        start: "8/26/2024",
        tuition: "7/24/2024"
    },
    {
        university: "Texas Christian University (TCU)",
        add: "8/23/2024",
        start: "8/21/2024",
        tuition: "8/1/2024"
    },
    {
        university: "West Virginia University",
        add: "8/27/2024",
        start: "8/21/2024",
        tuition: "8/1/2024"
    },
    {
        university: "University of Houston",
        add: "8/26/2024",
        start: "8/19/2024",
        tuition: "8/13/2024"
    },
    {
        university: "Iowa State University (Late)",
        add: "9/7/2024",
        start: "8/26/2024",
        tuition: "8/14/2024"
    },
    {
        university: "Utah State University",
        add: "9/16/2024",
        start: "8/26/2024",
        tuition: "8/14/2024"
    },
    {
        university: "University of Texas at Austin (Early)",
        add: "8/27/2024",
        start: "8/26/2024",
        tuition: "8/15/2024"
    },
    {
        university: "Kansas State University (Early)",
        add: "8/25/2024",
        start: "8/19/2024",
        tuition: "8/19/2024"
    },
    {
        university: "Texas Tech University",
        add: "8/27/2024",
        start: "8/22/2024",
        tuition: "8/19/2024"
    },
    {
        university: "Baylor University",
        add: "8/30/2024",
        start: "8/26/2024",
        tuition: "8/19/2024"
    },
    {
        university: "University of Central Florida",
        add: "8/23/2024",
        start: "8/19/2024",
        tuition: "8/30/2024"
    },
    {
        university: "University of Utah",
        add: "8/26/2024",
        start: "8/19/2024",
        tuition: "8/30/2024"
    },
    {
        university: "Kansas State University (Late)",
        add: "8/25/2024",
        start: "8/19/2024",
        tuition: "9/15/2024"
    },
    {
        university: "Oklahoma State University",
        add: "8/26/2024",
        start: "8/19/2024",
        tuition: "9/15/2024"
    },
    {
        university: "University of Oklahoma",
        add: "8/23/2024",
        start: "8/19/2024",
        tuition: "9/25/2024"
    },
    {
        university: "University of Cincinnati",
        add: "9/1/2024",
        start: "8/26/2024",
        tuition: "8/21/2024"
    },
    {
        university: "Utah Valley University",
        add: "8/27/2024",
        start: "8/21/2024",
        tuition: "9/11/2024"
    },
    {
        university: "Weber State University",
        add: "8/30/2024",
        start: "8/26/2024",
        tuition: "8/23/2024"
    },
    {
        university: "University of Arizona",
        add: "8/25/2024",
        start: "8/26/2024",
        tuition: "8/26/2024"
    },
    {
        university: "University of Texas at Austin (Late)",
        add: "8/29/2024",
        start: "8/26/2024",
        tuition: "9/11/2024"
    },
    {
        university: "University of Kansas",
        add: "8/30/2024",
        start: "8/26/2024",
        tuition: "9/15/2024"
    },
    {
        university: "Southern Utah University",
        add: "9/4/2024",
        start: "8/28/2024",
        tuition: "8/28/2024"
    },
    {
        university: "BYUI",
        add: "9/23/2024",
        start: "9/16/2024",
        tuition: "9/16/2024"
    },
];

document.addEventListener("DOMContentLoaded", function () {
    // Parse dates
    const parseDate = d3.timeParse("%m/%d/%Y");
    data.forEach(d => {
        if (d.add) d.add = parseDate(d.add);
        if (d.start) d.start = parseDate(d.start);
        if (d.tuition) d.tuition = parseDate(d.tuition);
    });

    // Dimensions and margins
    const margin = { top: 20, right: 20, bottom: 30, left: 240 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up xScale domain (min and max among all relevant dates)
    const xScale = d3.scaleTime()
        .domain([
            d3.min(data, d => d3.min([d.add, d.start, d.tuition])),
            d3.max(data, d => d3.max([d.add, d.start, d.tuition]))
        ])
        .range([0, width]);

    const yScale = d3.scaleBand()
        .domain(data.map(d => d.university))
        .range([0, height])
        .padding(0.1);

    // Axes
    const xAxis = svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %d")));

    const yAxis = svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));

    // Color mapping for each date category
    const colors = { add: "red", start: "green", tuition: "blue" };

    // Function to draw or re-draw bars
    function updateChart() {
        // Update yScale domain with current data
        yScale.domain(data.map(d => d.university));

        // Remove any existing bars
        svg.selectAll("rect").remove();

        // Add bars for each date
        Object.keys(colors).forEach(dateKey => {
            svg.selectAll(`.${dateKey}-bar`)
                .data(data)
                .enter()
                .append("rect")
                .attr("class", `${dateKey}-bar`)
                .attr("x", d => xScale(d[dateKey]))
                .attr("y", d => yScale(d.university))
                .attr("width", 5)
                .attr("height", yScale.bandwidth())
                .attr("fill", colors[dateKey]);
        });

        // Update the y-axis
        yAxis.call(d3.axisLeft(yScale));
        
        // Then select and style the specific label
        svg.select(".y-axis")
            .selectAll(".tick text")
            .filter(d => d === "Brigham Young University (BYU)")
            .style("font-weight", "bold");

        // Tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Hover functionality (applies to all bars—delegate on 'svg')
        svg.selectAll("rect")
            .on("mouseover", function (event, d) {
                const key = this.className.baseVal.split("-")[0];
                tooltip.transition().duration(200).style("opacity", 1);
                tooltip.html(`${key.toUpperCase()}: ${d3.timeFormat("%b %d, %Y")(d[key])}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 20) + "px");

                svg.selectAll("rect")
                    .filter((_, i, nodes) => nodes[i] !== this)
                    .style("opacity", 0.3);

                svg.selectAll(".y-axis .tick text")
                    .filter(text => text === d.university)
                    .style("font-weight", "bold")
                    .style("font-size", "14px");
            })
            .on("mouseout", function () {
                tooltip.transition().duration(200).style("opacity", 0);
                svg.selectAll("rect").style("opacity", 1);
                svg.selectAll(".y-axis .tick text")
                    .style("font-weight", "normal")
                    .style("font-size", "12px");
                updateChart();
            });
    }

    // Initial draw
    updateChart();

                

    // Dropdown for sorting
    const sortMenu = document.getElementById("sortMenu");
    sortMenu.addEventListener("change", function() {
        const selected = this.value;
        if (selected === "startAsc") {
            data.sort((a, b) => (a.start || 0) - (b.start || 0));
        } else if (selected === "startDesc") {
            data.sort((a, b) => (b.start || 0) - (a.start || 0));
        } else if (selected === "universityAsc") {
            data.sort((a, b) => d3.ascending(a.university, b.university));
        } else if (selected === "universityDesc") {
            data.sort((a, b) => d3.descending(a.university, b.university));
        } else if (selected === "tutAsc") {
            data.sort((a, b) => (a.tuition || 0) - (b.tuition || 0));
        } else if (selected === "tutDesc") {
            data.sort((a, b) => (b.tuition || 0) - (a.tuition || 0));
        } else if (selected === "addAsc") {
            data.sort((a, b) => (a.add || 0) - (b.add || 0));
        } else if (selected === "addDesc") {
            data.sort((a, b) => (b.add || 0) - (a.add || 0));
        }
        // "none" does not change data order

        // Re-draw after sorting
        updateChart();
    
    });
    
});