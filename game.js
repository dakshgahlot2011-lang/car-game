const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Road configuration
const road = { width: 300, x: canvas.width/2 - 150, laneCount:3, color:'#555' };
const laneWidth = road.width / road.laneCount;

// Car object
let car = { width:50, height:100, x:canvas.width/2-25, y:canvas.height-150, speed:10, color:'#ff4b33ff' };
let carspeed = 10;

// Obstacles(othercars)
let obstacles = [];
let obstacleSpeed = 10;
let spawnRate = 90;
let score = 0;
let frame = 0;

// Controls
let keys = { left:false, right:false };

// Game state
let running = false;

// Buttons
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

// Keyboard
window.addEventListener('keydown', e => { if(e.key==='ArrowLeft'||e.key==='a') keys.left=true; if(e.key==='ArrowRight'||e.key==='d') keys.right=true; });
window.addEventListener('keyup', e => { if(e.key==='ArrowLeft'||e.key==='a') keys.left=false; if(e.key==='ArrowRight'||e.key==='d') keys.right=false; });

// Mobile
document.getElementById('left').addEventListener('pointerdown', ()=> keys.left=true);
document.getElementById('left').addEventListener('pointerup', ()=> keys.left=false);
document.getElementById('right').addEventListener('pointerdown', ()=> keys.right=true);
document.getElementById('right').addEventListener('pointerup', ()=> keys.right=false);

// Resize canvas
window.addEventListener('resize', ()=>{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  road.x = canvas.width/2 - road.width/2;
});

// Spawn obstacles
function spawnObstacle(){
  const lane = Math.floor(Math.random() * road.laneCount);
  const x = road.x + lane*laneWidth + laneWidth/2 - 25;
  obstacles.push({x:x, y:-100, width:50, height:50, color:'#33ff33'});
}

// Draw road
function drawRoad(){
  ctx.fillStyle = road.color;
  ctx.fillRect(road.x,0,road.width,canvas.height);

  // Lane markings
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  for(let i=1;i<road.laneCount;i++){
    ctx.setLineDash([20,20]);
    ctx.beginPath();
    ctx.moveTo(road.x + i*laneWidth,0);
    ctx.lineTo(road.x + i*laneWidth,canvas.height);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

// Draw car
function drawCar(){
  ctx.fillStyle = car.color;
  ctx.fillRect(car.x, car.y, car.width, car.height);

  // wheels
  ctx.fillStyle = '#111';
  ctx.fillRect(car.x+5, car.y+5, 10,20);
  ctx.fillRect(car.x+car.width-15, car.y+5, 10,20);
  ctx.fillRect(car.x+5, car.y+car.height-25, 10,20);
  ctx.fillRect(car.x+car.width-15, car.y+car.height-25, 10,20);

  // headlights
  ctx.fillStyle = '#fffa';
  ctx.fillRect(car.x+5, car.y-5, 10,5);
  ctx.fillRect(car.x+car.width-15, car.y-5, 10,5);
}

// Update game
function update(){
  if(!running) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  drawRoad();

  // Move car
  if(keys.left) car.x -= car.speed;
  if(keys.right) car.x += car.speed;
  if(car.x < road.x) car.x += carspeed;

  // Keep inside road
  if(car.x < road.x) car.x = road.x;
  if(car.x + car.width > road.x + road.width) car.x = road.x + road.width - car.width;

  drawCar();

  // Spawn obstacles
  if(frame % spawnRate === 0) spawnObstacle();

  // Move obstacles
  for(let i=obstacles.length-1;i>=0;i--){
    let ob = obstacles[i];
    ob.y += obstacleSpeed;
    ctx.fillStyle = ob.color;
    ctx.fillRect(ob.x, ob.y, ob.width, ob.height);

    // Collision
    if(car.x < ob.x + ob.width && car.x + car.width > ob.x && car.y < ob.y + ob.height && car.y + car.height > ob.y){
      running = false;
      restartBtn.style.display = 'block';
      return;
    }

    if(ob.y > canvas.height) obstacles.splice(i,1);
  }

  // Score
  score++;
  ctx.fillStyle = '#fff';
  ctx.font = '24px Arial';
  ctx.fillText('Score: '+score, 20,40);

  frame++;
  requestAnimationFrame(update);
}

// Start game
startBtn.addEventListener('click', ()=>{
  startBtn.style.display = 'none';
  restartBtn.style.display = 'none';
  resetGame();
  running = true;
  update();
});

// Restart game
restartBtn.addEventListener('click', ()=>{
  restartBtn.style.display = 'none';
  resetGame();
  running = true;
  update();
});

// Reset game
function resetGame(){
  car.x = canvas.width/2 - car.width/2;
  car.y = canvas.height - 150;
  obstacles = [];
  score = 0;
  frame = 0;
}
