import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const courseId = url.searchParams.get('courseId');
  const lessonId = url.searchParams.get('lessonId');

  if (!courseId || !lessonId) {
    return new NextResponse('Missing courseId or lessonId', { status: 400 });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`http://localhost:3000/courses/${courseId}/${lessonId}`, { waitUntil: 'networkidle2' });

    await page.$$eval('header, footer, .hide, .checkbox', els => els.forEach(el => el.remove()));

    await page.setViewport({ width: 1200, height: 800 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="lesson.pdf"',
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new NextResponse('Failed to generate PDF', { status: 500 });
  }
}
