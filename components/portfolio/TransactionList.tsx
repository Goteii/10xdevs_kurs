"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PortfolioDetailsDto } from "../../types/types";

interface TransactionListProps {
  data: PortfolioDetailsDto[];
}

const TransactionList: React.FC<TransactionListProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Coins</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data?.map((coin) => (
            <div
              key={coin.id}
              className="flex flex-col p-4 border rounded-lg cursor-pointer"
              onClick={() => {
                const accordion = document.getElementById(
                  `accordion-${coin.id}`
                );
                if (accordion) {
                  accordion.classList.toggle("hidden");
                }
              }}
            >
              <div className="flex items-center justify-between">
                <h3 data-testid="ticker" className="font-semibold">
                  {coin.cryptocurrency_id}
                </h3>
                <div className="text-right">
                  <p data-testid="amount" className="font-semibold">
                    {coin.total_amount} {coin.cryptocurrency_id}
                  </p>
                  <p data-testid="price" className="text-sm text-gray-600">
                    ${coin.average_buy_price.toFixed(2)} USDT
                  </p>
                </div>
              </div>
              <div id={`accordion-${coin.id}`} className="hidden mt-2">
                {coin.transactions.length > 0 ? (
                  coin.transactions.map((transaction, index) => (
                    <div
                      key={index}
                      className="border-b py-2 flex flex-row-reverse justify-start gap-10"
                    >
                      <p>
                        Price: $
                        {(transaction.price * transaction.amount).toFixed(2)}
                      </p>
                      <p>Amount: {transaction.amount}</p>
                    </div>
                  ))
                ) : (
                  <p>No Transactions</p>
                )}
              </div>
            </div>
          ))}
          {(!data || data.length === 0) && (
            <p className="text-center text-gray-600 py-4">No coins added yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionList;
