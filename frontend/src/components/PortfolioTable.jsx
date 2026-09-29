function PortfolioTable({ holdings }) {

    return (
        <div className="table-container">

            <table className="portfolio-table">

                <thead>
                    <tr>
                        <th>Stock</th>
                        <th>Quantity</th>
                        <th>Buy Price</th>
                        <th>Current Price</th>
                        <th>Investment</th>
                        <th>Current Value</th>
                        <th>Profit / Loss</th>
                    </tr>
                </thead>

                <tbody>

                    {holdings.map((stock) => {

                        const investment =
                            (stock.buyPrice || 0) * (stock.quantity || 0);

                        const currentValue =
                            (stock.currentPrice || 0) * (stock.quantity || 0);

                        const profit =
                            currentValue - investment;

                        return (
                            <tr key={stock.symbol}>

                                <td>
                                    <strong>
                                        {stock.symbol}
                                    </strong>
                                </td>

                                <td>
                                    {stock.quantity}
                                </td>

                                <td>
                                    ₹{(stock.buyPrice || 0).toLocaleString("en-IN")}
                                </td>

                                <td>
                                    ₹{(stock.currentPrice || 0).toLocaleString("en-IN")}
                                </td>

                                <td>
                                    ₹{(investment || 0).toLocaleString("en-IN")}
                                </td>

                                <td>
                                    ₹{(currentValue || 0).toLocaleString("en-IN")}
                                </td>

                                <td
                                    className={
                                        profit >= 0
                                            ? "positive"
                                            : "negative"
                                    }
                                >
                                    {profit >= 0 ? "+" : "-"}
                                    ₹{Math.abs(profit || 0).toLocaleString("en-IN")}
                                </td>

                            </tr>
                        );

                    })}

                </tbody>

            </table>

        </div>
    );
}

export default PortfolioTable;