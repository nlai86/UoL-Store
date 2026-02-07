type ContentAreaProps = {
	itemList: Product[]
	addToBasket: (product: BasketItem) => void
}

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


export const ProductList = (props: ContentAreaProps) => {
	return (
		<div id="productList">
			{props.itemList.map((item) => {
				return (
					<div key={item.name} className="product">	
						<div className="product-top-bar">
							<h2>{item.name}</h2>
							<p> £{item.price.toFixed(2)} ({item.rating}/5)</p>
						</div>
						<img src={"./src/Assets/Product_Images/" + item.image_link}></img>
						<button disabled={!item.quantity} onClick={() => item.quantity > 0 && props.addToBasket(item)} value={item.id}>{item.quantity > 0 ? "Add to basket" : "Out of stock"}</button> 
					</div>
				)
			})}
		</div>
	);
}


