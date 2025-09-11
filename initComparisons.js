function initComparisons() {
  const overlays = document.getElementsByClassName("img-comp-overlay");
  for (let i = 0; i < overlays.length; i++) {
    compareImages(overlays[i]);
  }

  function compareImages(img) {
    let slider, line, clicked = 0, w, h;
    let animInProgress = false; // flag
    let animCancel = false; // cancelar si hay input

    w = img.offsetWidth;
    h = img.offsetHeight;
    img.style.width = (w - w/6) + "px";

    // línea
    line = document.createElement("DIV");
    line.setAttribute("class", "img-comp-line");
    img.parentElement.insertBefore(line, img);

    // perilla
    slider = document.createElement("DIV");
    slider.setAttribute("class", "img-comp-slider");
    slider.innerHTML = "↔";
    img.parentElement.insertBefore(slider, img);

    slider.style.top = (h / 2) - (slider.offsetHeight / 2) + "px";
    slider.style.left = (w - w/6) - (slider.offsetWidth / 2) + "px";
    line.style.left = w - w/6 + "px";

    // -------- ANIMACIÓN AL ENTRAR EN VIEWPORT --------
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !animInProgress && !animCancel) {
        animInProgress = true;
        runIntroAnim();
        observer.disconnect();
      }
    }, { threshold: 0.5 }); // mitad visible

    observer.observe(slider);

    function runIntroAnim() {
      let start = w - w/6;
      let delta = -60;

      // guardamos cada animación para poder cancelarla luego
      introAnimations = [
        line.animate([
          { left: start + "px" },
          { left: (start + delta) + "px" },
          { left: start + "px" }
        ], { duration: 2500, iterations: 1, easing: "ease-in-out" }),

        slider.animate([
          { left: (start - slider.offsetWidth/2) + "px" },
          { left: (start + delta - slider.offsetWidth/2) + "px" },
          { left: (start - slider.offsetWidth/2) + "px" }
        ], { duration: 2500, iterations: 1, easing: "ease-in-out" }),

        img.animate([
          { width: start + "px" },
          { width: (start + delta) + "px" },
          { width: start + "px" }
        ], { duration: 2500, iterations: 1, easing: "ease-in-out" })
      ];
    }

    // -------- SLIDER INTERACTIVO --------
    slider.addEventListener("mousedown", slideReady);
    window.addEventListener("mouseup", slideFinish);
    slider.addEventListener("touchstart", slideReady);
    window.addEventListener("touchend", slideFinish);

    function cancelIntroAnimation() {
      introAnimations.forEach(anim => anim.cancel()); // ⚡ cancela todas
      introAnimations = [];
    }

    function slideReady(e) {
      e.preventDefault();
      clicked = 1;
      cancelIntroAnimation(); // si hay animación en curso, la corto
      window.addEventListener("mousemove", slideMove);
      window.addEventListener("touchmove", slideMove);
    }

    function slideFinish() { clicked = 0; }

    function slideMove(e) {
      if (clicked == 0) return false;
      let pos = getCursorPos(e);
      if (pos < 0) pos = 0;
      if (pos > w) pos = w;
      slide(pos);
    }

    function getCursorPos(e) {
      let a, x = 0;
      e = (e.changedTouches) ? e.changedTouches[0] : e;
      a = img.getBoundingClientRect();
      x = e.pageX - a.left - window.pageXOffset;
      return x;
    }

    function slide(x) {
      img.style.width = x + "px";
      slider.style.left = img.offsetWidth - (slider.offsetWidth / 2) + "px";
      line.style.left = img.offsetWidth + "px";
    }
  }
}

