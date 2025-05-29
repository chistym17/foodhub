import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  console.log("token", token)

  return NextResponse.json({
    token: token || null,
    hasToken: !!token
  });
} 