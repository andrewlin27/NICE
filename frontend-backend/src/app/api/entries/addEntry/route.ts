import { createClientAnonKey } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Insert a new entry
export async function POST(req: Request) {
    try {
      const supabase = await createClientAnonKey();
      const { first_name, last_name, dob, user_id } = await req.json(); // Parse request body
  
      // Insert data into 'entries' table
      const { data, error } = await supabase
        .from("entries")
        .insert([{ first_name, last_name, dob, user_id }])
        ;
  
      if (error) throw error;
  
      return NextResponse.json({ data }, { status: 201 }); // Success response
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
  }
  