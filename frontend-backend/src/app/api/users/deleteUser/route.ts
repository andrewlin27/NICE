import { createClientAnonKey, createClientServiceRoleKey } from '../../../../utils/supabase/server';
import { NextResponse } from 'next/server';

// Delete a user
export async function DELETE(req: Request) {
    try {
        const supabase = await createClientServiceRoleKey();
        const { user_id } = await req.json(); // Parse request body to get user ID

        if (!user_id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Delete user from 'users' table
        const { error } = await supabase
            .from("users")
            .delete()
            .eq("user_id", user_id);

        if (error) throw error;

        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
