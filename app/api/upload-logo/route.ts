import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('logo') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No logo file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Save as both /image.png and /logo.png
    fs.writeFileSync(path.join(publicDir, 'image.png'), buffer);
    fs.writeFileSync(path.join(publicDir, 'logo.png'), buffer);

    const base64Data = `data:${file.type || 'image/png'};base64,${buffer.toString('base64')}`;

    return NextResponse.json({
      success: true,
      message: 'Official brand logo successfully saved to public/image.png and public/logo.png',
      path: '/image.png',
      dataUrl: base64Data,
    });
  } catch (error) {
    console.error('Error saving logo:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save logo' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const imagePath = path.join(publicDir, 'image.png');

    if (fs.existsSync(imagePath)) {
      const buffer = fs.readFileSync(imagePath);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    return NextResponse.json({ exists: false, path: '/image.png' });
  } catch (error) {
    return NextResponse.json({ error: 'Could not check logo' }, { status: 500 });
  }
}
