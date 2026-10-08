import Stock from "../models/stockModel.js";

const getStockList = async () => Stock.find()
  .select("name symbol price change -_id")
  .sort({ price: -1, symbol: 1 })
  .lean();

const getStocks = async (req, res) => {
  try {
    const stocks = await getStockList();
    return res.status(200).json(stocks);
  } catch (error) {
    console.error("Unable to load stocks:", error);
    return res.status(500).json({ message: "Unable to load stocks" });
  }
};

const getStock = async (req, res) => {
  try {
    const stock = await Stock.findOne({
      symbol: req.params.symbol.toUpperCase(),
    })
      .select("name symbol price change -_id")
      .lean();

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    return res.status(200).json(stock);
  } catch (error) {
    console.error("Unable to load stock:", error);
    return res.status(500).json({ message: "Unable to load stock" });
  }
};

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);

const renderStocksPage = async (req, res) => {
  try {
    const stocks = await getStockList();
    const gainers = stocks.filter((stock) => stock.change > 0).length;
    const losers = stocks.filter((stock) => stock.change < 0).length;
    const rows = stocks.map((stock) => {
      const changeClass = stock.change >= 0 ? "positive" : "negative";
      const changeSign = stock.change > 0 ? "+" : "";
      return `<tr data-name="${escapeHtml(stock.name.toLowerCase())}" data-symbol="${escapeHtml(stock.symbol.toLowerCase())}" data-price="${stock.price}">
        <td><strong>${escapeHtml(stock.name)}</strong></td>
        <td><span class="ticker">${escapeHtml(stock.symbol)}</span></td>
        <td class="price">₹${new Intl.NumberFormat("en-IN").format(stock.price)}</td>
        <td class="${changeClass}">${changeSign}${stock.change.toFixed(2)}%</td>
      </tr>`;
    }).join("");

    return res.type("html").send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f4f7fc">
  <title>Stocks | StockMarket</title>
  <style>
    :root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:#172640;background:#f4f7fc;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased}
    *{box-sizing:border-box}body{margin:0;min-width:320px;background:radial-gradient(ellipse at 90% 0%,#e4edff 0,transparent 35%),#f4f7fc}
    .shell{width:min(1120px,calc(100% - 40px));margin:48px auto}.hero{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:28px;border:1px solid #dce6fa;border-radius:22px;background:linear-gradient(115deg,#fff,#f1f6ff);box-shadow:0 14px 34px #233f7510}
    .eyebrow{font-size:11px;font-weight:800;letter-spacing:.13em;text-transform:uppercase;color:#5574bb}.hero h1{margin:8px 0;font-size:clamp(30px,5vw,42px);letter-spacing:-.05em}.hero p{margin:0;color:#73819a}.live{white-space:nowrap;padding:9px 12px;border-radius:99px;background:#e9f8f1;color:#17845e;font-size:12px;font-weight:750}.live:before{content:"";display:inline-block;width:7px;height:7px;margin-right:8px;border-radius:50%;background:#24ae79}
    .stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px;margin:20px 0}.stat{padding:19px 21px;border:1px solid #e1e8f2;border-radius:16px;background:#fff;box-shadow:0 9px 24px #233f7509}.stat span{display:block;color:#79869b;font-size:12px;font-weight:650}.stat strong{display:block;margin-top:7px;font-size:25px;letter-spacing:-.04em}.green{color:#16845d}.red{color:#cd4a61}
    .panel{overflow:hidden;border:1px solid #e1e8f2;border-radius:18px;background:#fff;box-shadow:0 12px 30px #233f750b}.toolbar{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:21px 22px}.toolbar h2{margin:0;font-size:17px;letter-spacing:-.02em}.toolbar p{margin:5px 0 0;color:#8290a5;font-size:12px}.controls{display:flex;gap:9px;align-items:center}.search{width:min(280px,45vw);height:40px;padding:0 12px;border:1px solid #dfe6f1;border-radius:10px;font:inherit;font-size:12px;outline:0}.search:focus{border-color:#86a4ed;box-shadow:0 0 0 3px #416ce21a}.sort{height:40px;padding:0 13px;border:1px solid #dfe6f1;border-radius:10px;background:#fff;color:#40516b;font:inherit;font-size:12px;font-weight:700;cursor:pointer}.sort:hover{background:#f5f8ff}
    .table-wrap{overflow-x:auto}table{width:100%;min-width:610px;border-collapse:collapse}th{text-align:left;padding:13px 20px;border-top:1px solid #edf1f7;border-bottom:1px solid #e9eef6;background:#f8faff;color:#7e8ba0;font-size:10px;letter-spacing:.08em;text-transform:uppercase}td{padding:15px 20px;border-bottom:1px solid #f0f3f8;font-size:13px}tbody tr:last-child td{border-bottom:0}tbody tr:hover{background:#f8faff}td strong{font-size:13px}.ticker{display:inline-flex;padding:5px 8px;border-radius:7px;background:#edf3ff;color:#4266ca;font-size:10px;font-weight:800;letter-spacing:.05em}.price{font-weight:750;color:#273853}.positive,.negative{font-weight:750}.positive{color:#16845d}.negative{color:#cd4a61}.empty{display:none;padding:36px;text-align:center;color:#8290a5;font-size:13px}
    @media(max-width:650px){.shell{width:calc(100% - 24px);margin:20px auto}.hero{align-items:flex-start;padding:21px;flex-direction:column}.stats{gap:9px}.stat{padding:14px}.stat strong{font-size:20px}.toolbar{align-items:stretch;flex-direction:column;padding:17px}.controls{width:100%}.search{width:100%;flex:1}.sort{white-space:nowrap}}
  </style>
</head>
<body>
  <main class="shell">
    <header class="hero">
      <div><span class="eyebrow">Market directory</span><h1>Explore stocks</h1><p>Market prices and daily movements at a glance.</p></div>
      <span class="live">Market overview</span>
    </header>
    <section class="stats" aria-label="Stock market summary">
      <div class="stat"><span>Total stocks</span><strong id="total-count">${stocks.length}</strong></div>
      <div class="stat"><span>Gainers</span><strong class="green" id="gainer-count">${gainers}</strong></div>
      <div class="stat"><span>Decliners</span><strong class="red" id="loser-count">${losers}</strong></div>
    </section>
    <section class="panel">
      <div class="toolbar"><div><h2>Stock list</h2><p>Search by company name or ticker symbol.</p></div><div class="controls"><input id="search" class="search" type="search" placeholder="Search stocks…" aria-label="Search by company or ticker"><button id="sort" class="sort" type="button" aria-pressed="true">Price: high to low</button></div></div>
      <div class="table-wrap"><table><thead><tr><th>Company</th><th>Ticker</th><th>Price</th><th>Change</th></tr></thead><tbody id="stocks">${rows}</tbody></table></div>
      <p id="empty" class="empty">No stocks match your search.</p>
    </section>
  </main>
  <script>
    const body=document.getElementById("stocks");
    const rows=Array.from(body.querySelectorAll("tr"));
    const search=document.getElementById("search");
    const empty=document.getElementById("empty");
    const sortButton=document.getElementById("sort");
    let descending=true;
    function update(){const query=search.value.trim().toLowerCase();let visible=0;for(const row of rows){const match=row.dataset.name.includes(query)||row.dataset.symbol.includes(query);row.hidden=!match;if(match)visible++;}empty.style.display=visible?"none":"block";}
    search.addEventListener("input",update);
    sortButton.addEventListener("click",()=>{descending=!descending;rows.sort((a,b)=>(Number(a.dataset.price)-Number(b.dataset.price))*(descending?-1:1));for(const row of rows)body.appendChild(row);sortButton.textContent=descending?"Price: high to low":"Price: low to high";sortButton.setAttribute("aria-pressed",String(descending));update();});
  </script>
</body>
</html>`);
  } catch (error) {
    console.error("Unable to render stock page:", error);
    return res.status(500).type("text").send("Unable to load the stock page");
  }
};

export { getStock, getStocks, renderStocksPage };
