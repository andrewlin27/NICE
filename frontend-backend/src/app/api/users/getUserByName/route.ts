import { createClientAnonKey, createClientServiceRoleKey } from '../../../../utils/supabase/server';
import { NextRequest, NextResponse } from "next/server";

// Search user by first_name or last_name
export async function POST(req: NextRequest) {
  try {
      const supabase = await createClientAnonKey();
      const { searchTerm } = await req.json(); // Get search term from request body
      let query = supabase.from("user").select('*');

    // If searchTerm is provided, filter by first_name or last_name
    if (searchTerm) {
      query = query.or(`first_name.ilike.%${searchTerm}%, last_name.ilike.%${searchTerm}%`);
    }

    const { data: entries, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
