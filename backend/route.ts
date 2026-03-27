import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Id',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    
    let query;
    if (ObjectId.isValid(params.id)) {
      query = { _id: new ObjectId(params.id) };
    } else {
      query = { id: params.id }; // Fallback for string IDs
    }

    const audit = await db.collection('audits').findOne(query);

    if (!audit) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json(audit, { headers: corsHeaders() });
  } catch (error: any) {
    console.error('Get audit error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch audit' },
      { status: 500, headers: corsHeaders() }
    );
  }
}