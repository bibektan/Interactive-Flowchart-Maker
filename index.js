// let middleRight = document.querySelector(".size-edit-box-right-middle");
// let wrapRect = document.querySelector(".wrap-rectangle");
// let rect = document.querySelector(".rectangle");

// wrapRect.addEventListener("click", e=>{
//   e.stopPropagation();
//     console.log("wrap div clicked");
// }, {capture: true})

// rect.addEventListener("click", e=>{
//     console.log("rect clicked");
// })

// let isDragging = false;

// middleRight.addEventListener('pointerdown', e => {
//     if (e.button === 0) {
//       isDragging = true;
//       middleRight.setPointerCapture(e.pointerId);
//     }
// });

// middleRight.addEventListener('pointermove', e => {
//     if (isDragging) {
//       const newWrapRectWidth = wrapRect.offsetWidth + e.movementX;
//       const newRectWidth = rect.offsetWidth + e.movementX;
//       wrapRect.style.width = `${newWrapRectWidth}px`;
//       rect.style.width = `${newRectWidth}px`;
//       console.log("offsetWidth: ", wrapRect.offsetWidth);
//       console.log("movementX: ", e.movementX);
//     }
//   });
  
//   document.addEventListener('pointerup', () => {
//     isDragging = false;
//   });
  

// var flow = document.querySelector(".flow");
// var boxes = document.querySelectorAll(".box");

// flow.addEventListener("click", function() {
//   // boxes.forEach(function(box) {
//   //   var boxRect = box.getBoundingClientRect();
//   //   var boxPosition = {
//   //     top: boxRect.top,
//   //     right: boxRect.right,
//   //     bottom: boxRect.bottom,
//   //     left: boxRect.left
//   //   };
//   //   console.log("Box position:", boxPosition);
//   // });
//   boxes.forEach(function(box) {
//     var boxX = box.offsetLeft;
//     var boxY = box.offsetTop;
//     var position = boxX + boxY;
//     console.log(box.classList[0],"position:", position, "top:", box.offsetTop, "left:", box.offsetLeft);
//   });

//   console.log("Line Position: ", flow.offsetLeft + flow.offsetTop, "top:", flow.offsetTop, "left:", flow.offsetLeft);
// });


let whiteBoard = document.querySelector("#whiteBoard");

let boxButton = document.querySelector(".box-button");
let lineButton = document.querySelector(".line-button");

lineButton.addEventListener("click", e =>{
  let rand = Math.floor(Math.random() * 99999);
  let lineDiv = document.createElement("div");
  lineDiv.className = "flow";
  lineDiv.id = "line-"+rand;
  lineDiv.style.width = "300px";
  lineDiv.style.height = "10px";
  lineDiv.style.background = "black";
  lineDiv.style.position = "absolute";
  lineDiv.style.top = "100px";
  lineDiv.style.left = "300px";
  lineDiv.style.transformOrigin = "left";
  lineDiv.style.transform = "rotate(0deg)";
  lineDiv.setAttribute("free", "true");
  lineDiv.setAttribute("parent", "null");
  lineDiv.setAttribute("attached", "false");

  let leftDiv = document.createElement("div");
  leftDiv.className = "flow-left";
  leftDiv.textContent = "L";
  
  let rightDiv = document.createElement("div");
  rightDiv.className = "flow-right";
  rightDiv.textContent = "R";

  lineDiv.appendChild(leftDiv);
  lineDiv.appendChild(rightDiv);

  whiteBoard.append(lineDiv);

  let flows = document.querySelectorAll(".flow");
  flows.forEach(flow => {
    flow.addEventListener("pointerdown", led => dragItDown(led));
  })
})

boxButton.addEventListener("click", e => {
  let rand = Math.floor(Math.random() * 9999999);
  let boxDiv = document.createElement("div");
  boxDiv.className = `test${rand} test`;
  boxDiv.style.position = "absolute";
  boxDiv.style.top = "30px";
  boxDiv.style.left = "30px";
  boxDiv.id = rand;

  let boxRight = document.createElement("div");
  boxRight.className = `test${rand}-right test-right`;

  let boxLeft = document.createElement("div");
  boxLeft.className = `test${rand}-left test-left`;

  let boxtop = document.createElement("div");
  boxtop.className = `test${rand}-top test-top`;

  let boxbottom = document.createElement("div");
  boxbottom.className = `test${rand}-bottom test-bottom`;

  boxDiv.appendChild(boxRight);
  boxDiv.appendChild(boxLeft);
  boxDiv.appendChild(boxtop);
  boxDiv.appendChild(boxbottom);

  boxDiv.addEventListener("pointerdown", bdce => dragItDown(bdce));
  

  whiteBoard.append(boxDiv);
})

let blinkInfo = [null, null];
let lastMove = {box: null, line: null, lineSide: null, side: null, sideElement: null, distance: null, position: null, nearestDistance: null, lineTop: null, lineLeft: null};
let nearestDistanceLimit = 300;

function dragItDown(e){
  e = e || window.event;
  e.preventDefault();
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  let elmnt = e.target;

  // get the mouse cursor position at startup:
  pos3 = e.clientX;
  pos4 = e.clientY;
  
  document.onpointerup = closeDragElement;
  
  document.onpointermove = elementDrag;
  
  function elementDrag(eld){

    // if line is attached to the box or not
    if(e.target.classList.contains('flow')){
      if(e.target.getAttribute("attached") == "true"){
        e.target.setAttribute("attached", "false");
      }
    }
    
    eld = eld || window.event;
    eld.preventDefault();

    // calculate the new cursor position:
    pos1 = pos3 - eld.clientX;
    pos2 = pos4 - eld.clientY;
    pos3 = eld.clientX;
    pos4 = eld.clientY;

    
    let prntElmnt = document.getElementById("whiteBoard");
    let parentRect = prntElmnt.getBoundingClientRect();
    
    var newTop = elmnt.offsetTop - pos2;
    var newLeft = elmnt.offsetLeft - pos1;

    var maxTop = parentRect.height - elmnt.offsetHeight;
    var maxLeft = parentRect.width - elmnt.offsetWidth;

    // Restrict the element within the parent element's boundaries:
    newTop = Math.min(Math.max(newTop, 0), maxTop);
    newLeft = Math.min(Math.max(newLeft, 0), maxLeft);

    // Set the element's new position:
    // elmnt.style.top = eld.offsetY + "px";
    // elmnt.style.left = eld.offsetX + "px";

    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

    if(e.target.classList.contains("flow")){
      calculateRelative(e);
    }
  }
}


function closeDragElement(cde){
  console.log(lastMove);
  if(lastMove.box !== null){

    // magnetic property logic
    if(lastMove.sideElement.classList.contains("blink")){
      console.log("yes baby");
      console.log(lastMove.line);

      let lside = lastMove.lineSide.className.split("flow-")[1];
      let bside = lastMove.sideElement.classList.contains("test-right") ? "right"
                : lastMove.sideElement.classList.contains("test-left") ? "left"
                : lastMove.sideElement.classList.contains("test-top") ? "top"
                : lastMove.sideElement.classList.contains("test-bottom") ? "bottom"
                : null;

      console.log("line side:", lside)
      console.log("box side:", bside)

      let compStyleBox = window.getComputedStyle(lastMove.box);
      let boxWidth = compStyleBox.width.split("px")[0];
      let boxHeight = compStyleBox.height.split("px")[0];

      let thatLine = lastMove.line;
      let compStyleLine = window.getComputedStyle(thatLine);
      let lineHeight = compStyleLine.height.split("px")[0];

      thatLine.style.removeProperty("left")
      thatLine.style.removeProperty("right")
      thatLine.style.removeProperty("top")
      thatLine.style.removeProperty("bottom")
      
      if( (lside == "left") && (bside == "right") ){
        thatLine.style[lside] = boxWidth + "px";
      }else if( (lside == "left") && (bside == "left") ){
        thatLine.style[lside] = "0px";
      }else if( (lside == "left" || lside == "right") && bside == "top"){
        thatLine.style[lside] = boxWidth/2 + "px";
        thatLine.style[bside] = -lineHeight + "px";
      }else if( (lside == "left" || lside == "right") && bside == "bottom"){
        thatLine.style[lside] = boxWidth/2 + "px";
        thatLine.style[bside] = -lineHeight + "px";
      }
      else if(lside == "right" && bside == "left"){
        thatLine.style[lside] = boxWidth + "px";
      }else if(lside == "right" && bside == "right"){
        thatLine.style[lside] = "0px";
      }
      // thatLine.style.left = 100 + "px";
      // thatLine.style.left = compStyleBox.right.split("px")[0];
      // thatLine.style.left = "";
      // thatLine.style.top = "";
      thatLine.setAttribute("free", "false");
      thatLine.setAttribute("parent", lastMove.box.id);
      thatLine.setAttribute("attached", "true");
      lastMove.box.appendChild(thatLine);

      if(lastMove.line.getAttribute("attached") == "true"){
        lastMove.sideElement.classList.remove("blink");
      }


      // let boxSideRect = lastMove.sideElement.getBoundingClientRect();
      // let boxSideX = boxSideRect.left + boxSideRect.width/2;
      // let boxSideY = boxSideRect.top + boxSideRect.height/2;

      // let lineSideRect = lastMove.lineSide.getBoundingClientRect();
      // let lineSideX = lineSideRect.left + lineSideRect.width/2;
      // let lineSideY = lineSideRect.top + lineSideRect.height/2;

      // let distance = Math.sqrt(Math.pow(lineSideX - boxSideX, 2) + Math.pow(lineSideY - boxSideY, 2));

      // console.log("final distance is:", distance);
    }else{
      console.log("no baby");
    }

    // in and out of zone
    if(cde.target.classList.contains("flow") && cde.target === lastMove.line){
      if(cde.target.getAttribute("free") === "false"){
        if(lastMove.nearestDistance > nearestDistanceLimit){
          console.log("not free");
          let lineRect = cde.target.getBoundingClientRect();
          let lineParentRect = document.getElementById(cde.target.getAttribute("parent")).getBoundingClientRect();

          let replaceLine = lastMove.line;

          replaceLine.style.removeProperty("left")
          replaceLine.style.removeProperty("right")
          replaceLine.style.removeProperty("top")
          replaceLine.style.removeProperty("bottom")
    
          console.log(lineRect.top);
          console.log(lineRect.left);
          console.log(window.scrollY);
          console.log(window.scrollX);
          replaceLine.style.top = lineRect.top + "px";
          replaceLine.style.left = lineRect.left + "px";

          replaceLine.setAttribute("free", "true");
          replaceLine.setAttribute("parent", "null");

          whiteBoard.appendChild(replaceLine);
          // lastMove.box.removeChild(lastMove.line);
          // console.log("fuck")
        }
      }
    }
  }


  // stop moving when mouse button is released:
  document.onpointerup = null;
  document.onpointermove = null;
}

function calculateRelative(e) {
  console.log("***********************************");
  console.log(e.target);
  let flow = e.target;
  let flowRect = e.target.getBoundingClientRect();
  let flowX = flowRect.left + flowRect.width / 2;
  let flowY = flowRect.top + flowRect.height / 2;

  let nearestBox = null;
  let nearestDistance = Infinity;

  let tests = document.querySelectorAll(".test");
  tests.forEach(function(box) {
    let boxRect = box.getBoundingClientRect();
    let boxX = boxRect.left + boxRect.width / 2;
    let boxY = boxRect.top + boxRect.height / 2;

    let distance = Math.sqrt(Math.pow(flowX - boxX, 2) + Math.pow(flowY - boxY, 2));

    if (distance < nearestDistance) {
      nearestBox = box;
      nearestDistance = distance;
    }

  });

  // adding nearest distance in lastmove object
  lastMove.nearestDistance = nearestDistance;
  lastMove.lineTop = flowRect.top;
  lastMove.lineLeft = flowRect.left;

  if(nearestDistance < nearestDistanceLimit ){  
    let mainClass = nearestBox.classList[0];
    let top = document.querySelector(`.${mainClass}-top`);
    let bottom = document.querySelector(`.${mainClass}-bottom`);
    let left = document.querySelector(`.${mainClass}-left`);
    let right = document.querySelector(`.${mainClass}-right`);

    let flowRight = document.querySelector(".flow-right");
    let flowLeft = document.querySelector(".flow-left");

    let flowRightRect = flowRight.getBoundingClientRect();
    let flowRightRectX = flowRightRect.left + flowRightRect.width/2;
    let flowRightRectY = flowRightRect.top + flowRightRect.height/2;

    let flowLeftRect = flowLeft.getBoundingClientRect();
    let flowLeftRectX = flowLeftRect.left + flowLeftRect.width/2;
    let flowLeftRectY = flowLeftRect.top + flowLeftRect.height/2;

    let nearestBoxRect = nearestBox.getBoundingClientRect();
    let nearestBoxRectX = nearestBoxRect.left + nearestBoxRect.width/2;
    let nearestBoxRectY = nearestBoxRect.top + nearestBoxRect.height/2;

    let distanceFlowLeft = Math.sqrt(Math.pow(nearestBoxRectX - flowLeftRectX, 2) + Math.pow(nearestBoxRectY - flowLeftRectY, 2));
    let distanceFlowRight = Math.sqrt(Math.pow(nearestBoxRectX - flowRightRectX, 2) + Math.pow(nearestBoxRectY - flowRightRectY, 2));

    let flowLeftRight = null;
    if(distanceFlowLeft < distanceFlowRight){
      flowLeftRight = flowLeft;
    }else{
      flowLeftRight = flowRight;
    }
    
    let flowLeftRightRect = flowLeftRight.getBoundingClientRect();
    let flowSpecificX = flowLeftRightRect.left + flowLeftRightRect.width/2;
    let flowSpecificY = flowLeftRightRect.top + flowLeftRightRect.height/2;

    let topRect = top.getBoundingClientRect();
    let topX = topRect.left + topRect.width / 2;
    let topY = topRect.top + topRect.height / 2;
    let distancetop = Math.sqrt(Math.pow(flowSpecificX - topX, 2) + Math.pow(flowSpecificY - topY, 2));

    let bottomRect = bottom.getBoundingClientRect();
    let bottomX = bottomRect.left + bottomRect.width / 2;
    let bottomY = bottomRect.top + bottomRect.height / 2;
    let distancebottom = Math.sqrt(Math.pow(flowSpecificX - bottomX, 2) + Math.pow(flowSpecificY - bottomY, 2));

    let rightRect = right.getBoundingClientRect();
    let rightX = rightRect.left + rightRect.width / 2;
    let rightY = rightRect.top + rightRect.height / 2;
    let distanceright = Math.sqrt(Math.pow(flowSpecificX - rightX, 2) + Math.pow(flowSpecificY - rightY, 2));

    let leftRect = left.getBoundingClientRect();
    let leftX = leftRect.left + leftRect.width / 2;
    let leftY = leftRect.top + leftRect.height / 2;
    let distanceleft = Math.sqrt(Math.pow(flowSpecificX - leftX, 2) + Math.pow(flowSpecificY - leftY, 2));

    let distArr = [distancetop, distancebottom, distanceright, distanceleft];
    let distArrPosition = [[topX, topY], [bottomX, bottomY], [rightX, rightY], [leftX, leftY]];
    let distName = ["top", "bottom", "right", "left"];
    let distElement = [top, bottom, right, left];
    let minDistArrayIndex = distArr.indexOf(Math.min(...distArr));

    let blinkElement = distElement[minDistArrayIndex];
    if(blinkInfo[1] != null){
      console.log("not null");
      if(blinkInfo[1] !== blinkElement){
        blinkInfo[0] = blinkInfo[1];
        blinkInfo[1] = blinkElement;

        blinkInfo[0].classList.remove("blink");
        blinkInfo[1].classList.add("blink");
      }
    }
    blinkInfo[1] = blinkElement;
    if(!blinkElement.classList.contains("blink")){
      blinkElement.classList.add("blink");
    }

    lastMove.box = nearestBox;
    lastMove.line = flow;
    lastMove.lineSide = flowLeftRight;
    lastMove.side = distName[minDistArrayIndex];
    lastMove.sideElement = blinkInfo[1];
    lastMove.distance = distArr[minDistArrayIndex];
    lastMove.position = distArrPosition[minDistArrayIndex];

  }else{
    if(blinkInfo[0] !== null){
      if(blinkInfo[0].classList.contains("blink")){
        blinkInfo[0].classList.remove("blink");
      }
    }
    if(blinkInfo[1] !== null){
      if(blinkInfo[1].classList.contains("blink")){
        blinkInfo[1].classList.remove("blink");
      }
    }
  }

  // console.log("Nearest box:", nearestBox);
  // console.log("Nearest distance:", nearestDistance);

};