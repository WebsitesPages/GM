const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const mouse = { x: null, y: null, radius: 100 };
const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff0000'];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Anpassung bei Fenstergröße
window.addEventListener('resize', function(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

// Mausposition verfolgen
window.addEventListener('mousemove', function(event){
  mouse.x = event.x;
  mouse.y = event.y;
});

// Partikel-Klasse
function Particle(x, y){
  this.x = Math.random() * canvas.width; // Startposition zufällig im Canvas
  this.y = 0 - Math.random() * 100; // Startet oberhalb des Canvas
  this.size = 1.5;
  this.baseX = x;
  this.baseY = y;
  this.density = Math.random() * 15 + 10;
  this.color = colors[Math.floor(Math.random() * colors.length)];
}

Particle.prototype.draw = function(){
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

Particle.prototype.update = function(){
  // Anfangsanimation: Bewegung zur Basisposition
  let dxToBase = this.baseX - this.x;
  let dyToBase = this.baseY - this.y;
  let distanceToBase = Math.sqrt(dxToBase * dxToBase + dyToBase * dyToBase);

  // Geschwindigkeit der Anfangsanimation (verlangsamt)
  let force = distanceToBase / (this.density * 20); // Dividiert durch höheren Wert für langsameres Tempo
  let dirX = dxToBase / distanceToBase * force;
  let dirY = dyToBase / distanceToBase * force;

  if (distanceToBase > 0.5) {
    this.x += dirX;
    this.y += dirY;
  } else {
    this.x = this.baseX;
    this.y = this.baseY;
  }

  // Mausinteraktion
  let dx = mouse.x - this.x;
  let dy = mouse.y - this.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  let maxDistance = mouse.radius;
  let forceDirectionX = dx / distance;
  let forceDirectionY = dy / distance;

  if (distance < mouse.radius) {
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;

    this.x -= directionX;
    this.y -= directionY;
  } else {
    // Zurück zur Basisposition
    if (this.x !== this.baseX) {
      let dx = this.x - this.baseX;
      this.x -= dx / 20; // Verlangsamt die Rückkehrgeschwindigkeit
    }
    if (this.y !== this.baseY) {
      let dy = this.y - this.baseY;
      this.y -= dy / 20; // Verlangsamt die Rückkehrgeschwindigkeit
    }
  }

  this.draw();
}

// Initialisierung
function init(){
  particles = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Text zeichnen
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 150px Arial';
  ctx.fillStyle = 'white';

  // Position des oberen Textes
  const textX = canvas.width / 2;
  const textY = canvas.height / 2 - 80;
  ctx.fillText("GM G's", textX, textY);

  // Position des unteren Textes
  ctx.font = 'bold 50px Arial';
  ctx.fillText('Rise and Shine!', textX, textY + 100);

  const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Partikel erstellen
  for (let y = 0; y < canvas.height; y += 4) {
    for (let x = 0; x < canvas.width; x += 4) {
      if (textCoordinates.data[(y * 4 * canvas.width) + (x * 4) + 3] > 128) {
        particles.push(new Particle(x, y));
      }
    }
  }
}

function animate(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(let i = 0; i < particles.length; i++){
    particles[i].update();
  }
  requestAnimationFrame(animate);
}

init();
animate();