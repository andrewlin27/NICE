import { createClientServiceRoleKey } from '@//utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, context: { params: { imageID: number } }) {
  try {
    const supabase = await createClientServiceRoleKey();
    const { imageID } = context.params;

    if (!imageID) {
      return NextResponse.json({ error: 'Missing Image ID' }, { status: 400 });
    }

    const { error: deleteError } = await supabase
      .from('images')
      .delete()
      .eq('image_id', imageID);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Image deleted successfully'}, { status: 200 });
  
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
