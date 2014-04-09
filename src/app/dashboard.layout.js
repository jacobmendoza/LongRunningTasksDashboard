var Dashboard = Dashboard || {};

Dashboard.layoutDrawer = function() {

  var twoPi = 2 * Math.PI;

  return {
    draw: function (newData) {
      
		var progressBoxes = d3
		      .select("body")
		      .select("#gauges_container")
		      .selectAll(".progress-box")
		      .data(newData, function(d) { return d.id; });

		var enterSelection = progressBoxes    
		      .enter()
		        .insert("div")
		        .attr("class", "progress-box")
		        .attr("style", "width: " + Dashboard.settings.width)

		progressBoxes.exit().remove();

		enterSelection.append("div")
		  .attr("class", "header")
		  .append("div").attr("style", "padding:10px;")
		  .text(function(d) { return d.id; });

		var svgGroup = enterSelection.append("div")
		      .attr("class", "mself")
		      .append("svg")
		        .attr("width", Dashboard.settings.width)
		        .attr("height", Dashboard.settings.height)
		        .append("g")
		          .attr("transform", "translate(" + Dashboard.settings.x_center + "," + Dashboard.settings.y_center + ")")
		          .attr("class", "progress-meter");

		svgGroup
		        .append("path")
		          .attr("class", "background")
		          .attr("d", arc.endAngle(twoPi));

		var foreground = svgGroup
		        .append("path")
		      .attr("class", "foreground foreground-success")
		        .attr("class", function(d) { return 'foreground foreground-' + d.last_beacon_state });

		var circles = svgGroup
		        .append("circle")
		          .attr("r", 7)
		          .attr("class", "circle-pointer")
		          .attr("fill", "#CCC")
		          .attr("class", function (d) { return "circle-pointer circle-pointer-" + d.last_beacon_state });

		var text = svgGroup
		    .append("text")
		        .attr("class", "big-text")
		        .attr("text-anchor", "middle")
		        .attr("dy", "0em")
		        .text(function(d) { return Dashboard.settings.formatPercent(d.progress) });

		var subtext = svgGroup
		      .append("text")
		        .attr("class", "little-text")
		        .attr("text-anchor", "middle")
		        .attr("dy", "1.25em")
		        .text(function(d) { return d.current_work_item + "/" + d.total_work_items; });  
    }
  }
}();