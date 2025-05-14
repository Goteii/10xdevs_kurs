/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "../../../db/supabase";

const createPositionSchema = z.object({
  portfolio_id: z.string().uuid(),
  cryptocurrency_id: z.string().max(20),
  transactions: z.array(
    z.object({ price: z.number().positive(), amount: z.number().positive() })
  ),
  total_amount: z.number().positive().optional(),
  average_buy_price: z.number().positive().optional(),
  break_even_price: z.number().positive().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const portfolio_id = searchParams.get("portfolio_id");

    if (!portfolio_id) {
      return NextResponse.json(
        { error: "Portfolio ID is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("positions")
      .select("*")
      .eq("portfolio_id", portfolio_id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching positions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createPositionSchema.parse(body);

    const { data: position } = await supabase
      .from("positions")
      .select("*")
      .eq("portfolio_id", validatedData.portfolio_id)
      .eq("cryptocurrency_id", validatedData.cryptocurrency_id)
      .is("deleted_at", null)
      .single();

    if (position) {
      const transactions = [
        ...position.transactions,
        ...validatedData.transactions,
      ];
      const totalAmount = transactions.reduce(
        (sum: number, transaction: any) => sum + transaction.amount,
        0
      );
      const averageBuyPrice =
        totalAmount > 0 // Ensure we don't divide by zero
          ? transactions.reduce(
              (sum: number, transaction: any) =>
                sum + transaction.amount * transaction.price,
              0
            ) / totalAmount
          : 0; // Default to 0 if no transactions

      await supabase
        .from("positions")
        .update({
          ...position,
          total_amount: totalAmount,
          average_buy_price: averageBuyPrice,
          transactions: transactions,
        })
        .eq("id", position.id);
    } else {
      await supabase
        .from("positions")
        .insert([
          {
            ...validatedData,
            total_amount: validatedData.transactions[0].amount,
            average_buy_price: validatedData.transactions[0].price,
          },
        ])
        .select()
        .single();
    }

    const { data: positions, error: positionsError } = await supabase
      .from("positions")
      .select("*")
      .eq("portfolio_id", validatedData.portfolio_id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (positionsError) {
      if (positionsError.code === "23505") {
        return NextResponse.json(
          {
            error:
              "Position already exists for this cryptocurrency in the portfolio",
          },
          { status: 409 }
        );
      }
      throw positionsError;
    } else {
      return NextResponse.json(positions, { status: 201 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error creating position:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
