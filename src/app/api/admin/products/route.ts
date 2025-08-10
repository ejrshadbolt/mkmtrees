import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { createDbService } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const context = getRequestContext();
    if (!context?.env?.DB) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const dbService = createDbService(context.env.DB);
    const products = await dbService.db.prepare('SELECT * FROM products ORDER BY sort_order ASC, created_at DESC')
      .all()
      .then((result: any) => result.results);

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const context = getRequestContext();
    if (!context?.env?.DB) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const data = await request.json();
    const {
      name,
      slug,
      description,
      short_description,
      featured_image_id,
      category,
      sizes,
      base_price,
      price_unit,
      available,
      sort_order
    } = data;

    // Validate required fields
    if (!name || !slug || !description || !category || base_price === undefined || !price_unit) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const dbService = createDbService(context.env.DB);
    const now = Math.floor(Date.now() / 1000);

    const result = await dbService.db.prepare(`
      INSERT INTO products (
        name, slug, description, short_description, featured_image_id,
        category, sizes, base_price, price_unit, available, sort_order,
        created_at, updated_at, created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        name,
        slug,
        description,
        short_description || null,
        featured_image_id || null,
        category,
        JSON.stringify(sizes || []),
        parseFloat(base_price),
        price_unit,
        available ? 1 : 0,
        parseInt(sort_order) || 0,
        now,
        now,
        1 // TODO: Use actual user ID from session
      )
      .run();

    return NextResponse.json({ 
      success: true, 
      id: result.meta.last_row_id 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}