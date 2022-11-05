console.clear();
const $ = document.querySelector.bind(document);
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const randomColor = (s = 100, l = 50, a = 1) =>
  `hsla(${rand(0, 359)}deg, ${s}%, ${l}%, ${a})`;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

let numColumns = (innerWidth / 112) | 0;
let numRows = (innerHeight / 256) | 0;

const HAIR_STYLES = ["long", "medium", "short", "emo", "punk", "bob"];
const HAIR_COLORS = [
  "black",
  "brown",
  "pink",
  "red",
  "blonde",
  "light-blonde",
  "green",
  "blue"
];
const DRESS_STYLES = ["round", "edgy"];

const randomPerson = (i) => {
  const dress = Math.random() < 0.5 ? true : false;
  const dressStyle = dress ? pick(DRESS_STYLES) : undefined;
  const torsoColor = randomColor();
  const legColor = !dress ? randomColor() : undefined;
  const tone = rand(1, 5);
  const hairStyle = pick(HAIR_STYLES);
  const hairColor = pick(HAIR_COLORS);
  return {
    name: "person_" + i,
    dress,
    dressStyle,
    torsoColor,
    legColor,
    tone,
    hairStyle,
    hairColor
  };
};

let data = Array(numColumns * numRows * 2)
  .fill(0)
  .map((_, i) => {
    return randomPerson(i);
  });


const container = d3.select(".container");

let people = container.selectAll("svg");

const applyPeopleAttribs = (selection) =>
  selection
    .attr("viewBox", "0 0 7 16")
    .attr(
      "class",
      (d) => `person tone--${d.tone} hair--${d.hairStyle} hair--${d.hairColor}`
    )
    .classed("dress", (d) => d.dress)
    .classed("dress--round", (d) => d.dressStyle === "round")
    .classed("dress--edgy", (d) => d.dressStyle === "edgy")
    .style("--legs-color", (d) => d.legColor)
    .style("--torso-color", (d) => d.torsoColor)
    .style("opacity", '1')
    .html(`<use xlink:href="#person" />`);

applyPeopleAttribs(
  people
    .data(data, (d) => d.name)
    .enter()
    .append("svg")
);

let oldScrollY = 0;
let scrollTimer = -1;

function addPeople(numPeeps) {
  const oldLength = data.length;
  const newData = data.concat(
    Array(numPeeps)
      .fill(0)
      .map((_, i) => randomPerson(i + oldLength))
  );
  
  const t = d3.select('.container').transition().duration(750);
  
  people = container.selectAll("svg");

  people
    .data(newData, (d) => d.name)
    .join(
      (enter) =>
        applyPeopleAttribs(enter.append("svg"))
          .style("opacity", .5)
          .style("transform", "scale(.5)")
    ).transition(t).style("opacity", 1).style("transform", "scale(1)")
  data = newData;
}

window.addEventListener("resize", () => {
  numColumns = (innerWidth / 112) | 0;
  numRows = (innerHeight / 256) | 0;
  if (data.length < numColumns * numRows * 2) {
    addPeople(numColumns * numRows * 2 - data.length);
  }
});

window.addEventListener("scroll", () => {
  if (
    scrollY > oldScrollY &&
    document.body.clientHeight - innerHeight - scrollY <= 0
  ) {
    if (scrollTimer > -1) {
      clearTimeout(scrollTimer);
    }
    scrollTimer = setTimeout(() => {
      console.log("Bottom reached. Adding ", numColumns * 2);
      addPeople(numColumns * 2);
    }, 200);
  }
  oldScrollY = scrollY;
});
