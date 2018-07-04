// storage controller
  const storageCtrl = (function(){
    //store items in local storafe
    return{
        storeItem: function(item){
          let items;
        // check if there are items in local storage and get them
        if(localStorage.getItem('items') === null){
          items = [];
          //push in the new item
          items.push(item);
          //set in LS AND Wrap in json.stringify to convert the array to a string
          localStorage.setItem('items', JSON.stringify(items))
        }else{
          //get items from LS and usee json.parse to convert he string back to an array
          items = JSON.parse(localStorage.getItem('items'));
          // push new item
          items.push(item);
          //reset LS
          localStorage.setItem('items', JSON.stringify(items))
        }
        },
        getItemsFromStorage: function(){
          let items;
          if(localStorage.getItem('items') === null){
            items = [];
          }else {
            items = JSON.parse(localStorage.getItem('items'));
          }
          return items;
        },
        updateItemStorage: function(updatedItem){
          let items = JSON.parse(localStorage.getItem('items'));

          // LOOP THROUGH THE ITEMS
          items.forEach(function(item, index){
            //item.id is the current item...remove it and replace with the updated item then reset the local storage
            if(updatedItem.id === item.id){
              items.splice(index, 1, updatedItem);
            }
          });
          localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemStorage: function(id){
          let items = JSON.parse(localStorage.getItem('items'));

          // LOOP THROUGH THE ITEMS
          items.forEach(function(item, index){
            //if the id selected is the current item.id the we will delete it using splice
            if(id === item.id){
              //item.splice(index,1) will delete it
              items.splice(index, 1,);
            }
          });
          localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsStorage: function(){
          localStorage.removeItem('items');
        }
      }
  })();
//item controller
  const itemCtrl =(() => {
    //item constructor
    const Item = function(id, name, calories){
      this.id = id;
      this.name = name;
      this.calories = calories;
    }
    //data structure / state
    const data = {
      //items:[],
      items: storageCtrl.getItemsFromStorage(),
      currentItem: null,
      totalCalories: 0
    }
    //public methods
    return{
      getItems:() => data.items,
      addItem: function(name, calories){
        //create id
        let ID;
        if(data.items.length > 0){
          ID = data.items[data.items.length-1].id + 1
        }else{
          ID = 0;
        }
        //parse calories as number
        calories = parseInt(calories);
        // create new item
        newItem = new Item(ID, name, calories);
        //push new item to the data structure
        data.items.push(newItem);
        //return the new item so it can be accessed below
        return newItem;
      },
      getItemById: id => {
        //loop through the items and match the id
        let found = null;
        data.items.forEach(function(item){
          if(item.id === id){
            found = item;
          }
        });
        return found;
      },
      updateItem:(name, calories) => {
        //calories to number
        let found = null;
        data.items.forEach(function(item){
          if(item.id === data.currentItem.id){
            item.name = name;
            item.calories = calories;
            found = item;
          }
        });
        return found;
      },
      deleteItem:id => {
        // get ids using the map function
        ids = data.items.map(item => item.id);
        //get the index
        const index = ids.indexOf(id);
        //remove item by splicing it from the array
        data.items.splice(index, 1);
      },
      clearAllListItems:() => data.items =  [],
      setCurrentItem: item => data.currentItem= item,
      getCurrentItem:() => data.currentItem,
      getTotalCalories:() => {
        //loop through the items and add their calories
        let total = 0
        data.items.forEach(function(item){
          total += parseInt(item.calories);
           
        });
        //set total calories in data structure which was initially set to 0
        data.totalCalories=total;
        // return total
        return data.totalCalories;
      },
      logData: () => data
    }
  })();


//ui controller
  const uiCtrl =(() => {
      //selectors
      uiSelectors = {
        itemList : '#item-list',
        listItem : '#item-list li',
        addBtn : '.add-btn',
        updateBtn:'.update-btn',
        deleteBtn:'.delete-btn',
        backBtn:'.back-btn',
        clearBtn:'.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput:'#item-calories',
        totalcalories:'.total-calories'
      
      }
      //public methods
        return{
          populateItemList: items => {
            //loop through, making each one a list item then insert into the ul
            let html='';

            items.forEach( item => {
              //take the html variable and append to it
              html += `
              <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}:</strong><em>${item.calories} calories </em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li>
              `
            });
            // insert li into ul
            document.querySelector(uiSelectors.itemList).innerHTML=html;
          },
          getItemInput:() => {
            return {
              name:document.querySelector(uiSelectors.itemNameInput).value,
              calories:document.querySelector(uiSelectors.itemCaloriesInput).value
            }
          },
          addListItem: item => {
            //create li element
            const li = document.createElement('li');
            //add class
            li.className = 'collection-item'
            //add id
            li.id = `item-${item.id}`
            //add html
            li.innerHTML = `<strong>${item.name}:</strong><em>${item.calories} calories </em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`
            //insert item
            document.querySelector(uiSelectors.itemList).insertAdjacentElement('beforeend', li)
          },
          updateListItem: item => {
            // get the list items from the dom
            let listItems = document.querySelectorAll(uiSelectors.listItem);
            //the above gives a node list whcih we have to loop through by first converting the node list to an array
            listItems = Array.from(listItems);
            //loop through with for..each
            listItems.forEach(function(listItem){
              const itemID = listItem.getAttribute('id');
              if(itemID === `item-${item.id}`){
                document.querySelector(`#${itemID}`).innerHTML = `
                <li class="collection-item" id="item-${item.id}">
                  <strong>${item.name}:</strong><em>${item.calories} calories </em>
                  <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                  </a>
                </li>
                `
              }
            })
          },
          deleteListItem: id =>{
            const itemeID = `#item-${id}`;
            const item = document.querySelector(itemeID);
            item.remove();
          },
          clearInput: () =>{
            document.querySelector(uiSelectors.itemNameInput).value ='',
            document.querySelector(uiSelectors.itemCaloriesInput).value ='';
          },
          addItemToForm:() => {
            //add the new edit state to the form based on the edit button
            uiCtrl.showEditState();
            document.querySelector(uiSelectors.itemNameInput).value =itemCtrl.getCurrentItem().name,
            document.querySelector(uiSelectors.itemCaloriesInput).value =itemCtrl.getCurrentItem().calories;
          },
          removeListItems:() => {
            let listItems = document.querySelectorAll(uiSelectors.listItem);
            listItems = Array.from(listItems);
            listItems.forEach(function(item){ item.remove()});
          },
          showTotalCalories: function(totalCalories){
            document.querySelector(uiSelectors.totalcalories).textContent = totalCalories;
          },
          clearEditState:() => {
            uiCtrl.clearInput();
            //state of buttons
            document.querySelector(uiSelectors.updateBtn).style.display ='none';
            document.querySelector(uiSelectors.deleteBtn).style.display ='none';
            document.querySelector(uiSelectors.backBtn).style.display ='none';
            document.querySelector(uiSelectors.addBtn).style.display ='inline';
          },
          showEditState:() => {
            //state of buttons
            document.querySelector(uiSelectors.updateBtn).style.display ='inline';
            document.querySelector(uiSelectors.deleteBtn).style.display ='inline';
            document.querySelector(uiSelectors.backBtn).style.display ='inline';
            document.querySelector(uiSelectors.addBtn).style.display ='none';
          },
          getSelectors:() => uiSelectors
        }
  })();


//app controller
  const app =((itemCtrl, storageCtrl, uiCtrl) => {
    //eventlisteners
    const loadEventListeners = () => {

      // in order to access the uiselectors in the appcontroller, we had to return uiselectors using a function
      const UISelectors = uiCtrl.getSelectors();

      // add item event
        document.querySelector(uiSelectors.addBtn).addEventListener('click', itemAddSubmit);

      //disable submit from enter
        document.addEventListener('keypress', function(e){
          if(e.keyCode === 13 || e.which === 13){
            e.preventDefault();
            return false;
          }
        });

      // edit icon click event (using event delegation)
      document.querySelector(uiSelectors.itemList).addEventListener('click', itemEditClick);

      // update item event
      document.querySelector(uiSelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

      // Back button EVENT
      document.querySelector(uiSelectors.backBtn).addEventListener('click', uiCtrl.clearEditState)

      // clear button EVENT
      document.querySelector(uiSelectors.clearBtn).addEventListener('click', clearAllItems)

      // DELETE ITEM EVENT
      document.querySelector(uiSelectors.deleteBtn).addEventListener('click', itemDeleteSubmit)
      }
      

    //add item submit
    const itemAddSubmit = e =>{
      // get form input from ui
      const input = uiCtrl.getItemInput();
      //check for input
      if(input.name !== '' && input.calories !== ''){
        // add item
        const newItem = itemCtrl.addItem(input.name, input.calories);
        //add new item to the ui
        uiCtrl.addListItem(newItem);       
        //get total calories
        const totalCalories = itemCtrl.getTotalCalories();
        //add total calories to ui
        uiCtrl.showTotalCalories(totalCalories);

        // store in local
        storageCtrl.storeItem(newItem);

        // clear fields
        uiCtrl.clearInput();
      }
      e.preventDefault();
    }
    // edit item submit
    const itemEditClick = e => {
      //use the if statement and the event parameter(e) to target the classlist making sure it contains only the class name of the icon
      if(e.target.classList.contains('edit-item')){
        // add the item to the current item

        // get the list item id (by targeting the element containing the id using parent node)
        const listId = e.target.parentNode.parentNode.id;

        // break into an array(using the split method)
        const listIdArr = listId.split('-');

        //get the actual id and parse is as an int
        const id = parseInt(listIdArr[1]);

        //get item
        const itemToEdit = itemCtrl.getItemById(id);
        

        // set current item
        itemCtrl.setCurrentItem(itemToEdit);

        //add item to form
        uiCtrl.addItemToForm();

      }
      e.preventDefault();
    }
    // item update submit
    const itemUpdateSubmit = e => {
      // get item input
      const input = uiCtrl.getItemInput();
      
      //update item input
      const updatedItem = itemCtrl.updateItem(input.name, input.calories);
      
      // show in ui
      uiCtrl.updateListItem(updatedItem);

      //get total calories
      const totalCalories = itemCtrl.getTotalCalories();
      //update total calories to ui
      uiCtrl.showTotalCalories(totalCalories);   
      // update local storag
      storageCtrl.updateItemStorage(updatedItem);

      // clear fields and edit state
      uiCtrl.clearEditState();

      e.preventDefault();
    }
    const itemDeleteSubmit = e => {
      // get current item
      const currentItem = itemCtrl.getCurrentItem();
      //delete from data structure
      itemCtrl.deleteItem(currentItem.id)
      // delete from ui
      uiCtrl.deleteListItem(currentItem.id)
      //get total calories
      const totalCalories = itemCtrl.getTotalCalories();
      //update total calories to ui
      uiCtrl.showTotalCalories(totalCalories);   

      //delete from LS
      storageCtrl.deleteItemStorage(currentItem.id);
      
      // clear fields and edit state
      uiCtrl.clearEditState();  

      //hide ul
      //const removeUl = uiCtrl.removeUl();

    }
    const clearAllItems = e => {
      // delete all items from data structure
      itemCtrl.clearAllListItems();

      //get total calories
      const totalCalories = itemCtrl.getTotalCalories();
      //update total calories to ui
      uiCtrl.showTotalCalories(totalCalories); 
      //remove from UI
      uiCtrl.removeListItems();
      //clear from local storage
      storageCtrl.clearItemsStorage();

      e.preventDefault();
    }
    //public methods
      return {
        init:() => {
          //set initial state
          uiCtrl.clearEditState();
          // fetch items from data
          const items = itemCtrl.getItems();
          //populate list with items
          uiCtrl.populateItemList(items);
          //load eventlisteners
          loadEventListeners();

        }
      }
  })(itemCtrl, storageCtrl, uiCtrl);

// initializing app
app.init();
