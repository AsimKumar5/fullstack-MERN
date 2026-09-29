import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import StockCard from "../components/StockCard";
import { getStocks } from "../api";

function Stocks() {

  const [search, setSearch] = useState("");
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getStocks().then(setStocks).catch((requestError) => setError(requestError.message));
  }, []);

  const filteredStocks = stocks.filter((stock) =>
    stock.name
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    stock.symbol
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>

      <div className="page-header">

        <div>
          <h1>Stocks</h1>
          <p>
            Explore and monitor market stocks.
          </p>
        </div>

      </div>

      <div className="search-box">

        <Search size={20} />

        <input
          type="text"
          placeholder="Search company or symbol..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      <div className="stock-grid">

        {error && <p className="error-message">{error}</p>}

        {filteredStocks.map((stock) => (

          <StockCard
            key={stock.symbol}
            {...stock}
          />

        ))}

      </div>

    </div>
  );
}

export default Stocks;