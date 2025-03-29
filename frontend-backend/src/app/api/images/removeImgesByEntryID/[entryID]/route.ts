import { createClientServiceRoleKey } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, context: { params: { entryID: string } }) {
  try {
    const supabase = await createClientServiceRoleKey();
    const { entryID } = context.params;

    if (!entryID) {
      return NextResponse.json({ error: 'Missing Entry ID' }, { status: 400 });
    }

    const { error: deleteError } = await supabase
      .from('images')
      .delete()
      .eq('entry_id', entryID);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Image(s) deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
