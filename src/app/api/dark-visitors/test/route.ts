import { logger } from '@/utils/logger';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Test endpoint to verify crawler and AI agent detection
 * Tests both the middleware and Dark Visitors integration
 */
export async function GET(request: NextRequest) {
    try {
        // Extract all relevant headers for testing
        const headers = {
            userAgent: request.headers.get('user-agent'),
            robotsTxt: request.headers.get('x-robots-tag'),
            referer: request.headers.get('referer'),
            ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
            city: request.headers.get('x-vercel-ip-city'),
            country: request.headers.get('x-vercel-ip-country'),
            region: request.headers.get('x-vercel-ip-country-region'),
            // Add additional headers for bot detection
            secFetchMode: request.headers.get('sec-fetch-mode'),
            secChUa: request.headers.get('sec-ch-ua'),
            acceptLanguage: request.headers.get('accept-language'),
            acceptEncoding: request.headers.get('accept-encoding'),
            connection: request.headers.get('connection'),
            cookie: request.headers.get('cookie')
        };

        // Check if Dark Visitors token is configured
        const isDarkVisitorsConfigured = !!process.env.DARK_VISITORS_ACCESS_TOKEN;

        // Check for bot behavior based on header patterns
        const isBotByHeaders =
            // Missing essential browser headers
            (!headers.secChUa || !headers.acceptLanguage) ||
            // Unusual fetch mode for browser
            (headers.secFetchMode === 'navigate' && !headers.secChUa) ||
            // Missing or suspicious encoding
            (!headers.acceptEncoding || headers.acceptEncoding === '*/*') ||
            // No cookies in request (common for bots)
            !headers.cookie ||
            // Suspicious connection headers
            (headers.connection?.toLowerCase().includes('close')) ||
            // Check for common bot patterns in referer
            (headers.referer && /bot|crawler|spider|scraper/i.test(headers.referer));

        // Log the test request
        logger.info('Dark Visitors test request received', {
            headers,
            isBotByHeaders
        });

        return NextResponse.json({
            success: true,
            message: 'Dark Visitors test endpoint',
            isDarkVisitorsConfigured,
            requestInfo: {
                path: request.nextUrl.pathname,
                method: request.method,
                headers,
                // check for bots
                isBot: headers.userAgent?.toLowerCase().includes('bot') ||
                    headers.userAgent?.toLowerCase().includes('crawler') ||
                    headers.userAgent?.toLowerCase().includes('postman') ||
                    headers.userAgent?.toLowerCase().includes('runtime') ||
                    isBotByHeaders,
                // check for AI agents
                isAI:
                    // openai   
                    headers.userAgent?.toLowerCase().includes('chatgpt') ||
                    headers.userAgent?.toLowerCase().includes('Operator') ||
                    headers.userAgent?.toLowerCase().includes('chatgpt-user') ||
                    headers.userAgent?.toLowerCase().includes('gptbot') ||
                    headers.userAgent?.toLowerCase().includes('oai-searchbot') ||
                    // anthropic
                    headers.userAgent?.toLowerCase().includes('anthropic') ||
                    headers.userAgent?.toLowerCase().includes('claudebot') ||
                    // perplexity
                    headers.userAgent?.toLowerCase().includes('perplexitybot') ||
                    // google
                    headers.userAgent?.toLowerCase().includes('google-extended') ||
                    headers.userAgent?.toLowerCase().includes('googleother') ||
                    // bing
                    headers.userAgent?.toLowerCase().includes('bingbot') ||
                    // amazon
                    headers.userAgent?.toLowerCase().includes('amazonbot') ||
                    // apple
                    headers.userAgent?.toLowerCase().includes('applebot') ||
                    // you
                    headers.userAgent?.toLowerCase().includes('youbot') ||
                    // phind
                    headers.userAgent?.toLowerCase().includes('phindbot') ||
                    // exa
                    headers.userAgent?.toLowerCase().includes('exabot')
            },
            testInstructions: {
                curl: `curl -X GET "${request.nextUrl.origin}/api/dark-visitors/test" -H "User-Agent: MyTestBot/1.0"`,
                aiAgent: `curl -X GET "${request.nextUrl.origin}/api/dark-visitors/test" -H "User-Agent: ChatGPT-User/1.0"`,
                regularUser: `curl -X GET "${request.nextUrl.origin}/api/dark-visitors/test"`,
                postmanBot: `curl -X GET "${request.nextUrl.origin}/api/dark-visitors/test" -H "User-Agent: PostmanRuntime/7.32.3"`,
                googleBot: `curl -X GET "${request.nextUrl.origin}/api/dark-visitors/test" -H "User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"`
            }
        });
    } catch (error) {
        logger.error('Dark Visitors test failed', {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        });

        return NextResponse.json({
            success: false,
            error: 'Test failed',
            message: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
} 