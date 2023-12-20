var dataStore; // array to hold the data car objects
var activeItem; // variable to hold the current active object
var storeName; // variable to hold the name of the storage in local storage
var mainContainer; // variable to hold the reference to the menu container

const LOAD_STORE_OK = 0;
const STORE_EMPTY = 1;
const INVALID_STORE = 2;

function loadStoreData(){
  let dataArrayJSON = localStorage.getItem(storeName);
  
  if(dataArrayJSON == '[]' || dataArrayJSON === null){
    dataStore = [];
    return STORE_EMPTY;
  }

  dataStore = [];
  try{
    let dataArray = JSON.parse(dataArrayJSON);
    for(let item of dataArray){
      dataStore[dataStore.length] = Car.JSONparse(item);
    }
  }
  catch{
    dataStore = [];
    return INVALID_STORE;
  }

  return LOAD_STORE_OK;
}

function saveStoreData(){
  let dataArray = [];
  for(let item of dataStore)
    dataArray[dataArray.length] = item.JSONstringify();
  let dataArrayJSON = JSON.stringify(dataArray);
  localStorage.setItem(storeName, dataArrayJSON);
}

function doShowMenu(){
  MenuTitle('Main Menu');

  showMenu(
    [
      {desc: 'Add BMW', label: 'BMW', func: 'doAddBMW()'},
      {desc: 'Add AUDI', label: 'AUDI', func: 'doAddAUDI()'},
      {desc: 'Update Car', label: 'Update', func: 'doUpdateCar()'},
      {desc: 'List Cars', label: 'List', func: 'doListCars()'}
    ]
  );
}

function doListCars(){
  MenuTitle('Car List');
  for(let car of dataStore){
    doMakeCarList(car);
  }
}

function doMakeCarList(description){
  let listPar = document.createElement('p');
  listPar.className = 'list-para';

  // creating update button
  let updateBtn = document.createElement('button');
  updateBtn.className = 'update-btn';
  updateBtn.innerText = 'Update';
  let functionCall = 'doFind('+description.refNo+')';
  updateBtn.setAttribute('onclick', functionCall);
  listPar.appendChild(updateBtn);

  // creating car description paragraph
  let descPar = document.createElement('p');
  descPar.className = 'desc-par';
  descPar.innerText = description.getDescription();
  listPar.appendChild(descPar);
  
  mainContainer.appendChild(listPar);
}

function doUpdateCar(){
  MenuTitle('Update Car');
  Car.buildHTMLFromSchema(mainContainer, [
    {id: 'referenceId', prompt: 'Reference', type: 'input'}
  ]);

  showMenu(
    [
      {desc: 'Find Car', label: 'Find', func: 'doFindCar()'},
      {desc: 'Cancel updates', label: 'Cancel', func: 'doCancelUpdate()'}
    ]
  );
}

function doCancelUpdate(){
  doShowMenu();
}

function doFindCar(){
  let inputRefElement = document.getElementById('referenceId');
  doFind(inputRefElement.value);
}

function doFind(reference){
  if(!isCarExist(reference)){
    displayAlert('Car not found!');
  }
  else{
    MenuTitle('Update ' + activeItem.type.toUpperCase() + ' ' + activeItem.refNo);
    activeItem.getHTML(mainContainer);
    activeItem.sendToHTML();
    showMenu([
      {desc: 'Save updates', label: 'Save', func: 'doSaveUpdate()'},
      {desc: 'Cancel updates', label: 'Cancel', func: 'doCancelUpdate()'}
    ]);
  }
}

function doSaveUpdate(){
  activeItem.getFromHTML();
  displayAlert(activeItem.type.toUpperCase() + ' ' + activeItem.refNo + ' updated');
  saveStoreData();
  doShowMenu();
}

function isCarExist(reference){
  for(let item of dataStore)
    if(reference == item.refNo){
      activeItem = item;
      return true;
    }
  return false;
}

function doAddBMW(){
  doAddCar(BMW);
}

function doAddAUDI(){
  doAddCar(AUDI);
}

function doAddCar(CarClass){
  activeItem = new CarClass();
  MenuTitle('Add '+(activeItem.type).toUpperCase());
  activeItem.getHTML(mainContainer);
  showMenu(
    [
      {desc: 'Save Car', label: 'Save', func: 'doSaveCar()'},
      {desc: 'Cancel add', label: 'Cancel', func: 'doShowMenu()'}
    ]
  );
}

function doSaveCar(){
  activeItem.getFromHTML();
  activeItem.refNo = Car.getLargestStockRef(dataStore) + 1;
  dataStore[dataStore.length] = activeItem;
  let message = activeItem.type.toUpperCase() + " " + activeItem.refNo + " added";
  displayAlert(message);
  saveStoreData();
  doShowMenu();

}

function displayAlert(message){
  alert(message);
}

function showMenu(schema){
  for(let item of schema){
    let resultElement = makeElement(item);
    mainContainer.appendChild(resultElement);
  }
}

function makeElement(description){
  let resultPar = document.createElement('p');

  let btnDesc = document.createElement('p');
  btnDesc.className = 'menuDesc';
  btnDesc.innerText = description.desc;
  resultPar.appendChild(btnDesc);

  let btnElement = document.createElement('button');
  btnElement.innerText = description.label;
  btnElement.setAttribute('onclick', description.func);
  btnElement.className = 'menuBtn';
  resultPar.appendChild(btnElement);

  return resultPar;
}



function MenuTitle(title){
  clearMenuPanel();
  let menuTitle = document.createElement('p');
  menuTitle.className = 'menu-title';
  menuTitle.innerText = title;
  mainContainer.appendChild(menuTitle);
}

function clearMenuPanel(){
  while(mainContainer.children.length > 0)
    mainContainer.removeChild(mainContainer.children[0]);
}

function startCarShopApp(containerId, nameToUse){
  mainContainer = document.getElementById(containerId);
  storeName = nameToUse;
  let response = loadStoreData();

  switch(response){
    case LOAD_STORE_OK:
      break;
    case STORE_EMPTY:
      displayAlert('Empty Store has been created');
      break;
    case INVALID_STORE:
      displayAlert('Invalid JSON, empty store has been created');
      break;
  }
  console.log(dataStore);
  doShowMenu();
}