var Dashboard = Dashboard || {};

Dashboard.settings =  {        
  x_center: 150,
  y_center: 110,
  width: 300,
  height: 220,
  radius:70,
  outerRadius:95,
  formatPercent: d3.format(".0%"),
  colors: {
    success: '#5CACEE',
    warning: '#FDD017',
    error: '#F70D1A'
  },
  circleColors: {
    success: '#2A7ABC',
    warning: '#CB9E00',
    error: '#C50000'
  },
  timers : {
    updateDelayTime: 3000,
    animationTime: 1500
  }
};