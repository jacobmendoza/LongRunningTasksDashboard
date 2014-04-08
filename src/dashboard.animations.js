var Dashboard = Dashboard || {};

Dashboard.animationsManager = function() {

  var twoPi = 2 * Math.PI;

	var animateTexts =  function(currentData) {
		var littleTexts = d3.selectAll("text.little-text");
		var bigTexts = d3.selectAll("text.big-text");

		bigTexts
			.transition()
			.duration(Dashboard.settings.timers.animationTime)
			.text(function (d) { 
				var thisChange = lookupOnCollectionById(d.id, currentData);
				return Dashboard.settings.formatPercent(thisChange.progress);
			});

		littleTexts
			.transition()
			.duration(Dashboard.settings.timers.animationTime)
			.text(function (d) {
				var thisChange = lookupOnCollectionById(d.id, currentData);
				return thisChange.current_work_item + "/" + thisChange.total_work_items;
			});
	}

	function animateProgress(changes) {
		var currentForegroundPaths = d3.selectAll("path.foreground");

	    currentForegroundPaths
	      .transition()
	      .duration(Dashboard.settings.timers.animationTime)
	      .tween("d", function() {
	         return function(t) {
	           var data = lookupOnCollectionById(this.__data__.id, changes);

      	      if (data.interpolationFunctions !== undefined) {
      	        var progressInterpolationResult = data.interpolationFunctions.interpolationFn(t);

      	        var colorInterpolationResult = data.interpolationFunctions.interpolationColor(t);

      	        d3.select(this).attr("style", "fill: " + colorInterpolationResult);

      	        d3.select(this).attr("d", arc.endAngle(twoPi * progressInterpolationResult));
      	      }
	       };
       }); 
  }

  function animateCircles(changes) {
    function computeTranslate(progress) {
      var endRadians = twoPi * progress;

      var distance_to_draw = Dashboard.settings.radius + ((Dashboard.settings.outerRadius - Dashboard.settings.radius)/2);

      var x = 0 + distance_to_draw * Math.cos((endRadians-0.15) + (3 * Math.PI)/2);
      var y = 0 + distance_to_draw * Math.sin((endRadians-0.15) + (3 * Math.PI)/2);

      return "translate(" + x + "," + y + ")";
    }

    var circles = d3.selectAll("circle");

    circles
      .transition()
      .duration(Dashboard.settings.timers.animationTime)
      .tween("transform", function() {
      return function(t) {
        var data = lookupOnCollectionById(this.__data__.id, changes);

        if (data.interpolationFunctions !== undefined) {
          var interpolationColorResult = data.interpolationFunctions.interpolationCircleColor(t);

          var interpolatedProgress = data.interpolationFunctions.interpolationFn(t);

          if ((interpolatedProgress < 0.03)) 
          {
            d3.select(this).attr('style', 'display:none');
          }
          else 
          {
            var translate = computeTranslate(interpolatedProgress);

            d3.select(this).attr('style', 'fill: ' + interpolationColorResult);

            d3.select(this).attr("transform", translate );
          }
        }
      };
    }); 
  }

  return {
    animate: function (newData) {

      animateCircles(newData);

    	animateTexts(newData);

      animateProgress(newData);
    }
  }
}();