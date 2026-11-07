import { useState } from "react";
import { Listing, CartItem } from "./types";
import { LISTINGS, CARTITEMS } from "./types";
import Listings from "./Listings";
import Cart from "./Cart";

export default function App() {
  const [listings, setListings] = useState<Listing[]>(LISTINGS);
  const [carrItems, setCartItems] = useState<CartItem[]>(CARTITEMS);
  const [error, setError] = useState("");

  const onAdd = (name: string) => {
    // check target
    const target = listings.find((listing) => listing.product.name === name);
    if (target == null || target.quantity <= 0) {
      setError(
        `Can't remove product ${name} from cart because quantity is zero`,
      );
      return;
    }

    // update
    setError("");
    setListings((prev) =>
      prev.map((listing) =>
        listing.product.name === name
          ? { ...listing, quantity: listing.quantity - 1 }
          : listing,
      ),
    );
    setCartItems((prev) =>
      prev.map((cartItem) =>
        cartItem.product.name === name
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem,
      ),
    );
  };

  const onDelete = (name: string) => {
    // check target
    const target = carrItems.find((item) => item.product.name === name);
    if (target == null || target.quantity <= 0) {
      setError(
        `Can't remove product ${name} from cart because quantity is zero`,
      );
      return;
    }

    // update
    setError("");
    setCartItems((prev) =>
      prev.map((cartItem) =>
        cartItem.product.name === name
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem,
      ),
    );
    setListings((prev) =>
      prev.map((product) =>
        product.product.name === name
          ? { ...product, quantity: product.quantity + 1 }
          : product,
      ),
    );
  };

  return (
    <>
      <p>{error}</p>
      <Listings listings={listings} onAdd={onAdd}></Listings>
      <Cart cartItems={carrItems} onDelete={onDelete}></Cart>
    </>
  );
}
