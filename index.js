let middleRight = document.querySelector(".size-edit-box-right-middle");
let wrapRect = document.querySelector(".wrap-rectangle");
let rect = document.querySelector(".rectangle");

wrapRect.addEventListener("click", e=>{
  e.stopPropagation();
    console.log("wrap div clicked");
}, {capture: true})

rect.addEventListener("click", e=>{
    console.log("rect clicked");
})

let isDragging = false;

middleRight.addEventListener('pointerdown', e => {
    if (e.button === 0) {
      isDragging = true;
      middleRight.setPointerCapture(e.pointerId);
    }
});

middleRight.addEventListener('pointermove', e => {
    if (isDragging) {
      const newWrapRectWidth = wrapRect.offsetWidth + e.movementX;
      const newRectWidth = rect.offsetWidth + e.movementX;
      wrapRect.style.width = `${newWrapRectWidth}px`;
      rect.style.width = `${newRectWidth}px`;
      console.log("offsetWidth: ", wrapRect.offsetWidth);
      console.log("movementX: ", e.movementX);
    }
  });
  
  document.addEventListener('pointerup', () => {
    isDragging = false;
  });
  