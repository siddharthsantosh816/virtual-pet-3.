const Engine= Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;

//Create variables here
var dog,happyDog;
var FoodS, lastFed,fedTime,FeedD;
var database;
var foodObj,addFood,feed;
var dogName;
var button;
var gameState=0;
var currentTime;
var readState;
var dogImg, dogImg1, bedRoomImg, gardenImg, washRoomImg,sadDogImg;
function preload(){
	dogImg=loadImage('images/dogImg.png');
  dogImg1=loadImage('images/dogImg1.png');
  bedroomImg=loadImage('images/Bed Room.png');
  gardenImg=loadImage('images/Garden.png');
  washroomImg=loadImage('images/Wash Room.png');
  livroomImg=loadImage('images/Living Room.png');
  lazyDogImg = loadImage('images/LazyDog.png');
}

function setup(){
	createCanvas(700, 500);
  engine = Engine.create();
	world = engine.world;
    
  database=firebase.database();
  var foodStockRef=database.ref('Food');
  foodStockRef.on("value",readStock);
 
  var FeedTimeRef=database.ref('FeedTime');
  FeedTimeRef.on("value",readFeedTime);

  readState= database.ref('gameState');
  readState.on("value", function(data){
     gameState= data.val();
  });
  
  dog=createSprite(550,250,50,50);
 // dog.addImage(dogImg);
  dog.scale=0.2;  
  foodObj = new Food();
  var dogN= database.ref('Name');
  dogN.on("value", function(data) {
    dogName = data.val();
  });

   if (dogName === "undefined") {
      input = createInput("");
      input.position(820, 400);

      button = createButton("Press this Button after Giving the Name");
      button.position(780, 450);  
      // console.log(input.value());
      
      button.mousePressed(()=> {
        input.hide();
        button.hide();
        dogName =input.value();
        database.ref('/').update({
          Name:dogName
        })    
    });
   }

  feed = createButton("Feed the Dog");
  feed.position(500,60);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,60);
  addFood.mousePressed(addFoods);
  
  Engine.run(engine);
}

function draw() {  
  background(46,139,87);
  currentTime=hour();
  var currentD = new Date()
  drawSprites();

  //add styles here
  fill("white");
  textSize(20);
  if(fedTime > 12) {
    text("Last Fed Time: " + fedTime%12 + " PM", 250,100);
  } else if (fedTime === 0) {
    text("Last Fed Time: 12 AM", 300,100);
  } else {
    text("Last Fed Time: " + fedTime + " AM", 250,100);
  }
  text(dogName,520,350)

  if (FoodS === 30) {
    textSize(15);
    text("Not enough Storage Space to add more Milk", 40,400);
  }
 
    feed.hide();
    addFood.hide();
  
  if(gameState === "Happy"){
     foodObj.livingroom();
    // dog.addImage(dogImg1);
  } else if (gameState === "Hungry"){
    feed.show();
    addFood.show();
    dog.addImage(dogImg);
    foodObj.display();
  }
  
  if(currentTime < fedTime) {
    currentTime = currentTime+24;
  }
	
  if(currentTime===fedTime+1){
     foodObj.garden();
     updateStatus("Playing");
  }
  else if(currentTime===fedTime+2){
    foodObj.bedroom();
    updateStatus("Sleeping");
  }
  else if(currentTime===fedTime+3||currentTime===fedTime+4){
    foodObj.washroom();
    updateStatus("Bathing");
  }
  else if ((currentTime-fedTime) > 4){
    updateStatus("Hungry");
    foodObj.display();
  }
 }

function readStock(data){
  FoodS=data.val();
  foodObj.getFoodStock(FoodS);
}

function readFeedTime(data){
  fedTime=data.val();
  foodObj.getLastFedTime(fedTime);
}

function feedDog(){
  
    dog.addImage(dogImg1);
    FeedD: new Date();
    database.ref('/').update({
    Food:foodObj.deductFoodStock(),
    FeedTime:hour(),
    gameState: "Happy"
  })
}

function addFoods(){    
  //dog.addImage(dogImg);
  database.ref('/').update({ 
  Food:foodObj.updateFoodStock()
  })
}

function updateStatus(status){
  database.ref('/').update({
    gameState:status
  })
}
