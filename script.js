const JEDA = 500;              
const TETESAN = [
  [0, 9, 26],   [16, 8, 14],  [27, 12, 45], [44, 9, 22],
  [56, 11, 35], [73, 8, 16],  [84, 13, 40], [101, 9, 24],
  [114, 11, 32], [128, 8, 18], [140, 11, 28]
];

const slices    = document.querySelectorAll('.slice');   
const cream     = document.getElementById('cream');
const candle    = document.querySelector('.candle');
const greeting  = document.querySelector('.greeting');
const replayBtn = document.getElementById('replay');
const cakeCard  = document.querySelector('.cake-card');

TETESAN.forEach(([x, w, h], i) => {
  const d = document.createElement('div');
  d.className = 'drip';
  d.style.left   = `calc(var(--u) * ${x})`;
  d.style.width  = `calc(var(--u) * ${w})`;
  d.style.height = `calc(var(--u) * ${h})`;
  d.style.setProperty('--r', `calc(var(--u) * ${w / 2})`);
  d.style.setProperty('--d', (i % 4) * 0.15 + 's');
  cream.appendChild(d);
});

let timers = [];
let isBlownOut = false;

function resetCake() {
  timers.forEach(clearTimeout);
  timers = [];
  isBlownOut = false;
  slices.forEach(s => s.classList.remove('drop'));
  cream.classList.remove('drop', 'melt');
  candle.classList.remove('show', 'lit');
  
  // Reset teks & tampilan ucapan
  greeting.classList.remove('show', 'show-hint');
  greeting.innerText = 'click the candle, honey';
  
  if (cakeCard) cakeCard.classList.remove('expand');
  
  document.getElementById('cardSection').style.display = 'none';
  document.getElementById('cakeScene').style.display = 'flex';
  
  void document.body.offsetWidth;
}

function after(ms, fn) { timers.push(setTimeout(fn, ms)); }

function playCake() {
  resetCake();
  let t = 300;

  slices.forEach(s => {
    after(t, () => s.classList.add('drop'));
    t += JEDA;
  });

  after(t, () => cream.classList.add('drop'));
  t += 900;
  after(t, () => cream.classList.add('melt'));
  t += 1800;

  after(t, () => candle.classList.add('show'));
  t += 700;
  after(t, () => {
    candle.classList.add('lit');
    // MUNCULKAN TULISAN "klik lilinnya sayang" SAAT LILIN MENYALA
    greeting.classList.add('show-hint');
    isBlownOut = false;
  });
}

// KETIKA LILIN DIKLIK / DITIUP
candle.addEventListener('click', () => {
  if (candle.classList.contains('lit') && !isBlownOut) {
    isBlownOut = true;
    candle.classList.remove('lit');
    
    // Hilangkan tulisan "klik lilinnya sayang"
    greeting.classList.remove('show-hint');
    
    // Melebarkan background kotak
    if (cakeCard) cakeCard.classList.add('expand');

    // Ganti teks menjadi "happy birthday!" lalu tampilkan beserta tombolnya
    setTimeout(() => {
      greeting.innerText = 'HAPPY BIRTHDAY SAYANGG';
      greeting.classList.add('show');
    }, 400);
  }
});

replayBtn.addEventListener('click', playCake);
window.addEventListener('load', () => {
  playCake();
  initHeartCanvas(); // Menjalankan animasi hati sejak awal di halaman kue
});


function tampilkanKartuUcapan() {
  document.getElementById('cakeScene').style.display = 'none';
  document.getElementById('cardSection').style.display = 'flex';
  
  // Panggil kembali agar canvas menyesuaikan ukuran layar saat kartu muncul
  initHeartCanvas();
}

let currentSlide = 1;
const slides = document.querySelectorAll('.slide');

function animateSlides(oldIndex, newIndex) {
  const oldSlide = slides[oldIndex - 1];
  const newSlide = slides[newIndex - 1];
  slides.forEach(s => s.classList.remove("slide-in-right", "slide-out-left", "slide-in-left", "slide-out-right", "active"));
  
  if (newIndex > oldIndex) { 
    oldSlide.classList.add("slide-out-left");
    newSlide.classList.add("slide-in-right");
  } else {
    oldSlide.classList.add("slide-out-right");
    newSlide.classList.add("slide-in-left");
  }
  newSlide.classList.add("active");
  currentSlide = newIndex;
}

function checkPin() {
  const inputs = document.querySelectorAll('#slide1 input');
  const pin = [...inputs].map(i => i.value).join('');
  if (pin === "0910") {
    animateSlides(1, 2);
    document.getElementById('errorMsg').innerText = "";
  } else {
    document.getElementById('errorMsg').innerText = "PIN salah, coba lagi!";
    inputs.forEach(i => i.value = "");
  }
}

function nextSlide() { if (currentSlide < 6) animateSlides(currentSlide, currentSlide + 1); }
function prevSlide() { if (currentSlide > 2) animateSlides(currentSlide, currentSlide - 1); }

function pressNum(num) {
  const inputs = document.querySelectorAll('#slide1 input');
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value === "") { inputs[i].value = num; break; }
  }
}

function deleteNum() {
  const inputs = document.querySelectorAll('#slide1 input');
  for (let i = inputs.length - 1; i >= 0; i--) {
    if (inputs[i].value !== "") { inputs[i].value = ""; break; }
  }
}

function initHeartCanvas() {
  const canvas = document.getElementById("canvas"); 
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth; 
  canvas.height = window.innerHeight;

  class Heart {
    constructor() {
      this.x = Math.random() * canvas.width; 
      this.y = canvas.height + Math.random() * 100; 
      this.size = 10 + Math.random() * 20; 
      this.speed = 0.5 + Math.random() * 1.5; 
      this.alpha = 0.5 + Math.random() * 0.5; 
      this.color = "rgba(255,0,100," + this.alpha + ")";
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(0, -this.size / 2);
      ctx.bezierCurveTo(this.size / 2, -this.size, this.size, -this.size / 4, 0, this.size);
      ctx.bezierCurveTo(-this.size, -this.size / 4, -this.size / 2, -this.size, 0, -this.size / 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    update() {
      this.y -= this.speed;
      if (this.y < -50) {
        this.y = canvas.height + 50;
        this.x = Math.random() * canvas.width;
      }
      this.draw();
    }
  }

  let hearts = []; 
  for (let i = 0; i < 40; i++) { hearts.push(new Heart()); }

  function animateHearts() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach(h => h.update()); 
    requestAnimationFrame(animateHearts);
  }
  animateHearts();
  
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight;
  });
}