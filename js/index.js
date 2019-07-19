// // array of all arrows
// const arrows = [];

// // adjusts arrow speed
// const speedMod = 4;

// const addArrow = function () {
//   arrows.unshift(new Arrow()); // unshift adds to FRONT of arrows array
//   currArrow = arrows[0];
// }

// // Arrow prototype
// function Arrow() {
//   this.x = shootingCirc.x;
//   this.y = shootingCirc.y;
//   this.arrowTipCoords = {
//     x: this.x + 20,
//     y: this.y
//   };
//   // left and right parts of the arrow head
//   this.leftTipCoords = {
//     x: this.x + 17,
//     y: this.y - 3
//   }
//   this.rightTipCoords = {
//     x: this.x + 17,
//     y: this.y + 3
//   }
//   this.velX = 0;
//   this.velY = 0;
//   this.speed = 0;
//   this.firing = false;
// }
// Arrow.prototype.fireArrow = function () {
//   if (mousePos && !this.firing) {
//     this.speed = Math.min(shootingCirc.r,
//       distBetween(shootingCirc, mousePos)) / speedMod;
//     this.velX = Math.cos(angleBetween(mousePos, shootingCirc)) * this.speed;
//     this.velY = Math.sin(angleBetween(mousePos, shootingCirc)) * this.speed;
//     this.firing = true;
//     addArrow();
//   }
// }
// Arrow.prototype.calcTrajectory = function () {
//   if (this.y <= groundPoint && this.firing) {
//     this.velY += gravity;
//     this.x += this.velX;
//     this.y += this.velY;
//   } else {
//     this.velX = 0;
//     this.velY = 0;
//     this.firing = false;
//   }
// };
// Arrow.prototype.calcArrowHead = function () {
//   if (this.firing) {
//     var angle = Math.atan2(this.velX, this.velY);
//   } else if (mousePos && this == currArrow) {
//     var angle = Math.PI / 2 - angleBetween(mousePos, shootingCirc);
//   } else return;

//   this.arrowTipCoords.x = this.x + 20 * Math.sin(angle);
//   this.arrowTipCoords.y = this.y + 20 * Math.cos(angle);
//   var arrowTip = { x: this.arrowTipCoords.x, y: this.arrowTipCoords.y }

//   this.leftTipCoords.x = arrowTip.x - 3 * Math.sin(angle - Math.PI / 4);
//   this.leftTipCoords.y = arrowTip.y - 3 * Math.cos(angle - Math.PI / 4);
//   this.rightTipCoords.x = arrowTip.x - 3 * Math.sin(angle + Math.PI / 4);
//   this.rightTipCoords.y = arrowTip.y - 3 * Math.cos(angle + Math.PI / 4);
// };
// Arrow.prototype.drawArrow = function () {
//   this.calcTrajectory();
//   this.calcArrowHead();
//   var arrowTip = this.arrowTipCoords;
//   var leftTip = this.leftTipCoords;
//   var rightTip = this.rightTipCoords;

//   ctx.beginPath();
//   ctx.moveTo(this.x, this.y);
//   ctx.lineTo(arrowTip.x, arrowTip.y);

//   ctx.moveTo(arrowTip.x, arrowTip.y);
//   ctx.lineTo(leftTip.x, leftTip.y);

//   ctx.moveTo(arrowTip.x, arrowTip.y);
//   ctx.lineTo(rightTip.x, rightTip.y);

//   ctx.strokeStyle = "black";
//   ctx.stroke();
// };

import * as arrow from "./arrow"


// CREATE THE CANVAS //
const canvas = document.createElement("canvas");
canvas.id = 'canvas';
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 15;
canvas.height = window.innerHeight - 15;
document.body.appendChild(canvas);
cWidth = canvas.width;
cHeight = canvas.height;
// // // // // // // //
///////////////////////

// gravity and stuff
const gravity = 0.4;
const groundPoint = cHeight - (cHeight / 4);

// drawnBack and firedArrow booleans to assert state of currArrow
let drawnBack = false;
let firedArrow = false;

// calculate distance between two points
const distBetween = function (p1, p2) {
  return Math.sqrt(Math.pow((p2.x - p1.x), 2)
    + Math.pow((p2.y - p1.y), 2));
}

// checks if the mouse position is within < radius distance to the center
// of the shooting circle
const isInCircle = function (mousePos) {
  let distFromCenter = distBetween(drawBackCirc, mousePos);
  if (distFromCenter < drawBackCirc.r) return true;
  else return false;
}

function getMousePos(canvas, evt) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

/////////////////////
// EVENT LISTENERS //
let mousePos;
let mouseDown = false;
let mouseUp = false;
// MOUSE MOVE
addEventListener("mousemove", function (evt) {
  mousePos = getMousePos(canvas, evt);
}, false);
// MOUSE DOWN
addEventListener("mousedown", function (evt) {
  mousePos = getMousePos(canvas, evt);
  mouseDown = true;
  mouseUp = false;
}, false);
// MOUSE UP
addEventListener("mouseup", function (evt) {
  mousePos = getMousePos(canvas, evt);
  mouseUp = true;
  mouseDown = false;
}, false);
// // // // // // //
/////////////////////

const drawScene = function () {
  // increased groundPoint so arrows stick where they should in the ground
  let ground = groundPoint + 15;
  // sky
  ctx.fillStyle = "rgba(0,0,200,0.2)";
  ctx.fillRect(0, 0, cWidth, ground);
  // ground
  ctx.beginPath();
  ctx.moveTo(0, ground);
  ctx.lineTo(cWidth, ground);
  ctx.strokeStyle = "rgba(0,100,50,0.6)";
  ctx.stroke();
  ctx.fillStyle = "rgba(0,200,100,0.6)";
  ctx.fillRect(0, ground, cWidth, cHeight);
}

// calculate angle between two points
let angleBetween = function (p1, p2) {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

// SHOOTING CIRCLES //
let getAimCoords = function (mousePos) {
  /* NOTE: angleBetween(p1, p2) is 180deg opposite of angleBetween(p2, p1) */
  let angle = Math.PI / 2 - angleBetween(mousePos, shootingCirc);
  let distance = Math.min(distBetween(shootingCirc, mousePos), shootingCirc.r);
  let x = shootingCirc.x + distance * Math.sin(angle);
  let y = shootingCirc.y + distance * Math.cos(angle);
  return { x: x, y: y };
}
let drawAimer = function () {
  if (drawnBack) {
    aimCoords = getAimCoords(mousePos);
    ctx.beginPath();
    ctx.moveTo(aimCoords.x, aimCoords.y);
    ctx.lineTo(shootingCirc.x, shootingCirc.y);
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.stroke();
  }
}
const shootingCirc = {
  x: 200,
  y: groundPoint - 200,
  r: 75
}
const drawBackCirc = {
  x: shootingCirc.x,
  y: shootingCirc.y,
  r: 10
}
const drawCircles = function () {
  ctx.beginPath();
  ctx.arc(shootingCirc.x, shootingCirc.y, shootingCirc.r, 0, 2 * Math.PI);
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(drawBackCirc.x, drawBackCirc.y, drawBackCirc.r, 0, 2 * Math.PI);
  ctx.stroke();
  drawAimer();
}

let isFiredArrow = function () {
  if (mousePos && drawnBack && mouseUp) {
    drawnBack = false;
    firedArrow = true;
  }
}

let isDrawnBack = function () {
  if (mousePos && isInCircle(mousePos)) {
    if (mouseDown) drawnBack = true;
    else if (mouseUp) drawnBack = false;
  }
}

let writeInfo = function (mousePos) {
  ctx.font = "11px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  if (isInCircle(mousePos) && mouseDown) {
    ctx.fillStyle = "red";
  } else {
    ctx.fillStyle = "black";
  }
  ctx.fillText("Mouse Position: " + mousePos.x + ", " + mousePos.y, 20, 20);
  ctx.fillText("Circle Position: " + shootingCirc.x + ", " + shootingCirc.y, 20, 40);
  ctx.fillText("Angle: " + angleBetween(mousePos, shootingCirc), 20, 60);
}



// UPDATE //
const update = function () {
  isDrawnBack();
  isFiredArrow();
  if (firedArrow) {
    currArrow.fireArrow();
    firedArrow = false;
  }
  // clear the canvas
  ctx.clearRect(0, 0, cWidth, cHeight);
}

// RENDER //
const render = function () {
  // if(mousePos) writeInfo(mousePos);
  drawCircles();
  for (i = 0; i < arrows.length; i++) {
    arrows[i].drawArrow();
  }
  drawScene();
}

// *** |\/| /_\ | |\| *** //
const main = function () {
  update();
  render();
  requestAnimationFrame(main);
}

let w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
// add initial arrow
arrow.currArrow = arrows[0];
arrow.addArrow();
main();