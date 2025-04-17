import { createClientServiceRoleKey } from '@//utils/supabase/server';
import { error } from 'console';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, { params }: { params: { imageID: string[] } }) {
  try {
    const supabase = await createClientServiceRoleKey();
    // const { imageID } = context.params;
    const { imageID } = await params; // ids is an array of image IDs
    const idStrings = Array.isArray(imageID) ? imageID : [imageID];
    console.log(`Deleting images with IDs: ${imageID}`);


    const imageIds = idStrings.map((id) => parseInt(id, 10)).filter((id): id is number => !isNaN(id));


    if (imageIds.length === 0) {
      return NextResponse.json({ error: 'Invalid image IDs' }, { status: 400 });
    }

    // delete from storage
    const { data: imageData, error: fetchError } = await supabase
      .from('images')
      .select('image_link')
      .in('image_id', imageIds)

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const pathsToRemove: string[] = []
    for (const row of imageData) {
      // assuming image_link is something like https://.../scans/my-file.jpg
      const parts = row.image_link.split('/scans/')
      if (parts[1]) {
        pathsToRemove.push(parts[1])
      }
    }

    const { error: removeError } = await supabase
      .storage
      .from('scans')
      .remove(pathsToRemove)

    if (removeError) {
      return NextResponse.json({ error: removeError.message }, { status: 500 });
    }

    // delete from images table
    const { error: deleteError } = await supabase
      .from('images')
      .delete()
      .in('image_id', imageIds);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
