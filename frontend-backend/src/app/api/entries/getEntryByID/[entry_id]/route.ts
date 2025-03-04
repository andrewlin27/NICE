import { createClientAnonKey, createClientServiceRoleKey } from '../../../../../utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest, { params }: { params: { entry_id: string } }) {
    try{
        const supabase = await createClientAnonKey();
        const { entry_id } = params;

        if (!entry_id) {
            return NextResponse.json({ error: 'Missing entry_id' }, { status: 400 });
        }
        
        const { data, error } = await supabase
            .from('entries')
            .select('*')
            .eq('entry_id', entry_id);

        if (error || !data) {
            return NextResponse.json({ error: error?.message || 'Entry not found' }, { status: 404 });
        }

        return NextResponse.json(data, { status: 200 });
    
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
    
}
