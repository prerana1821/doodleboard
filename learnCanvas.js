let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// API
let tool = canvas.getContext("2d");

tool.strokeStyle = "black"; // color of the drawing
tool.lineWidth = "8"; // width of line
tool.lineCap = "round"; // borders of the line round or square

// Create an array for different line dash patterns
let lineStyles = [
  [], // Solid line
  [15, 10], // Dashed line
  [5, 10], // Dotted line
];

// Define the line dash styles
let currentLineStyleIndex = 2;
tool.setLineDash(lineStyles[currentLineStyleIndex]);

tool.beginPath(); // new graphic (path) (line)
tool.moveTo(10, 10); // start point
tool.lineTo(100, 150); // end point
tool.stroke(); // fill color (fill graphic)

// tool.beginPath(); // new graphic (path) (line)
// tool.moveTo(10, 10); // start point
tool.lineTo(200, 200);
tool.stroke();
