//Transaction
import { useEffect, useState } from "react";
import { getTransactions } from "../api";

function Transactions() {

    const [filter, setFilter] = useState("ALL");

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        getTransactions().then(setTransactions).catch(() => {});
    }, []);

    /* const transactions = [
        {
            id: 1,
            date: "19 Aug 2026",
            stock: "TCS",
            company: "Tata Consultancy Services",
            type: "BUY",
            quantity: 10,
            price: 3500,
            total: 35000
        },

        {
            id: 2,
            date: "18 Aug 2026",
            stock: "INFY",
            company: "Infosys",
            type: "BUY",
            quantity: 20,
            price: 1500,
            total: 30000
        },

        {
            id: 3,
            date: "17 Aug 2026",
            stock: "TCS",
            company: "Tata Consultancy Services",
            type: "SELL",
            quantity: 5,
            price: 3750,
            total: 18750
        },

        {
            id: 4,
            date: "16 Aug 2026",
            stock: "RELIANCE",
            company: "Reliance Industries",
            type: "BUY",
            quantity: 15,
            price: 1400,
            total: 21000
        },

        {
            id: 5,
            date: "15 Aug 2026",
            stock: "HDFC",
            company: "HDFC Bank",
            type: "SELL",
            quantity: 5,
            price: 1700,
            total: 8500
        }
    ]; */

    const filteredTransactions =
        filter === "ALL"
            ? transactions
            : transactions.filter(
                transaction =>
                    transaction.type === filter
            );

    return (
        <div className="transactions-page">

            <div className="page-header">

                <div>

                    <h1>
                        Transactions
                    </h1>

                    <p>
                        View your complete
                        trading history.
                    </p>

                </div>

                <select
                    value={filter}
                    onChange={(e) =>
                        setFilter(e.target.value)
                    }
                >

                    <option value="ALL">
                        All Transactions
                    </option>

                    <option value="BUY">
                        Buy
                    </option>

                    <option value="SELL">
                        Sell
                    </option>

                </select>

            </div>


            {/* Summary */}

            <div className="stats-grid">

                <div className="stat-card">

                    <span>Total Transactions</span>

                    <h2>
                        {transactions.length}
                    </h2>

                </div>

                <div className="stat-card">

                    <span>Buy Orders</span>

                    <h2>
                        {
                            transactions.filter(
                                t => t.type === "BUY"
                            ).length
                        }
                    </h2>

                </div>

                <div className="stat-card">

                    <span>Sell Orders</span>

                    <h2>
                        {
                            transactions.filter(
                                t => t.type === "SELL"
                            ).length
                        }
                    </h2>

                </div>

                <div className="stat-card">

                    <span>Total Trading Value</span>

                    <h2>
                        ₹{transactions.reduce((total, transaction) => total + (transaction.amount || 0), 0).toLocaleString("en-IN")}
                    </h2>

                </div>

            </div>


            {/* Transactions table */}

            <div className="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Date</th>
                            <th>Stock</th>
                            <th>Type</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredTransactions.map(
                            transaction => (

                                <tr key={transaction.id}>

                                    <td>
                                        {transaction.date}
                                    </td>

                                    <td>

                                        <strong>
                                            {transaction.stock}
                                        </strong>

                                        <small>
                                            {transaction.company}
                                        </small>

                                    </td>

                                    <td>

                                        <span
                                            className={
                                                transaction.type === "BUY"
                                                    ? "transaction-buy"
                                                    : "transaction-sell"
                                            }
                                        >

                                            {transaction.type}

                                        </span>

                                    </td>

                                    <td>
                                        {transaction.quantity || 0}
                                    </td>

                                    <td>
                                        ₹
                                        {(transaction.price || 0).toLocaleString(
                                            "en-IN"
                                        )}
                                    </td>

                                    <td>
                                        ₹
                                        {(transaction.amount || 0).toLocaleString(
                                            "en-IN"
                                        )}
                                    </td>

                                    <td>

                                        <span className="status-success">
                                            Completed
                                        </span>

                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default Transactions;