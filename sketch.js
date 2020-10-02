var PLAY = 1;
var END = 0;
var gameState = PLAY;

var monkey , monkey_running,monkey_collided;
var ground;
var banana ,bananaImage, obstacle, obstacleImage;
var FoodGroup, obstacleGroup;
var gameOver,gameOverImage;
var restart,restartImage;

var survivalTime = 0;

function preload(){
  
  
  monkey_running =            loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png");
  monkey_collided = loadAnimation("monkey.png");
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
 
  gameOverImage = loadImage("gameover.png");
  restartImage = loadImage("restart.png");
}



function setup() {
  createCanvas(600,600);
  
  monkey = createSprite(80,250,20,20);
  monkey.addAnimation("running",monkey_running);
  monkey.addAnimation("collided",monkey_collided);
  monkey.scale = 0.1;
  
  ground = createSprite(400,390,900,20);
  ground.velocityX = -4;
  ground.x = ground.width/2;
  ground.scale = 1.4;
  
  gameOver = createSprite(300,150);
  gameOver.addImage(gameOverImage);
  
  restart = createSprite(300,250);
  restart.addImage(restartImage);
  
  
  FoodGroup = createGroup();
  obstacleGroup = createGroup();
  
monkey.setCollider("rectangle",0,0,monkey.width,monkey.height);
  monkey.debug = true
  
}


function draw() {
background("yellow");
  
  stroke("black");
  textSize(20);
  fill("black");
  survivalTime = Math.round(getFrameRate()/80);
  text("Survival Time: "+survivalTime,250,50);
 
  
  if(gameState === PLAY){
    
    gameOver.visible = false;
    restart.visible = false;
    
  ground.velocityX = -(4 + 3* survivalTime/100);
  survivalTime = survivalTime+Math.round(getFrameRate()/60);
  
  if(ground.x < 0){
    ground.x = ground.width/2;
  }
  
  if(keyDown("space") && monkey.y >= 300){
    monkey.velocityY = -20;
  }
    
  monkey.velocityY = monkey.velocityY + 1;
  
  Food();
  obstacle();
  
    if(obstacleGroup.isTouching(monkey)) {
   gameState = END; 
      
      if(monkey.isTouching(FoodGroup)){
      FoodGroup.visible = false;
      }
   }
  }
  else if(gameState === END){
    
    monkey.changeAnimation("collided",monkey_collided);
    
    gameOver.visible = true;
      restart.visible = true;
     
    if(mousePressedOver(restart)) {
      reset();
    }
    
    ground.velocityX = 0;
    monkey.velocityY = 0;  
  
    obstacleGroup.setLifetimeEach(-1);
    FoodGroup.setLifetimeEach(-1);
     
     obstacleGroup.setVelocityXEach(0);
     FoodGroup.setVelocityXEach(0);   
  
  }
  
  monkey.collide(ground);
  
  
  drawSprites();
}

function Food(){
  if(World.frameCount % 80 === 0){
  var banana = createSprite(500,100,10,10);
    banana.y = Math.round(random(90,300));
    banana.addImage(bananaImage);
    banana.scale = 0.1;
    banana.velocityX = -3;
    
    banana.lifetime = 200;
    
    banana.depth = monkey.depth;
    monkey.depth = monkey.depth+1;
  
    FoodGroup.add(banana);
  
  }
}
  


function obstacle(){
  if(World.frameCount % 100 === 0){  
  var obstacle = createSprite(500,368,10,10);
    obstacle.addImage(obstacleImage);
  obstacle.velocityX = -(6 + survivalTime/100);
  obstacle.scale = 0.1;
  obstacle.lifetime = 100;
  
  obstacleGroup.add(obstacle);
}
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  FoodGroup.destroyEach();
  obstacleGroup.destroyEach();
  monkey.changeAnimation("running",monkey_running);
  survivalTime = 0;
}

