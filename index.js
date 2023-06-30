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


var flow = document.querySelector(".flow");
var boxes = document.querySelectorAll(".box");

flow.addEventListener("pointerdown", function(e) {
  e = e || window.event;
  e.preventDefault();
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  let elmnt = e.target;

  // get the mouse cursor position at startup:
  pos3 = e.clientX;
  pos4 = e.clientY;

  document.onpointerup = closeDragElement;

  document.onpointermove = elementDrag;

  function elementDrag(e){
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    let prntElmnt = document.getElementById("whiteBoard");
    let parentRect = prntElmnt.getBoundingClientRect();

    let newTop = elmnt.offsetTop - pos2;
    let newLeft = elmnt.offsetLeft - pos1;

    let maxTop = parentRect.height - elmnt.offsetHeight;
    let maxLeft = parentRect.width - elmnt.offsetWidth;

    // Restrict the element within the parent element's boundaries:
    newTop = Math.min(Math.max(newTop, 0), maxTop);
    newLeft = Math.min(Math.max(newLeft, 0), maxLeft);


    // Set the element's new position:
    elmnt.style.top = newTop + "px";
    elmnt.style.left = newLeft + "px";

    calculateRelative(e);
  }
  
  function closeDragElement(){
    /* stop moving when mouse button is released:*/
    document.onpointerup = null;
    document.onpointermove = null;
  }
});





function calculateRelative(e) {
  console.log("***********************************");
  let flowRect = flow.getBoundingClientRect();
  let flowX = flowRect.left + flowRect.width / 2;
  let flowY = flowRect.top + flowRect.height / 2;

  let nearestBox = null;
  let nearestDistance = Infinity;

  boxes.forEach(function(box) {
    let boxRect = box.getBoundingClientRect();
    let boxX = boxRect.left + boxRect.width / 2;
    let boxY = boxRect.top + boxRect.height / 2;

    let distance = Math.sqrt(Math.pow(flowX - boxX, 2) + Math.pow(flowY - boxY, 2));

    if (distance < nearestDistance) {
      nearestBox = box;
      nearestDistance = distance;
    }
  });

  if(nearestDistance < 25000 ){
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

    console.log("distance flow left:", distanceFlowLeft);
    console.log("distance flow right:", distanceFlowRight);

    let flowLeftRight = null;
    if(distanceFlowLeft < distanceFlowRight){
      flowLeftRight = flowLeft;
    }else{
      flowLeftRight = flowRight;
    }
    
    if(flowLeftRight !== null){

      let flowLeftRightRect = flowLeftRight.getBoundingClientRect();
      let flowX = flowLeftRightRect.left + flowLeftRightRect.width/2;
      let flowY = flowLeftRightRect.top + flowLeftRightRect.height/2;

      let topRect = top.getBoundingClientRect();
      let topX = topRect.left + topRect.width / 2;
      let topY = topRect.top + topRect.height / 2;
      let distancetop = Math.sqrt(Math.pow(flowX - topX, 2) + Math.pow(flowY - topY, 2));

      let bottomRect = bottom.getBoundingClientRect();
      let bottomX = bottomRect.left + bottomRect.width / 2;
      let bottomY = bottomRect.top + bottomRect.height / 2;
      let distancebottom = Math.sqrt(Math.pow(flowX - bottomX, 2) + Math.pow(flowY - bottomY, 2));

      let rightRect = right.getBoundingClientRect();
      let rightX = rightRect.left + rightRect.width / 2;
      let rightY = rightRect.top + rightRect.height / 2;
      let distanceright = Math.sqrt(Math.pow(flowX - rightX, 2) + Math.pow(flowY - rightY, 2));

      let leftRect = left.getBoundingClientRect();
      let leftX = leftRect.left + leftRect.width / 2;
      let leftY = leftRect.top + leftRect.height / 2;
      let distanceleft = Math.sqrt(Math.pow(flowX - leftX, 2) + Math.pow(flowY - leftY, 2));

      let distArr = [distancetop, distancebottom, distanceright, distanceleft];
      let minDist = distArr.indexOf(Math.min(...distArr));
      if(minDist == 0){
        console.log("near is top");
      }
      else if(minDist == 1){
        console.log("near is bottom");
      }
      else if(minDist == 2){
        console.log("near is right");
      }
      else if(minDist == 3){
        console.log("near is left");
      }

      console.log("top:", distancetop);
      console.log("bottom:", distancebottom);
      console.log("right:", distanceright);
      console.log("left:", distanceleft);
    }
  }

  console.log("Nearest box:", nearestBox);
  console.log("Nearest distance:", nearestDistance);

};