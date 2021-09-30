var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var playerCount,gameState;
var car1Img,car2Img,car1,car2,trackImg,track
var allPlayers
var cars = []
var fuels,coins
var fuelImg,coinImg,obs,obstacle1Image,obstacle2Image

function preload() {
  backgroundImage = loadImage("./assets/background.png");
  car1Img = loadImage("assets/car1.png")
  car2Img = loadImage("assets/car2.png")
  trackImg = loadImage("assets/track.jpg")
  fuelImg = loadImage("assets/fuel.png")
  coinImg = loadImage("assets/goldCoin.png")
  obstacle1Image = loadImage("assets/obstacle1.png")
  obstacle2Image = loadImage("assets/obstacle2.png")

  
  
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();

}

function draw() {
  background(backgroundImage);
  if (playerCount == 2){
    game.updateState(1);
  }

  if (gameState == 1){
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
