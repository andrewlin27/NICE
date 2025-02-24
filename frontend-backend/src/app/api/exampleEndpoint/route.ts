import { NextResponse } from "next/server";

// http://localhost:3000/api/exampleEndpoint
export async function GET() {
    // retrieve data from db

    return NextResponse.json({ message: 'data from backend' });
}

// http://localhost:3000/api/exampleEndpoint
export async function POST(request: Request) {
    const body = await request.json();
    
    // save data to db

    return NextResponse.json({ 
        message: 'data saved',
        data: body,
        status:200
    });
}