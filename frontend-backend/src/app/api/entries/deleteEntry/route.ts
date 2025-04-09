import { createClientAnonKey, createClientServiceRoleKey } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Automatically deletes the associated images from the 'images' table
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


        // delete images from scans storage
        const filePath = `entry_${entry_id}`;
        var filePaths = [];
        const { data, error: storageError } = await supabase.storage.from('scans').list(`${filePath}/`);

        if (storageError) {
            return NextResponse.json({ error: storageError.message }, { status: 500 });
        }

        for (const file of data) {
            filePaths.push(`entry_${entry_id}/${file.name}`);
        }

        const { data: removed, error: removeError } = await supabase
            .storage
            .from('scans')
            .remove(filePaths);

        if (removeError) {
            return NextResponse.json({ error: removeError.message }, { status: 500 });
        }


        return NextResponse.json({ message: "Entry deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
