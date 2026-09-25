import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const imagePath = path.join(publicDir, 'image.png');
    const logoPath = path.join(publicDir, 'logo.png');

    const targetPath = fs.existsSync(imagePath) ? imagePath : fs.existsSync(logoPath) ? logoPath : null;

    if (targetPath) {
      const buffer = fs.readFileSync(targetPath);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400, immutable',
        },
      });
    }

    return new NextResponse('Logo asset pending', { status: 404 });
  } catch (error) {
    return new NextResponse('Internal error loading logo', { status: 500 });
  }
}
