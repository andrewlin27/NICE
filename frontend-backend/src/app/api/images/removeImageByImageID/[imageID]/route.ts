import { createClientServiceRoleKey } from '@//utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, context: { params: { imageID: number } }) {
  try {
    const supabase = await createClientServiceRoleKey();
    const { imageID } = context.params;

    if (!imageID) {
      return NextResponse.json({ error: 'Missing Image ID' }, { status: 400 });
    }

    // delete from storage
    // get the image link by imageID from the images table
    const { data: imageData, error: fetchError } = await supabase
      .from('images')
      .select('image_link')
      .eq('image_id', imageID)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    var image_link = imageData.image_link;
    const image_path = image_link.split('scans/').pop(); // Extract the file name from the URL
    const { data, error } = await supabase
      .storage
      .from('scans')
      .remove([image_path])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // delete from images table
    const { error: deleteError } = await supabase
      .from('images')
      .delete()
      .eq('image_id', imageID);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
