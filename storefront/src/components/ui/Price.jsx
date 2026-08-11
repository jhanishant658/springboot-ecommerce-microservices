/**
 * Props map to Product-Service's Product entity: price, discountPrice.
 */
export default function Price({ amount, discount, className = "" }) {
  return (
    <span className={`font-mono ${className}`}>
      {discount != null && discount < amount && (
        <span className="mr-2 text-zinc-400 line-through">₹{amount}</span>
      )}
      ₹{discount != null && discount < amount ? discount : amount}
    </span>
  );
}
