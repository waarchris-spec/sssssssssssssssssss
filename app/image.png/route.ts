import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const imagePath = path.join(publicDir, 'image.png');

    if (fs.existsSync(imagePath)) {
      const buffer = fs.readFileSync(imagePath);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400, immutable',
        },
      });
    }

    // Check for logo.png fallback
    const logoPath = path.join(publicDir, 'logo.png');
    if (fs.existsSync(logoPath)) {
      const buffer = fs.readFileSync(logoPath);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400, immutable',
        },
      });
    }

    return new NextResponse('Official logo not yet uploaded to public/image.png', { status: 404 });
  } catch (error) {
    return new NextResponse('Internal error loading logo', { status: 500 });
  }
}
