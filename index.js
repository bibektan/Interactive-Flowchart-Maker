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
  

  
  // line intersection api
  var targetDiv = document.querySelector(".boundary-rectangle");
  var magnetElement = document.querySelector(".magnet");

  var box1 = document.querySelector(".box1");
  var box2 = document.querySelector(".box2");
    
  function handleIntersection(entries) {
    entries.forEach(function(entry) {
      console.log('hello');
      console.log(entry.target);
      if (entry.isIntersecting) {
        // var targetDiv = entry.target;
        console.log("Magnet element is intersecting with the target div: ", entry.target);
      }
    });
  }
  
  var observerOptions = {
    root: box2,
    threshold: 0 // Adjust the threshold value as needed
  };
  
  var observer = new IntersectionObserver(handleIntersection, observerOptions);
  
  observer.observe(box1);
  // targetDivs.forEach(function(targetDiv) {
  // });
  
  // var numb = [2, 7, 12, 18, 25, 37, 41, 46, 48, 55, 57, 62, 66, 69, 74, 77, 82, 88, 89, 93, 97, 99];
  // var closest = document.querySelector("#closest");
  // closest.addEventListener("click", e=>{

  // })


