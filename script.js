const $ = s => document.querySelector(s);
const loader = $("#loader");
const intro = $("#intro");
const site = $("#site");
const audio = $("#audio");
const musicBtn = $("#musicBtn");
const autoScrollBtn = $("#autoScrollBtn");
const finalBtn = $("#finalBtn");
const revealModal = $("#revealModal");

const questionCard = $("#questionCard");
const noCard = $("#noCard");
const yesBtn = $("#yesBtn");
const noBtn = $("#noBtn");
const backBtn = $("#backBtn");

let autoScrollInterval = null;
let isAutoScrolling = false;

// Hide loader on window load
window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("loaded"), 450);
});

function startMusic() {
  audio.volume = 0.30;
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {});
  }
  musicBtn.classList.add("playing");
  musicBtn.setAttribute("aria-label", "Pause music");
}

// Auto-Scroll Logic
function stopAutoScroll() {
  if (isAutoScrolling) {
    clearInterval(autoScrollInterval);
    isAutoScrolling = false;
    autoScrollBtn.classList.remove("active");
  }
}

function startAutoScroll() {
  stopAutoScroll();
  isAutoScrolling = true;
  autoScrollBtn.classList.add("active");

  autoScrollInterval = setInterval(() => {
    window.scrollBy({ top: 1, behavior: "smooth" });

    // Stop auto scrolling when reaching page bottom
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5) {
      stopAutoScroll();
    }
  }, 20);
}

autoScrollBtn.addEventListener("click", () => {
  if (isAutoScrolling) {
    stopAutoScroll();
  } else {
    startAutoScroll();
  }
});

// Pause auto scroll when user manually interacts
window.addEventListener("wheel", stopAutoScroll, { passive: true });
window.addEventListener("touchmove", stopAutoScroll, { passive: true });

// Direct Flow: Clicking YES opens main site directly
yesBtn.addEventListener("click", () => {
  intro.classList.add("closing");
  setTimeout(() => {
    intro.style.display = "none";
    site.hidden = false;
    site.classList.add("visible");
    document.body.classList.add("inside");
    startMusic();
    window.scrollTo(0, 0);
  }, 650);
});

noBtn.addEventListener("click", () => {
  questionCard.hidden = true;
  noCard.hidden = false;
  noCard.animate(
    [{ opacity: 0, transform: "translateY(18px) scale(.98)" }, { opacity: 1, transform: "none" }],
    { duration: 450, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" }
  );
});

backBtn.addEventListener("click", () => {
  noCard.hidden = true;
  questionCard.hidden = false;
  questionCard.animate(
    [{ opacity: 0, transform: "translateY(18px) scale(.98)" }, { opacity: 1, transform: "none" }],
    { duration: 400, easing: "ease-out", fill: "forwards" }
  );
});

musicBtn.addEventListener("click", () => {
  if (audio.paused) {
    startMusic();
  } else {
    audio.pause();
    musicBtn.classList.remove("playing");
    musicBtn.setAttribute("aria-label", "Play music");
  }
});

finalBtn.addEventListener("click", () => {
  stopAutoScroll();
  revealModal.classList.add("show");
  revealModal.setAttribute("aria-hidden", "false");
  
  // Play video explicitly if required
  const video = revealModal.querySelector("video");
  if (video) {
    video.play().catch(() => {});
  }

  for (let i = 0; i < 16; i++) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.textContent = i % 2 ? "✦" : "♥";
    particle.style.left = (10 + Math.random() * 80) + "%";
    particle.style.top = (20 + Math.random() * 60) + "%";
    particle.style.setProperty("--dx", (Math.random() * 140 - 70) + "px");
    particle.style.setProperty("--dy", (Math.random() * 180 - 90) + "px");
    revealModal.appendChild(particle);
    setTimeout(() => particle.remove(), 2200);
  }
});

// Intersection Observer for scroll animation triggers
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("seen");
  });
}, { threshold: 0.13 });

document.querySelectorAll(".scene").forEach(s => io.observe(s));