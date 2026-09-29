import { TrendingUp, TrendingDown } from "lucide-react";

function StockCard({
  name,
  symbol,
  price,
  change
}) {

  const isPositive = change >= 0;

  return (
    <div className="stock-card">

      <div className="stock-info">

        <div className="stock-logo">
          {symbol.substring(0, 2)}
        </div>

        <div>
          <h3>{name}</h3>
          <span>{symbol}</span>
        </div>

      </div>

      <div className="stock-price">

        <strong>
          ₹{(price || 0).toLocaleString("en-IN")}
        </strong>

        <span
          className={
            isPositive
              ? "positive"
              : "negative"
          }
        >

          {isPositive
            ? <TrendingUp size={15} />
            : <TrendingDown size={15} />
          }

          {isPositive ? "+" : ""}
          {change}%

        </span>

      </div>

    </div>
  );
}

export default StockCard;