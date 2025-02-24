import { createClient } from '../../../utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: patients, error } = await supabase.from("patients").select('*');

    if (error)  {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(patients, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}