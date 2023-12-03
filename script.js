// Bring in the data object from the data.js file
const data = window.data;

// References
const carProdContainer = document.getElementById('car-producers');


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

//   updateDisplayedCount(){
    
//   }

  clickCar(){
    this.count += 1;
    const productCounter = document.getElementById('counter');
    productCounter.innerText = this.count;
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

}

///////
const car = new Product(data);

console.log("Create instances...")
const carProducers = data.producers.map(producer => {
  return new Producer(producer);
});

console.log(carProducers);

//////////////////
