// Bring in the data object from the data.js file
const data = window.data;

// References
const producersContainer = document.getElementById('car-producers');


const carIcon = document.getElementById('car-icon');
carIcon.addEventListener('click', () => {
  car.clickCar();
});

class Product {
  constructor(_product){                    
    this.count = _product.count;            // car count
    this.totalUPPUT = _product.totalUPPUT;  // total units produced per unit time
  }
  getCount() { return this.count; }
  getTotalUPPUT() { return this.totalUPPUT; }

  updateDisplayedCount(){
    const productCounter = document.getElementById('counter');
    productCounter.innerText = this.count;
  }
  
  updateDisplayedTotalUPPUT(){
    const cpsDiv = document.getElementById(`${this.name}-UPPUT`);
    cpsDiv.innerText = this.totalUPPUT;
  }

  clickCar(){
    this.count += 1;
    this.updateDisplayedCount();
  }
  deductCost(cost){
    this.count -= cost; 
  }

  updateDisplayedTotalUPPUT(){
    const upputDiv = document.getElementById('UPPUT');
    upputDiv.innerText = this.totalUPPUT;
  }

  increaseThroughput(increase){
    this.totalUPPUT += increase;
    this.updateDisplayedTotalUPPUT();
  }
}

class Producer { 
  constructor(_producer){
    this.id = _producer.id;
    this.price = _producer.price;
    this.unlocked = _producer.unlocked;
    this.cps = _producer.cps;
    this.qty = _producer.qty;
  }

  setUnlocked(count){
    if(count >= this.price / 2){
      this.unlocked = true;
    }
  }

  makeDisplayNameFromId() {
    return this.id.split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  makeProducerDiv() {
    if(this.unlocked){
      const containerDiv = document.createElement("div");
      containerDiv.className = "producer";
      const html = `
        <div class="producer-column">
          <div class="producer-title">${this.makeDisplayNameFromId()}</div>
        </div>
        <div class="producer-column">
          <div>Quantity: ${this.qty}</div>
          <div>Unit/second: ${this.cps}</div>
          <div>Cost: ${this.price} Unit</div>
        </div>
      `;
      containerDiv.innerHTML = html;

      const btn = document.createElement('button');
      btn.type = "button";
      btn.innerHTML = "Buy";
      btn.id = `buy_${this.id}`;
      btn.addEventListener('click', (event) => {buyButton_Click(event);});

      containerDiv.append(btn);
      return containerDiv;
    }
    return '';    
  }
  attemptToBuyProducer(count){
    if(this.price <= count){
      car.deductCost(this.price);
      this.qty += 1;
      this.price = Math.floor(this.price * 1.25);
      car.increaseThroughput(this.cps);
    }
    else{
      window.alert("Not enough produced units!");      
    } 

}
}

///////
const car = new Product(data);

const carProducers = data.producers.map(producer => {
  return new Producer(producer);
});

//////////

function render(){  
    const producers = carProducers.map(producer => {
      producer.setUnlocked(car.getCount());
      return producer.makeProducerDiv();
    }); 
    producersContainer.replaceChildren(...producers);
  }

  ///  
  function buyButton_Click(event) {
    const producerId = event.target.id.slice(4);
    const selectedProducer = carProducers.find(producer => producer.id === producerId);
    selectedProducer.attemptToBuyProducer(car.getCount());
    render();
  }
  
  ///
  function tick() {
    car.count += car.totalUPPUT;
    car.updateDisplayedCount();
    render();
  }
  
  // Repeat the tick function every 1000ms, or 1s
  setInterval(() => tick(), 1000);
