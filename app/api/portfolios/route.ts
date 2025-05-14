import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "../../../db/supabase";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("sb-access-token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { data: portfolios, error } = await supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch portfolios" },
        { status: 500 }
      );
    }

    return NextResponse.json(portfolios);
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("sb-access-token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Portfolio name is required" },
        { status: 400 }
      );
    }

    const { data: portfolio, error } = await supabase
      .from("portfolios")
      .insert({ name, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      if (error.code === "42501") {
        return NextResponse.json(
          { error: "Permission denied. Please check your database policies." },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: "Failed to create portfolio" },
        { status: 500 }
      );
    }

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("Error creating portfolio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
