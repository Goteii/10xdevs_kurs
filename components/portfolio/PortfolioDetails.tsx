"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { PortfolioDetailsDto } from "../../types/types";

interface PortfolioDetailsProps {
  data: PortfolioDetailsDto[];
  totalInvested: number;
}

const PortfolioDetails: React.FC<PortfolioDetailsProps> = ({
  data,
  totalInvested,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Total Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{data?.length || 0}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Invested</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalInvested} $</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioDetails;
