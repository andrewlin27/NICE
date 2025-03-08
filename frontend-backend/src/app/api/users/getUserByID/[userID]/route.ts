import { createClientAnonKey, createClientServiceRoleKey } from '../../../../../utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// context object is where dynamic route parameters (params) are passed
export async function GET(req: NextRequest, context: { params: { userID: string } }) {
    try{
        const supabase = await createClientAnonKey();
        const { userID } = await context.params;

        if (!userID) {
            return NextResponse.json({ error: 'Missing User ID' }, { status: 400 });
        }
        
        const { data: user, error }: { data: any; error: any } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', userID);
        
        if (user.length === 0) {
            return NextResponse.json({ error: `User ID ${userID} not found` }, { status: 404 });
        }

        if (error) {
            return NextResponse.json({ error: error.message}, { status: 500 });
        }

        return NextResponse.json(user, { status: 200 });
    
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
     
}
