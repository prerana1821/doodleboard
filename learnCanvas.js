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

tool.strokeStyle = "red"; // color of the drawing
// tool.beginPath(); // new graphic (path) (line)
// tool.moveTo(10, 10); // start point
tool.lineTo(200, 200);
tool.stroke();

// -----------------------------------------

// change background color on canvas such that even if I have a eraser with white color it should not change the background color of canvas

// Set the background color of the canvas
canvas.style.backgroundColor = "#ffafa3"; // Set your desired background color

// Draw a rectangle to fill the canvas with the background color
tool.fillStyle = "#ffafa3"; // Set the same background color
tool.fillRect(0, 0, canvas.width, canvas.height);

// Set initial drawing properties
tool.strokeStyle = "black"; // Default color
tool.lineWidth = 8;
tool.lineCap = "round";

// Function to draw a line
function drawLine(x1, y1, x2, y2) {
  tool.beginPath();
  tool.moveTo(x1, y1);
  tool.lineTo(x2, y2);
  tool.stroke();
}

// Simulate drawing with a black pen
drawLine(10, 10, 100, 100);

// Simulate erasing with a white eraser (does not affect canvas background color)
tool.strokeStyle = "white"; // Change color to white for the eraser
tool.lineWidth = 20; // Increase line width for eraser

// Erase part of the line (example)
drawLine(50, 50, 150, 150); // This should appear as an erased line without affecting canvas background color
