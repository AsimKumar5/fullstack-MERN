import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStock } from "../api";

function StockDetails() {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getStock(symbol).then(setStock).catch((requestError) => setError(requestError.message));
  }, [symbol]);

  return (
    <section className="dashboard-section">
      <div className="section-header">
        <div>
          <h1>{stock?.name || symbol} Details</h1>
          <p>{error || (stock?.price ? `₹${stock.price.toLocaleString("en-IN")} · ${stock.change}% today` : "Loading stock information...")}</p>
        </div>
      </div>
    </section>
  );
}

export default StockDetails;