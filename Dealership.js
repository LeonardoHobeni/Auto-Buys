class Car{
  constructor(refNo, stockLevel, description, model, color, make, price, gearbox, bodyType, fuelType){
    this.refNo = refNo;
    this.stockLevel = stockLevel;
    this.description = description;
    this.model = model;
    this.color = color;
    this.make = make;
    this.price = price;
    this.gearbox = gearbox;
    this.bodyType = bodyType;
    this.fuelType = fuelType;
  }

  getDescription(){
    let result = "Ref: " + this.refNo +
                " \nStock Level: " + this.stockLevel + 
                " \nDescription: " + this.description + 
                " \nModel: " + this.model + 
                " \nColor: " + this.color +
                " \nMake: " + this.make +
                " \nPrice: $" + this.price + 
                " \nGearbox: " + this.gearbox + 
                " \nBody Type: " + this.bodyType +
                " \nFuel Type: " + this.fuelType;
    return result;
  }

  static carSchema = [
    {id: 'stockLevel', prompt: 'Stock Level', type: 'input'},
    {id: 'description', prompt: 'Description', type: 'textarea', rows: '5', cols: '40'},
    {id: 'model', prompt: 'Model', type: 'input'},
    {id: 'color', prompt: 'Color', type: 'input'},
    {id: 'make', prompt: 'Make', type: 'input'},
    {id: 'price', prompt: 'Price', type: 'input'},
    {id: 'gearbox', prompt: 'Gearbox', type: 'input'},
    {id: 'bodyType', prompt: 'Body Type', type: 'input'},
    {id: 'fuelType', prompt: 'Fuel Type', type: 'input'}
  ];

  getHTML(containerElement){
    Car.buildHTMLFromSchema(containerElement, Car.carSchema);
  }

  static buildHTMLFromSchema(containerElement, schema){
    for(let item of schema){
      let result = Car.makeInputPanel(item);
      containerElement.appendChild(result);
    }
  }

  static makeInputPanel(description){
    let resultPar = document.createElement('p');

    let descLabel = document.createElement('label');
    descLabel.className = 'inputLabel';
    descLabel.setAttribute('for', description.id);
    descLabel.innerText = description.prompt + ':';
    resultPar.appendChild(descLabel);

    let inputElement;
    switch(description.type){
      case 'input': 
        inputElement = document.createElement('input');
        inputElement.className = 'inputPanel';
        break;
      
      case 'textarea': 
        inputElement = document.createElement('textarea');
        inputElement.className = 'inputTextPanel';
        inputElement.setAttribute('rows', description.rows);
        inputElement.setAttribute('cols', description.cols);
        break;
    }

    inputElement.setAttribute('value', '');
    inputElement.setAttribute('id', description.id);
    resultPar.appendChild(inputElement);
    return resultPar;
  }

  JSONstringify(){
    return JSON.stringify(this);
  }

  static JSONparse(text){
    let rawObject = JSON.parse(text);
    let result = null;

    switch(rawObject.type){
      case 'bmw':
        result = new BMW();
        break;
      case 'audi':
        result = new AUDI();
        break;
    }
    Object.assign(result, rawObject);
    return result;
  }

  sendToHTML(){
    for(let item in this){
      if(item == 'type' || item == 'refNo')
        continue;
      let itemElement = document.getElementById(item);
      itemElement.value = this[item];
    }
  }

  getFromHTML(){
    for(let item in this){
      if(item == 'type' || item == 'refNo')
        continue;
      let itemElement = document.getElementById(item);
      this[item] = itemElement.value;
    }
  }

  static getLargestStockRef(dataArray){
    
    if(dataArray.length == 0)
      return 0;
  
    let largest = dataArray[0].refNo;
    for(let obj of dataArray){
      if(obj.refNo > largest)
        largest = obj.refNo;
    }
    return largest;
  }


}

class BMW extends Car { 
  constructor(refNo, stockLevel, description, model, color, make, price, gearbox, bodyType, fuelType){
    super(refNo, stockLevel, description, model, color, make, price, gearbox, bodyType, fuelType);
    this.type = 'bmw';
  }
}

class AUDI extends Car {
  constructor(refNo, stockLevel, description, model, color, make, price, gearbox, bodyType, fuelType){
    super(refNo, stockLevel, description, model, color, make, price, gearbox, bodyType, fuelType);
    this.type = 'audi';
  }
}