import { createClientServiceRoleKey } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
    try {
        const supabase = await createClientServiceRoleKey();
        const { firstName, userId } = await request.json();

        if (!firstName) {
            return NextResponse.json({ error: 'Missing name for update' }, { status: 400 });
        }
        if (!userId) {
            return NextResponse.json({ error: 'Missing user id for update' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("entries")
            .update({"user_id": userId})
            .ilike("first_name", firstName);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
