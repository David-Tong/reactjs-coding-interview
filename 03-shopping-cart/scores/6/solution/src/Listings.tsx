import { Listing } from "./types";

interface ListingsProps {
  listings: Listing[];
  onAdd: (name: string) => void;
}

export default function Listings(props: ListingsProps) {
  return (
    <>
      <table>
        <caption>
          <h1>Listings</h1>
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
          {props.listings
            .filter((listing) => listing.quantity > 0)
            .map((listing) => (
              <tr key={listing.product.name}>
                <td>{listing.product.name}</td>
                <td>{listing.product.price}</td>
                <td>{listing.quantity}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => {
                      props.onAdd(listing.product.name);
                    }}
                  >
                    Add a product
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
