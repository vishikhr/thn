var dog,happyDog,sadDog
var dogImg, happyDogImg,sadDogImg;
var database;
var foodS,foodStock;
var lastFed;
var foodObj;
var fedTime;
var addFood;
var feed
var gameState;
var changingGameState;
var readState;
var bedroom, bedroomImg;
var garden, gardenImg;
var washroom, washroomImg;
var background, backgroundImg;



function preload(){
   dogImg=loadImage("dog.png");
   happyDogImg=loadImage("happyDog.png");
   sadDogImg = loadImage("deadDog.png");
   bedroomImg = loadImage("Lazy.png");
   gardenImg = loadImage("Garden.png");
   washroomImg = loadImage("Wash Room.png");
   backgroundImg = loadImage("Bed Room.png");

    }

//Function to set initial environment
function setup() {
  createCanvas(500,500);
  
  database=firebase.database();

  dog=createSprite(250,300,150,150);
  dog.addImage(dogImg);
  dog.scale=0.15;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  foodObj = new Food(); 

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState=data.val();
  });


  feed=createButton("Feed the dog");
  feed.position(500,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(600,95);
  addFood.mousePressed(addFoods);

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed=data.val();
  });
}

// function to display UI
function draw() {
  background(backgroundImg);
  fill("blue")
  textFont("Bold")
  textSize(21);




  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();

  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();

  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();

  }else{
    update("Hungry")
    foodObj.display();
  }
  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();

  }else{
    feed.show();
    addFood.show();
    dog.addImage("deadDog.png",sadDogImg);
  }


  //foodObj.display();
 
  

  drawSprites();
  fill("red");
  stroke("black");
  text("Food remaining : "+foodS,170,420);
  textSize(19);
  text("Note: Press the Buttons ",130,10,220,20);
}

//Function to read values from DB
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

//Function to write values in DB
//function writeStock(x){
  //if(x<=0){
   /// x=0;
 // }else{
    //x=x-1;
  //} 
  //database.ref('/').update({
    //Food:x
  //})
//}
function feedDog(){
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}