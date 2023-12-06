// Bring in the data object from the data.js file
const data = window.data;

// References
const carProdContainer = document.getElementById('car-producers');
const robotProdContainer = document.getElementById('robot-producers');

// Event listeners for icons
const carIcon = document.getElementById('car-icon');
carIcon.addEventListener('click', () => {
  car.clickProduct();
  render();
});

const robotIcon = document.getElementById('robot-icon');
robotIcon.addEventListener('click', () => {
  robot.clickProduct();
  render();
});

// Classes declaration
class Product {
  constructor(_name, _product){
    this.name = _name;
    this.count = _product.count;            // product count
    this.totalUPPUT = _product.totalUPPUT;  // total units produced per unit time
  }
  getCount() { return this.count; }

  updateDisplayedCount(){
    const productCounter = document.getElementById(`${this.name}-counter`);
    productCounter.innerText = this.count;
  }

  updateDisplayedTotalUPPUT(){
    const upputDiv = document.getElementById(`${this.name}-UPPUT`);
    upputDiv.innerText = this.totalUPPUT;
  }
  clickProduct(){
    this.count += 1;
    this.updateDisplayedCount();
  }

  deductCost(cost){
    this.count -= cost; 
  }
  
  increaseThroughput(increase){
    this.totalUPPUT += increase;
    this.updateDisplayedTotalUPPUT();
  }
}

class Producer { 
  constructor(name, _producer){
    this.name = name;
    this.id = _producer.id;
    this.price = _producer.price;
    this.unlocked = _producer.unlocked;
    this.upput = _producer.upput;
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
      if(this.qty > 0){
        containerDiv.classList.add('bought');
      }
      const html = `
        <div class="producer-column">
          <div class="producer-name">${this.makeDisplayNameFromId()}</div>
        </div>
        <div class="producer-column">
          <div>Quantity: ${this.qty}</div>
          <div>Unit/second: ${this.upput}</div>
          <div>Cost: ${this.price} Unit</div>
        </div>
      `;
      containerDiv.innerHTML = html;
      const buyBtn = document.createElement('button');
      buyBtn.textContent = 'Buy';
      buyBtn.className = `${this.name}_button`;
      buyBtn.id = `buy_${this.id}`;

      buyBtn.addEventListener('click', (event) => buyBtnClick(event,this.name));

      containerDiv.append(buyBtn);       

      return containerDiv;
    }
    return '';    
  }
  attemptToBuyProducer(product){
    if(this.price <= product.getCount()){  
        product.deductCost(this.price);
        this.qty += 1;
        this.price = Math.floor(this.price * 1.25);
        product.increaseThroughput(this.upput);
    }
    else{
      window.alert("Not enough produced units!");      
    }  
  }
}

/// Create Product instances
const car = new Product('car', data.car);
const robot = new Product('robot', data.robot);

/// Create Producer instances
const carProducers = data.car.producers.map(producer => {
  return new Producer('car', producer);
});

const robotProducers = data.robot.producers.map(producer => {
  return new Producer('robot', producer);
});

////
function render(){
  const carProdDivs = carProducers.map(producer => {
    producer.setUnlocked(car.getCount());
    return producer.makeProducerDiv();
  }); 
  carProdContainer.replaceChildren(...carProdDivs);

  const robotProdDivs = robotProducers.map(producer => {
    producer.setUnlocked(robot.getCount());
    return producer.makeProducerDiv();
  }); 
  robotProdContainer.replaceChildren(...robotProdDivs);
}

// handling buy button events 
function buyBtnClick(event, name){
    const producerId = event.target.id.slice(4);
    if(name === 'car'){
        const selectedProducer = carProducers.find(producer => producer.id === producerId);
        selectedProducer.attemptToBuyProducer(car);
    }
    else if(name === 'robot'){
        const selectedProducer = robotProducers.find(producer => producer.id === producerId);
        selectedProducer.attemptToBuyProducer(robot);
    }
    render();
  }

// update car and robot count
function tick() {
  car.count += car.totalUPPUT;
  car.updateDisplayedCount();

  robot.count += robot.totalUPPUT;
  robot.updateDisplayedCount();
  render();
}

// Rpeat the tick function every 2000ms, or 2s
setInterval(() => tick(), 2000);
