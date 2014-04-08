
var arc = d3.svg.arc()
    .startAngle(0)
    .innerRadius(Dashboard.settings.radius)
    .outerRadius(Dashboard.settings.outerRadius);

function lookupOnCollectionById(id, collection) {
  for (var i in collection) {
    var element = collection[i];

    if (element.id == id)
      return element;
    }
}

Array.prototype.clear = function () {
    while (this.length > 0) {
        this.pop();
    }
};

Array.prototype.copy = function (otherArray) {
  for(var elementIndex in otherArray) {
    var element = otherArray[elementIndex];
    if (typeof element == "object") {
      this.push(element);
    }
  }
};

var Dashboard = Dashboard || {};

Dashboard.mainState = function() {
  var currentData = null;
  var changes = null;
  var oldData = [];
  var twoPi = 2 * Math.PI;

  var computeChanges = function() {
    function getColorFromBeaconState(state) {
        switch(state)
        {
          case 'success':
            return Dashboard.settings.colors.success;
          case 'warning':
            return Dashboard.settings.colors.warning;
          case 'error':
            return Dashboard.settings.colors.error;
        }
      }

      function getCircleColorFromBeaconState(state) {
        switch(state)
        {
          case 'success':
            return Dashboard.settings.circleColors.success;
          case 'warning':
            return Dashboard.settings.circleColors.warning;
          case 'error':
            return Dashboard.settings.circleColors.error;
        }
      }

      function _computeTranslate(progress) {
        var endRadians = twoPi * progress;
        var distance_to_draw = Dashboard.settings.radius + ((Dashboard.settings.outerRadius - Dashboard.settings.radius)/2);

        var x = 0 + distance_to_draw * Math.cos((endRadians-0.15) + (3 * Math.PI)/2);
        var y = 0 + distance_to_draw * Math.sin((endRadians-0.15) + (3 * Math.PI)/2);

        return "translate(" + x + "," + y + ")";
      }

      var changeSet = [];

      for (var dataIndex in currentData) {
        var data = currentData[dataIndex];

        if (data.progress === undefined) {
          data.progress = data.current_work_item / data.total_work_items;
        }
      }

      currentData.forEach(function(d) {

        var nullElement = { 
          progress: 0, 
          current_work_item: 0,
          total_work_items: 1,
          last_beacon_state: 'success'
        };
        
        var oldElement = lookupOnCollectionById(d.id, oldData) || nullElement;

        var isChange = (oldElement.progress != d.progress) || (oldElement.last_beacon_state != d.last_beacon_state);

        if (isChange) {
          var oldColor = d3.rgb(getColorFromBeaconState(oldElement.last_beacon_state));

          var newColor = d3.rgb(getColorFromBeaconState(d.last_beacon_state));

          var oldCircleColor = d3.rgb(getCircleColorFromBeaconState(oldElement.last_beacon_state));

          var newCircleColor = d3.rgb(getCircleColorFromBeaconState(d.last_beacon_state));

          d.interpolationFunctions = {
            interpolationFn: d3.interpolate(oldElement.progress, d.progress) ,
            interpolationTextFn: d3.interpolate(_computeTranslate(oldElement.progress), _computeTranslate(d.progress)),
            interpolationColor: d3.interpolateRgb(oldColor, newColor),
            interpolationCircleColor: d3.interpolateRgb(oldCircleColor, newCircleColor)
          };
        }
        
        changeSet.push(d);
      });

      oldData.clear();

      oldData.copy(currentData);

      return changeSet;
  }

  return {
    updateData: function (newData) {
      currentData = newData;
      return computeChanges();
    }
  }

}();