import { logger } from '@/utils/logger';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const DARK_VISITORS_ENDPOINT = 'https://api.darkvisitors.com/visits';
const ACCESS_TOKEN = process.env.DARK_VISITORS_ACCESS_TOKEN;

/**
 * Send visit data to Dark Visitors API
 * This is done in a non-blocking way to avoid adding latency
 */
function sendVisitData(request: NextRequest) {
    // Convert headers to a plain object
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
        headers[key] = value;
    });

    // Prepare the request body
    const visitData = {
        request_path: request.nextUrl.pathname,
        request_method: request.method,
        request_headers: headers
    };

    // Send the request without awaiting
    fetch(DARK_VISITORS_ENDPOINT, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(visitData)
    }).catch((error) => {
        // Silently log the error without affecting the response
        logger.error('Failed to send visit data to Dark Visitors', {
            error: error instanceof Error ? error.message : String(error),
            path: request.nextUrl.pathname,
            method: request.method
        });
    });
}

/**
 * Extract useful bot information from the request
 */
function extractBotInfo(request: NextRequest) {
    return {
        userAgent: request.headers.get('user-agent'),
        robotsTxt: request.headers.get('x-robots-tag'),
        referer: request.headers.get('referer'),
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        city: request.headers.get('x-vercel-ip-city'),
        country: request.headers.get('x-vercel-ip-country'),
        region: request.headers.get('x-vercel-ip-country-region')
    };
}

/**
 * Middleware function to handle all requests
 */
export async function middleware(request: NextRequest) {
    try {
        // Skip tracking for static files and API routes
        if (
            request.nextUrl.pathname.startsWith('/_next') ||
            request.nextUrl.pathname.startsWith('/static') ||
            request.nextUrl.pathname.startsWith('/api')
        ) {
            return NextResponse.next();
        }

        // Extract bot information for logging
        const botInfo = extractBotInfo(request);
        logger.debug('Processing request', {
            path: request.nextUrl.pathname,
            method: request.method,
            botInfo
        });

        // Send visit data to Dark Visitors (non-blocking)
        sendVisitData(request);

        // Add security headers
        const response = NextResponse.next();
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('X-XSS-Protection', '1; mode=block');
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // If it's a bot request (based on user-agent or other signals)
        if (botInfo.userAgent?.toLowerCase().includes('bot') ||
            botInfo.userAgent?.toLowerCase().includes('crawler')) {
            response.headers.set('X-Robots-Tag', 'noindex, nofollow');
            logger.info('Bot request detected', { botInfo });
        }

        return response;
    } catch (error) {
        // Log the error but don't block the request
        logger.error('Middleware error', {
            error: error instanceof Error ? error.message : String(error),
            path: request.nextUrl.pathname
        });
        return NextResponse.next();
    }
}

/**
 * Configure which paths the middleware should run on
 * We want to run on all paths except static files
 */
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
}; 