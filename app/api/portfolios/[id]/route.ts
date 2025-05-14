/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../db/database.types";

export async function GET(request: Request, { params }: any) {
  try {
    const portfolioId = params.id;
    const cookieStore = cookies();
    const supabase = createServerComponentClient<Database>({
      cookies: () => cookieStore,
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: portfolio, error } = await supabase
      .from("portfolios")
      .select(
        `
        id,
        name,
        description,
        created_at,
        updated_at,
        portfolio_summary (
          total_positions,
          total_invested,
          current_value
        )
      `
      )
      .eq("id", portfolioId)
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch portfolio" },
        { status: 500 }
      );
    }

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: any) {
  try {
    const portfolioId = params.id;
    const cookieStore = cookies();
    const supabase = createServerComponentClient<Database>({
      cookies: () => cookieStore,
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name && !description) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const { data: portfolio, error } = await supabase
      .from("portfolios")
      .update({
        name: name,
        description: description,
      })
      .eq("id", portfolioId)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update portfolio" },
        { status: 500 }
      );
    }

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: any) {
  try {
    const portfolioId = params.id;
    const cookieStore = cookies();
    const supabase = createServerComponentClient<Database>({
      cookies: () => cookieStore,
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("portfolios")
      .delete()
      .eq("id", portfolioId);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to delete portfolio" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
