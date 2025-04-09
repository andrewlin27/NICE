import { createClientAnonKey, createClientServiceRoleKey } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from "next/server";

// Search user by email
export async function POST(req: NextRequest) {
  try {
      const supabase = await createClientAnonKey();
      const { userEmail } = await req.json(); // Get search term from request body

    const { data: userID, error } = await supabase
      .from("users")
      .select("user_id")
      .eq('email', userEmail);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(userID, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
