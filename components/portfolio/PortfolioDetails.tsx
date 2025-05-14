"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface PortfolioDetailsProps {
  id: string;
  data: any; // Replace with the appropriate type
  totalInvested: number;
}

const PortfolioDetails: React.FC<PortfolioDetailsProps> = ({
  id,
  data,
  totalInvested,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          <p className="text-2xl font-bold">
            {/* ${data.portfolio_summary.total_invested?.toFixed(2) || "0.00"} */}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Current Value</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {/* ${data.portfolio_summary.current_value?.toFixed(2) || "0.00"} */}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioDetails;
