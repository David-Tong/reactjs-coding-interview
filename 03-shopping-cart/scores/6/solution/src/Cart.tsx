import { CartItem } from "./types";

interface CartInterface {
  cartItems: CartItem[];
  onDelete: (name: string) => void;
}

export default function Cart(props: CartInterface) {
  const totalItems = props.cartItems.reduce((accumulator, item) => {
    return accumulator + item.quantity;
  }, 0);
  const totalPrices = props.cartItems.reduce((accumulator, item) => {
    return accumulator + item.quantity * item.product.price;
  }, 0);
  return (
    <>
      {totalItems === 0 && <p>The Cart is empty.</p>}
      {totalItems > 0 && (
        <>
          <table>
            <caption>
              <h1>Cart</h1>
            </caption>
            <thead>
              <tr>
                <td>Product Name</td>
                <td>Product Price</td>
                <td>quantity</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {props.cartItems
                .filter((item) => item.quantity > 0)
                .map((item) => (
                  <tr key={item.product.name}>
                    <td>{item.product.name}</td>
                    <td>{item.product.price}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => {
                          props.onDelete(item.product.name);
                        }}
                      >
                        Remove a cart item
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <p>Total ${totalPrices}</p>
        </>
      )}
    </>
  );
}
