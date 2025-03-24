import { createClientAnonKey, createClientServiceRoleKey } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from "next/server";

// Search entry by first_name or last_name
export async function POST(req: NextRequest) {
  try {
      const supabase = await createClientAnonKey();
      const { searchTerm } = await req.json(); // Get search term from request body
      const trimmedTerm = searchTerm.trim();
      let query = supabase.from("entries").select('*');

    // If searchTerm is provided, filter by first_name or last_name

    if (trimmedTerm) {
      const parts = trimmedTerm.trim().split(/\s+/);
      if (parts.length >= 2) {
        const first_name = parts[0];
        const last_name = parts.slice(1).join(" ");
        query = query
        .ilike("first_name", `%${first_name}%`)
        .ilike("last_name", `%${last_name}%`);
      } else {
        query = query.or(`first_name.ilike.%${trimmedTerm}%,last_name.ilike.%${trimmedTerm}%`);
      }
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
