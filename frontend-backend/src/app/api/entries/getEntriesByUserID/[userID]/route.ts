import { createClientAnonKey, createClientServiceRoleKey } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Select All Entries
export async function GET(req: NextRequest, context: { params: { userID: string } }) {
  try {
    const supabase = await createClientAnonKey();
    const { userID } = await context.params;

    if (!userID) {
      return NextResponse.json({ error: 'Missing User ID' }, { status: 400 });
    }

    const { data: entries, error } = await supabase
        .from("entries")
        .select('*')
        .eq("user_id", userID)
        .order("last_name", { ascending: true });

    if (error)  {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}