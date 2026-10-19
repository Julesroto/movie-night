// ---------- DATA ----------
// The same three photos are reused in both cuts.
const images = {
  dvds:     { src: "dvds.jpg",     alt: "A black zippered binder of labeled DVDs lying open on a carpet" },
  receipts: { src: "receipts.jpg", alt: "A pile of crumpled paper receipts" },
  couch:    { src: "couch.jpg",    alt: "A worn brown leather couch with rumpled cushions beside a coffee table" }
};
const cuts = {
  A: {
    title: "Main Feature: the night goes right",
    summary: "Read in this order, the photos describe a night that goes right. You choose the movie, pick up snacks, and settle in. The couch is the payoff, so it feels warm.",
    frames: [
      { image: "dvds",     label: "Beginning", text: "Friday night. The binder comes out, every disc labeled, and tonight's pick takes ten minutes to decide." },
      { image: "receipts", label: "Middle",    text: "A quick snack run. The receipt gets crumpled into a pocket with all the others." },
      { image: "couch",    label: "End",       text: "Lights low, cushions rumpled, and the whole couch is waiting. Press play." }
    ]
  },
  B: {
    title: "Alternate Ending: the night falls apart",
    summary: "Reverse the order and the same photos tell a different story. The couch sits empty, the search for a movie goes nowhere, and the crumpled receipts at the end read as money spent on a night that never happened.",
    frames: [
      { image: "couch",    label: "Beginning", text: "The couch is ready, but nobody is on it yet. The night is still only an idea." },
      { image: "dvds",     label: "Middle",    text: "Page after page of discs. Nothing feels right, and half of them are scratched." },
      { image: "receipts", label: "End",       text: "The night ends with a crumpled pile of receipts: money spent on everything except the movie." }
    ]
  }
};

// ---------- STATE ----------
let currentCut = "A";
let currentIndex = 0;

// ---------- DOM REFERENCES ----------
const mainImage = document.getElementById("mainImage");
const stageLabel = document.getElementById("stageLabel");
const caption = document.getElementById("caption");
const strip = document.getElementById("strip");
const counter = document.getElementById("counter");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const cutTitle = document.getElementById("cutTitle");
const cutSummary = document.getElementById("cutSummary");
const cutButtons = { A: document.getElementById("cutA"), B: document.getElementById("cutB") };

// ---------- FUNCTIONS ----------
function buildStrip() {
  strip.innerHTML = "";
  cuts[currentCut].frames.forEach(function (frame, i) {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = "thumb";
    btn.setAttribute("aria-label", "Go to the " + frame.label.toLowerCase() + " scene");
    btn.innerHTML = '<img src="' + images[frame.image].src + '" alt=""><span>' + frame.label + "</span>";
    btn.addEventListener("click", function () { showFrame(i); });
    li.appendChild(btn);
    strip.appendChild(li);
  });
}

function showFrame(index) {
  const frames = cuts[currentCut].frames;
  currentIndex = Math.max(0, Math.min(index, frames.length - 1));
  const frame = frames[currentIndex];
  const img = images[frame.image];

  mainImage.classList.add("swap");
  setTimeout(function () {
    mainImage.src = img.src;
    mainImage.alt = img.alt;
    mainImage.classList.remove("swap");
  }, 150);

  stageLabel.textContent = frame.label;
  caption.textContent = frame.text;
  counter.textContent = "Scene " + (currentIndex + 1) + " of " + frames.length;
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === frames.length - 1;

  strip.querySelectorAll(".thumb").forEach(function (t, i) {
    t.classList.toggle("active", i === currentIndex);
  });
}

function switchCut(name) {
  currentCut = name;
  Object.keys(cutButtons).forEach(function (k) {
    cutButtons[k].setAttribute("aria-pressed", k === name ? "true" : "false");
  });
  cutTitle.textContent = cuts[name].title;
  cutSummary.textContent = cuts[name].summary;
  buildStrip();
  showFrame(0);
}

function nextFrame() {
  const last = cuts[currentCut].frames.length - 1;
  showFrame(currentIndex < last ? currentIndex + 1 : 0); // clicking the picture loops back to the start
}

// ---------- EVENT LISTENERS ----------
cutButtons.A.addEventListener("click", function () { switchCut("A"); });
cutButtons.B.addEventListener("click", function () { switchCut("B"); });
prevBtn.addEventListener("click", function () { showFrame(currentIndex - 1); });
nextBtn.addEventListener("click", function () { showFrame(currentIndex + 1); });
mainImage.addEventListener("click", nextFrame);
mainImage.addEventListener("keydown", function (e) {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); nextFrame(); }
});
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowRight") showFrame(currentIndex + 1);
  if (e.key === "ArrowLeft") showFrame(currentIndex - 1);
});

// ---------- START ----------
switchCut("A");
