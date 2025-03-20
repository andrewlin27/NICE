import { createClientAnonKey, createClientServiceRoleKey } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Delete an entry
export async function DELETE(req: Request) {
    try {
        const supabase = await createClientServiceRoleKey();
        const { entry_id } = await req.json(); // Parse request body to get entry ID

        if (!entry_id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        // Delete entry from 'entries' table
        const { error } = await supabase
            .from("entries")
            .delete()
            .eq("entry_id", entry_id);

        if (error) throw error;

        return NextResponse.json({ message: "Entry deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
