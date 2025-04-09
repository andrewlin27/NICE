// The same functionality can be found in userLogIn

import { createClientAnonKey, createClientServiceRoleKey } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Insert a new user
export async function POST(req: Request) {
    try {
      const supabase = await createClientServiceRoleKey();
      const { email } = await req.json(); // Parse request body
  
      // Insert data into 'entries' table
      const { data, error } = await supabase
        .from("users")
        .insert([{ email }])
        ;
  
      if (error) throw error;
  
      return NextResponse.json({ message: "Entry added successfully"  }, { status: 201 }); // Success response
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
  }
  