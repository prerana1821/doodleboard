var angle = 0;

function galleryspin(sign) {
  spinner = document.querySelector("#spinner");
  if (!sign) {
    angle = angle + 45;
  } else {
    angle = angle - 45;
  }
  spinner.setAttribute(
    "style",
    "-webkit-transform: rotateY(" +
      angle +
      "deg); -moz-transform: rotateY(" +
      angle +
      "deg); transform: rotateY(" +
      angle +
      "deg);"
  );
}

const trans = (x, y, s) =>
  `perspective(400px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

const calc = (x, y) => {
  const newX = x - window.innerWidth / 2;
  const newY = y - window.innerHeight / 2;
  const scaleX = 1.1;
  const scaleY = 1.1;
  const rotateX = newY / 100;
  const rotateY = newX / 100;

  return [rotateX, rotateY, scaleX, scaleY];
};

const props = { xys: [0, 0, 1] };

document.addEventListener("DOMContentLoaded", function () {
  const animatedDiv = document.getElementById("animatedDiv");

  animatedDiv.addEventListener("mousemove", function (event) {
    const { clientX: x, clientY: y } = event;

    const rotateValues = calc(x, y);
    animatedDiv.style.transform = trans(...rotateValues);
  });

  animatedDiv.addEventListener("mouseleave", function () {
    animatedDiv.style.transform = trans(0, 0, 1);
  });
});
