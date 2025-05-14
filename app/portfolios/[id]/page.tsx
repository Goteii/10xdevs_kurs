"use client";

import { useParams } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import React, { useEffect, useState } from "react";
import AddCoinModal from "../../../components/portfolio/AddCoinModal";
import { Button } from "../../../components/ui/button";
import TransactionList from "../../../components/portfolio/TransactionList";
import PortfolioDetails from "../../../components/portfolio/PortfolioDetails";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";

const PortfolioPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [open, setOpen] = useState<boolean>(false);
  const [totalInvested, setTotalInvested] = useState<number>(0);

  useEffect(() => {
    if (user) {
      fetchPortfolios();
    }
  }, [user]);

  useEffect(() => {
    setTotalInvested(calculateTotalInvested(data));
  }, [data]);

  const fetchPortfolios = async () => {
    try {
      const response = await fetch(`/api/positions?portfolio_id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch portfolios");
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching portfolios:", error);
    }
  };

  const calculateTotalInvested = (portfolios): number => {
    return portfolios?.reduce((total, portfolio) => {
      return (
        total +
        portfolio?.transactions?.reduce((portfolioTotal, transaction) => {
          return portfolioTotal + transaction?.price * transaction?.amount;
        }, 0)
      );
    }, 0);
  };

  const handleAddCoin = async (data: {
    ticker: string;
    price: number;
    amount: number;
  }) => {
    const updatedData = {
      portfolio_id: id,
      cryptocurrency_id: data.ticker,
      transactions: [{ price: data.price, amount: data.amount }],
    };
    const response = await fetch(`/api/positions`, {
      method: "POST",
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error("Failed to add coin");
    }
    const res = await response.json();
    setData(res);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-gray-600 mt-2">Portfolio description</p>
        </div>

        <Button
          className="text-white"
          variant="outline"
          onClick={() => setOpen(!open)}
        >
          Add coin
        </Button>

        <AddCoinModal
          onAdd={(e) => handleAddCoin(e)}
          isOpen={open}
          onClose={() => setOpen(false)}
        />
      </div>

      <PortfolioDetails id={id} data={data} totalInvested={totalInvested} />

      <TransactionList data={data} />
    </div>
  );
};

export default PortfolioPage;
