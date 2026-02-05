   /* ===== JOURNEY SLIDER WITH AUTO SLIDE ===== */

const slides = document.querySelectorAll(".slide");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let currentSlide = 0;
let autoSlideInterval;

/* Show Slide */
function showSlide(index){
  slides.forEach(slide => slide.classList.remove("active"));
  slides[index].classList.add("active");
}

/* Next */
function nextSlide(){
  currentSlide++;
  if(currentSlide >= slides.length) currentSlide = 0;
  showSlide(currentSlide);
}

/* Prev */
function prevSlide(){
  currentSlide--;
  if(currentSlide < 0) currentSlide = slides.length - 1;
  showSlide(currentSlide);
}

/* Button controls */
nextBtn.addEventListener("click", () => {
  nextSlide();
  resetAutoSlide();
});

prevBtn.addEventListener("click", () => {
  prevSlide();
  resetAutoSlide();
});

/* ===== AUTO SLIDE ===== */

function startAutoSlide(){
  autoSlideInterval = setInterval(nextSlide, 2000); // 3 seconds
}

function resetAutoSlide(){
  clearInterval(autoSlideInterval);
  startAutoSlide();
}



/* Init */
showSlide(currentSlide);
startAutoSlide();

    
  function enterSite(){
    document.getElementById("gate").style.display="none";
    document.body.style.overflow="auto";}
    
  /* ================= SALES COUNTER ANIMATION ================= */

  const counter = document.querySelector(".sale-counter");
  const valueEl = document.getElementById("saleValue");
  const finalText = document.getElementById("finalText");

  let startedCounter = false;

  function animateCounter() {
    const target = +counter.dataset.target;
    let current = 0;
    const speed = 50;

    function update() {
      const increment = Math.ceil(target / speed);
      current += increment;

      if (current >= target) {
        valueEl.textContent = target.toLocaleString();
        // Show the final text with fade/slide
        finalText.classList.add("visible");
      } else {
        valueEl.textContent = current.toLocaleString();
        requestAnimationFrame(update);
      }
    }

    update();
  }

  /* Trigger animation when visible */
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !startedCounter) {
      startedCounter = true;
      animateCounter();
    }
  }, { threshold: 0.6 });

  observer.observe(counter);


  /* ================= FLAPPY MOMO GAME ================= */

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  if (canvas) {

    canvas.width = 400;
    canvas.height = 600;
    ctx.font = "20px Arial";

    /* IMAGES */
    const momoImg = new Image();
    momoImg.src = "momoflap1.png";

    /* SOUNDS */
    const jumpSound = new Audio("jump.mp3");
    const scoreSound = new Audio("");
    const gameOverSound = new Audio("mariogameover.mp3");

    jumpSound.volume = 0.5;
    scoreSound.volume = 0.5;
    gameOverSound.volume = 1.0;

    let momo, pipes, score, gravity, gameOver, started;
    let lastPipeTime = 0;
    const pipeGapTime = 1500;

    /* RESET */
    function resetGame() {
      momo = {
        x: 80,
        y: canvas.height / 2,
        r: 18,
        vel: 0
      };

      gravity = 0.5;
      pipes = [];
      score = 0;
      gameOver = false;
      started = false;
      lastPipeTime = 0;
    }

    /* PIPE */
    function addPipe() {
      const gap = 160;
      const top = Math.random() * 200 + 50;

      pipes.push({
        x: canvas.width,
        top,
        bottom: canvas.height - (top + gap),
        passed: false
      });
    }

    /* GAME LOOP */
    function draw(timestamp) {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (started && !gameOver) {
        if (timestamp - lastPipeTime > pipeGapTime) {
          addPipe();
          lastPipeTime = timestamp;
        }
      }

      /* MOMO */
      ctx.drawImage(momoImg, momo.x - 22, momo.y - 22, 44, 44);

      /* PIPES */
      ctx.fillStyle = "#ffa500";
      pipes.forEach(p => {
        ctx.fillRect(p.x, 0, 50, p.top);
        ctx.fillRect(p.x, canvas.height - p.bottom, 50, p.bottom);
        p.x -= 2;

        if (!p.passed && p.x + 50 < momo.x) {
          score++;
          p.passed = true;
          scoreSound.currentTime = 0;
          scoreSound.play();
        }

        if (
          momo.x + momo.r > p.x &&
          momo.x - momo.r < p.x + 50 &&
          (momo.y - momo.r < p.top ||
            momo.y + momo.r > canvas.height - p.bottom)
        ) {
          endGame();
        }
      });

      pipes = pipes.filter(p => p.x + 50 > 0);

      /* PHYSICS */
      if (started && !gameOver) {
        momo.vel += gravity;
        momo.y += momo.vel;
      }

      if (momo.y < 0 || momo.y > canvas.height) {
        endGame();
      }

      /* UI */
      ctx.fillStyle = "#fff";
      ctx.fillText("Score: " + score, 20, 30);

      if (!started && !gameOver) {
        ctx.fillStyle = "#ffa500";
        ctx.fillText("Press SPACE to Start", 90, 300);
      }

      if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffa500";
        ctx.font = "28px Arial";
        ctx.fillText("GAME OVER", 105, 260);
        ctx.font = "18px Arial";
        ctx.fillText("Press SPACE to Restart", 80, 300);
        ctx.font = "20px Arial";
      }

      requestAnimationFrame(draw);
    }

    /* END GAME */
    function endGame() {
      if (!gameOver) {
        gameOver = true;
        gameOverSound.play();
      }
    }

    /* CONTROLS */
    document.addEventListener("keydown", e => {
      if (e.code === "Space") {
        e.preventDefault();

        if (!started) started = true;

        if (gameOver) {
          resetGame();
          return;
        }

        momo.vel = -9;
        jumpSound.currentTime = 0;
        jumpSound.play();
      }
    });

    /* INIT */
    resetGame();
    momoImg.onload = () => {
      requestAnimationFrame(draw);
    };
  }
  /* ===== JOURNEY CARD SCROLL EFFECT ===== */

  const journeyCards = document.querySelectorAll(".journey-card");

  const journeyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("show");
      }
    });
  },{ threshold:0.3 });

  journeyCards.forEach(card => journeyObserver.observe(card));
