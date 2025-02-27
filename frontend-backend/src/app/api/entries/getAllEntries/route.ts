import { createClientAnonKey } from '../../../../utils/supabase/server';
import { NextResponse } from 'next/server';

// Select All Entries
export async function GET() {
  try {
    const supabase = await createClientAnonKey();
    const { data: entries, error } = await supabase.from("entries").select('*');

    if (error)  {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}