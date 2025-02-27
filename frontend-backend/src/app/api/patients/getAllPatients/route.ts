import { createClientAnonKey } from '../../../../utils/supabase/server';
import { NextResponse } from 'next/server';

// Select All Patients
export async function GET() {
  try {
    const supabase = await createClientAnonKey();
    const { data: patients, error } = await supabase.from("patients").select('*');

    if (error)  {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(patients, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}