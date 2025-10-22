import { NextRequest, NextResponse } from 'next/server';

const CTFD_BASE_URL = 'http://ethics.golomtbank.com:8001/api/v1';
const CTFD_TOKEN = 'ctfd_baac942af8073819f03340b1d2f96b37266c01040bcc118c04e9c05cdedab664';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || '/users';
    
    const response = await fetch(`${CTFD_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + CTFD_TOKEN
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
