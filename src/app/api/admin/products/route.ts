import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { createDbService } from '@/lib/db';

export const runtime = 'edge';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const context = getRequestContext();
    if (!context?.env?.DB) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const dbService = createDbService(context.env.DB);
    const products = await dbService.getAllProducts();

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const context = getRequestContext();
    if (!context?.env?.DB) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const data = await request.json() as {
      name?: string;
      slug?: string;
      description?: string;
      short_description?: string;
      featured_image_id?: number;
      category?: string;
      sizes?: string[];
      base_price?: string;
      price_unit?: string;
      available?: boolean;
      sort_order?: string;
    };
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
    
    const productId = await dbService.createProduct({
      name,
      slug,
      description,
      short_description,
      featured_image_id,
      category,
      sizes: JSON.stringify(sizes || []),
      base_price: parseFloat(base_price as string),
      price_unit,
      available: available || false,
      sort_order: parseInt(sort_order as string) || 0
    });

    return NextResponse.json({ 
      success: true, 
      id: productId 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}