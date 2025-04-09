import { createClientAnonKey, createClientServiceRoleKey } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Insert a new user
export async function POST(req: NextRequest) {
    try {
        const supabase = await createClientServiceRoleKey();
        const { userEmail } = await req.json(); 
        if (!userEmail) {
            return NextResponse.json({ error: 'Missing User Email' }, { status: 400 });
        }

        // Check if the user already exists
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('*')
            .eq('email', userEmail);
        
        if (checkError) {
            throw checkError;
        }

        // Create new user if not exists
        if (existingUser.length === 0) {
            const { error: insertError } = await supabase
                .from("users")
                .insert({ email: userEmail })
                ;
        
            if (insertError) {
                throw insertError;
            }   

            return NextResponse.json({ message: "Entry added successfully" }, { status: 201 }); // Success response
        }
        // If user already exists, return a message
        else {
            return NextResponse.json({message: "User already exists" }, { status: 200 }); // Success response
        }

    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
