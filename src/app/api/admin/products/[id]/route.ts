import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { createDbService } from '@/lib/db';

export const runtime = 'edge';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
    const product = await dbService.getProductById(parseInt(id));

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
      base_price?: string | number;
      price_unit?: string;
      available?: boolean;
      sort_order?: string | number;
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
    await dbService.updateProduct(parseInt(id), {
      name,
      slug,
      description,
      short_description,
      featured_image_id,
      category,
      sizes: JSON.stringify(sizes || []),
      base_price: parseFloat(base_price as string),
      price_unit,
      available,
      sort_order: parseInt(String(sort_order)) || 0
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const context = getRequestContext();
    if (!context?.env?.DB) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const data = await request.json() as { available?: boolean; sort_order?: string };
    const dbService = createDbService(context.env.DB);
    
    // For partial updates, we only update the fields provided
    const updateData: Record<string, unknown> = {};
    if ('available' in data) updateData.available = data.available;
    if ('sort_order' in data) updateData.sort_order = parseInt(String(data.sort_order));

    await dbService.updateProduct(parseInt(id), updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
    await dbService.deleteProduct(parseInt(id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}