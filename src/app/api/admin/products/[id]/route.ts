import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { createDbService } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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
    const product = await dbService.getProductById(parseInt(params.id));

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
    await dbService.updateProduct(parseInt(params.id), {
      name,
      slug,
      description,
      short_description,
      featured_image_id,
      category,
      sizes: JSON.stringify(sizes || []),
      base_price: parseFloat(base_price),
      price_unit,
      available,
      sort_order: parseInt(sort_order) || 0
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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
    const dbService = createDbService(context.env.DB);
    
    // For partial updates, we only update the fields provided
    const updateData: any = {};
    if ('available' in data) updateData.available = data.available;
    if ('sort_order' in data) updateData.sort_order = parseInt(data.sort_order);

    await dbService.updateProduct(parseInt(params.id), updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
    await dbService.deleteProduct(parseInt(params.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}