import { NextResponse, NextRequest } from 'next/server';
export function middleware(request: NextRequest) {

    const { pathname } = request.nextUrl;
    console.log(" middleware request: =====", pathname);
    if (pathname.toString().startsWith("/link") || pathname.toString().startsWith("/short")) {
        request.nextUrl.pathname = '/api' + pathname;
    }
    console.log("changed : ", request.nextUrl.pathname.toString());
    return NextResponse.rewrite(request.nextUrl);
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/link/:raw*', '/short/:raw*'],
}