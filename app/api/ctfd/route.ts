import { NextRequest, NextResponse } from 'next/server';

const CTFD_BASE_URL = 'http://ethics.golomtbank.com/api/v1';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || '/users';
    
    const response = await fetch(`${CTFD_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': 'session=55751fe3-d0d8-48e2-bae0-d9c5f090d5c0.OITgSjaN-RYThPPtTcTvWxXG0js; __next_hmr_refresh_hash__=213a83fa580598a506a04fe99b71dc60633457081244afec',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || `HTTP error! status: ${response.status}` },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from CTFd API' },
      { status: 500 }
    );
  }
}
