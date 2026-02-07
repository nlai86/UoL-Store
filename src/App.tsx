import { useState, useEffect } from 'react'
import { ProductList } from './Components/ProductList'
import itemList from './Assets/random_products_175.json';
import './e-commerce-stylesheet.css'

type Product = {
  id: number
	name: string
  price: number
  category: string
  quantity: number
  rating: number
  image_link: string
}

type BasketItem = {
  id: number
	name: string
  price: number
  category: string
  quantity: number
  rating: number
  image_link: string
}

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchedProducts, setSearchedProducts] = useState<Product[]>(itemList);
  const [sortOption, setSortOption] = useState<string>('AtoZ');
  const [showInStock, setShowInStock] = useState<boolean>(false);
  const [basket, updateBasket] = useState<BasketItem[]>([]);

  // ===== Hooks =====
  useEffect(() => updateSearchedProducts(), [searchTerm]);

  useEffect(() => { // Section 5.2 
    let products = itemList.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())

    ); 

    if (showInStock) {
      products = products.filter(product => product.quantity > 0);
    }

    const sortedProducts = sortProducts(products);
    setSearchedProducts(sortedProducts);

  },[sortOption, showInStock, searchTerm]);

  // ===== Basket management =====
  function showBasket(){
    const areaObject = document.getElementById('shopping-area');
    if(areaObject !== null){
      areaObject.style.display='block';
    }
  }

  function hideBasket(){
    const areaObject = document.getElementById('shopping-area');
    if(areaObject !== null){
      areaObject.style.display='none';
    }
  }

  function addToBasket(product: Product) { // Section 5.3 - Add item to basket 
    updateBasket(function(basket) {
        const itemExists = basket.find(function(item) {
            return item.id == product.id;
        });
        if (itemExists) { // Increment item quantity in basket if it is already in the basket
            return basket.map(function(item) {
                return item.id == product.id ? { ...item, quantity: item.quantity + 1 } : item;
            });
        } else if (!itemExists) { // Add item with quantity of 1 if item is not already in basket 
            const newItem = { ...product, quantity: 1 };
            return [...basket, newItem];
        }
    });
  }

  function removeFromBasket(productName: string) { // Section 5.4 - Remove item from basket
    updateBasket(function(basket) {
      const newBasket = [...basket];
      const unwantedItemIndex = basket.findIndex(function(item) {
          return item.name == productName;
      });

      const unwantedItem = newBasket[unwantedItemIndex];

      if (unwantedItem.quantity > 1) {
          newBasket[unwantedItemIndex] = { ...unwantedItem, quantity: unwantedItem.quantity - 1 }; // decrease quantity if item exists 
      } else {
          newBasket.splice(unwantedItemIndex, 1); // remove item if quantity becomes 0 
      }
      return newBasket;
    });
  }

  function visualizeBasket() { // Section 5.4 - Visualize basket items
    if (basket.length == 0) {
      return (<p>Your basket is empty</p>) // display if basket is empty 
    } else {
      return (
        <div> 
          {basket.map(item => (
          <div key={item.name} class="shopping-row">
            <div class="shopping-information">
              {item.name} (£{item.price}) - {item.quantity}
              <button onClick={() => removeFromBasket(item.name)}>Remove</button> 
            </div>
          </div>  
          ))}
        </div>
      )
    }
  }

  function calculateTotal() { // Section 5.4 - Calculate total of basket
    let sum = 0.00; 
    for (let i = 0; i < basket.length; i++) {
      sum += basket[i].quantity * basket[i].price; 
    }
    return sum.toFixed(2);
  }

  // ===== Search =====
  function updateSearchedProducts(){
    let holderList: Product[] = itemList;

    setSearchedProducts(holderList.filter((product: Product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }

  function displayResultsCounter() { // Section 5.1 
    if (searchTerm == "") {
      if (searchedProducts.length == 1) {
        return searchedProducts.length + " Product";
      } else {
        return searchedProducts.length + " Products";
      }
    } else if (searchTerm != "") {
      if (searchedProducts.length == 1) {
        return searchedProducts.length + " Result";
      } else if (searchedProducts.length == 0){
        return "No search results found";
      } else {
        return searchedProducts.length + " Results";
      }
    }
  }

  function sortProducts(products: Product[]): Product[]{ // Section 5.2 
    if (sortOption == 'AtoZ') {
      return [...products].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption == 'ZtoA') {
      return [...products].sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption == '£LtoH') {
      return [...products].sort((a, b) => a.price - b.price);
    } else if (sortOption == '£HtoL') {
      return [...products].sort((a, b) => b.price - a.price);
    } else if (sortOption == '*LtoH') {
      return [...products].sort((a, b) => a.rating - b.rating);
    } else if (sortOption == '*HtoL') {
      return [...products].sort((a, b) => b.rating - a.rating);
    } else {
      return products;
    }
  }
 
  return (
    <div id="container"> 
      <div id="logo-bar">
        <div id="logo-area">
          <img src="./src/assets/logo.png"></img>
        </div>
        <div id="shopping-icon-area">
          <img id="shopping-icon" onClick={showBasket} src="./src/assets/shopping-basket.png"></img>
        </div>
        <div id="shopping-area">
          <div id="exit-area">
            <p id="exit-icon" onClick={hideBasket}>x</p>
          </div>
          <div>
            {visualizeBasket()}
            <p>Total: £ {calculateTotal()}</p>
          </div>
        </div>
      </div>
      <div id="search-bar">
        <input type="text" placeholder="Search..." onChange={changeEventObject => setSearchTerm(changeEventObject.target.value)}></input>
        <div id="control-area">
          <select onChange={(e) => setSortOption(e.target.value)}>
            <option value="AtoZ">By name (A - Z)</option>
            <option value="ZtoA">By name (Z - A)</option>
            <option value="£LtoH">By price (low - high)</option>
            <option value="£HtoL">By price (high - low)</option>
            <option value="*LtoH">By rating (low - high)</option>
            <option value="*HtoL">By rating (high - low)</option>
          </select>
          <input id="inStock" type="checkbox" checked={showInStock} onChange={e => setShowInStock(e.target.checked)}></input>
          <label htmlFor="inStock">In stock</label>
        </div>
      </div>
      <p id="results-indicator">{ displayResultsCounter() }</p> 
      <ProductList itemList={searchedProducts} addToBasket={addToBasket} />
    </div>
    
  )
}

export default App
