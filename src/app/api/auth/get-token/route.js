import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  console.log('Cookie store:', cookieStore);
  const token = cookieStore.get('token')?.value;
  
  return NextResponse.json({ 
    token: token || null,
    hasToken: !!token 
  });
} 