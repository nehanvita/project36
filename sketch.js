var dog,sadDog,happyDog;
var database;
var fedTime,lastFed;
var feed,addFood;
var foodS,foodStock;
var foodObj;

function preload(){
   sadDog=loadImage("images/Dog.png");
   happyDog=loadImage("images/happydog.png");
  }

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  
  //textSize(20); 
}

function draw() {
  background(46,139,87);
  foodObj.display();

  fedTime=database.ref('feedTime')
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

 fill(255,255,254);
 textSize(15);
 if(lastFed>=12){
   text("Last Feed : "+lastFed%12+" PM",350,30);
 }else if(lastFed==0){
   text("Last Feed : "+ lastFed + " AM",350,30);
 }
  
  drawSprites();
}

//Function to read values from DB
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//Function to write values in DB
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}