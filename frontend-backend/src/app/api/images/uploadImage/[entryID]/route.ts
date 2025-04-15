import { createClientAnonKey, createClientServiceRoleKey } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import dayjs from 'dayjs';

// Upload a new MRI image to the Supabase storage
export async function POST(req: NextRequest, context: { params: { entryID: string } }) {
    try {
        const supabase = await createClientServiceRoleKey();
        const { entryID } = await context.params;

        if (!entryID) {
            return NextResponse.json({ error: 'Missing Entry ID' }, { status: 400 });
        }

        // adding image to storage
        const formData = await req.formData();
        const files = formData.getAll('file') as File[];

        if (files.length === 0) return NextResponse.json({ error: 'No file found in request' }, { status: 400 });

        const today = dayjs().format('YYYY-MM-DD');
        const uplaodedImages: string[] = [];
        for (const file of files) {
            const filePath = `entry_${entryID}/${Date.now()}_${file.name}`;

            const { data, error } = await supabase.storage.from('scans').upload(filePath, file)
            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            // adding image to images table
            const { data: publicUrlData } = await supabase.storage.from('scans').getPublicUrl(filePath);
            const imageUrl = publicUrlData.publicUrl;

            const { error: insertError } = await supabase.from("images").insert({
                entry_id: entryID,
                image_link: imageUrl,
                date: today,
            });

            if (insertError) throw insertError;
        }
        return NextResponse.json({ message: "File uploaded successfully", images: uplaodedImages }, { status: 200 });


    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
