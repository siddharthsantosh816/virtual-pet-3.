class Food{
    constructor(){
       var options= {
            density:1,
            isStatic:true
        }
        
        this.foodStock = null;
        this.lastFed = null;
        this.imgChange = 0;
        this.image=loadImage('images/Milk.png')
        this.image1=loadImage('images/Milk1.png')
    }
    getFoodStock(foodStock){
        this.foodStock=foodStock;
    }

    getLastFedTime(fedtime){
        this.lastFed=fedtime;
    }
    
    updateFoodStock(){ 
        if(this.foodStock < 30) {
            this.foodStock=this.foodStock+1;
            this.imgChange = 0;
            return this.foodStock;
        }
    }

    deductFoodStock(){
        if(this.foodStock > 0) {
            this.foodStock = this.foodStock-1;
            this.imgChange = 1;
            return this.foodStock;
        }
    }

    bedroom(){
       background(bedroomImg);
    };

    garden(){
        background(gardenImg);
    };

    washroom(){
        background(washroomImg);
    };

    livingroom() {
        background(livroomImg);
    };

    display() {
        var x=20, y = 120;
        imageMode(CENTER);
        if (this.imgChange === 1) {
            image(this.image1,470,280,70,70);
        }
        
       for(var i=0;i<this.foodStock;i++){
           if(i%10 === 0){
                y=y+70;
                x=20;
           }      
         
           image(this.image,x=x+30,y,70,70);
       }
        
    }
}

