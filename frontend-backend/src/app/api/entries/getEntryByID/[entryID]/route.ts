import { createClientAnonKey, createClientServiceRoleKey } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// context object is where dynamic route parameters (params) are passed
export async function GET(req: NextRequest, context: { params: { entryID: string } }) {
    try{
        const supabase = await createClientAnonKey();
        const { entryID } = await context.params;

        if (!entryID) {
            return NextResponse.json({ error: 'Missing Entry ID' }, { status: 400 });
        }
        
        const { data: entry, error }: { data: any; error: any } = await supabase
            .from('entries')
            .select('*')
            .eq('entry_id', entryID);
        
        if (entry.length === 0) {
            return NextResponse.json({ error: `Entry ID ${entryID} not found` }, { status: 404 });
        }

        if (error) {
            return NextResponse.json({ error: error.message}, { status: 500 });
        }

        return NextResponse.json(entry, { status: 200 });
    
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
     
}
