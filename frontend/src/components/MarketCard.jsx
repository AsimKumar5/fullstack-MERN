import { TrendingDown, TrendingUp } from "lucide-react";

function MarketCard({ name, value, change }) {
  const isPositive = change >= 0;

  return (
    <div className="market-card">
      <span className="market-name">{name}</span>
      <strong>{(value || 0).toLocaleString("en-IN")}</strong>
      <span className={isPositive ? "positive" : "negative"}>
        {isPositive ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
        {isPositive ? "+" : ""}
        {change}%
      </span>
    </div>
  );
}

export default MarketCard;