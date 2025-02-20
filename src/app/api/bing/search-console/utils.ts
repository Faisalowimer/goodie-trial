import { logger } from '@/utils/logger';
import { XMLParser } from 'fast-xml-parser';
import { BingApiResponse, BingQueryParams, BingRawResponse, BingRankAndTrafficStats } from './types';
import { saveToJsonFile as saveData } from '@/utils/dataSaving';

// Endpoint to use the SOAP protocol
const BING_API_ENDPOINT = 'https://www.bing.com/webmasterapi/api.svc/soap';

const xmlParser = new XMLParser();

// SOAP request template updated to match WSDL
const createSoapEnvelope = (params: BingQueryParams) => `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Body>
    <GetRankAndTrafficStats xmlns="http://schemas.datacontract.org/2004/07/Microsoft.Bing.Webmaster.Api">
      <siteUrl>${params.siteUrl}</siteUrl>
      <startDate>${params.startDate}</startDate>
      <endDate>${params.endDate}</endDate>
    </GetRankAndTrafficStats>
  </soap:Body>
</soap:Envelope>`;

export async function fetchBingData(params: BingQueryParams): Promise<BingApiResponse> {
    try {
        logger.debug('Preparing to fetch Bing Webmaster data', { params });

        // Validate required environment variables
        if (!process.env.BING_API_KEY) {
            throw new Error('BING_API_KEY environment variable is not set');
        }
        if (!params.siteUrl) {
            throw new Error('Site URL is required but not provided');
        }

        // Validate dates
        const startDate = new Date(params.startDate);
        const endDate = new Date(params.endDate);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error('Invalid date format');
        }

        // Create SOAP envelope
        const soapEnvelope = createSoapEnvelope(params);

        // Construct URL with API key as per WSDL
        const apiUrl = `${BING_API_ENDPOINT}?apikey=${process.env.BING_API_KEY}`;

        logger.debug('Making Bing API request', {
            endpoint: apiUrl,
            method: 'POST',
            soapEnvelope
        });

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': 'http://schemas.datacontract.org/2004/07/Microsoft.Bing.Webmaster.Api/IWebmasterApi/GetRankAndTrafficStats'
            },
            body: soapEnvelope
        });

        const responseText = await response.text();
        logger.debug('Bing API raw response', { responseText });

        if (!response.ok) {
            logger.error('Bing API error response', {
                status: response.status,
                statusText: response.statusText,
                errorBody: responseText
            });
            throw new Error(`Bing API request failed: ${response.status} ${responseText}`);
        }

        // Parse SOAP response
        const rawData = parseSoapResponse(responseText);

        logger.info('Successfully fetched Bing data', {
            rowCount: rawData.length,
            dateRange: `${params.startDate} to ${params.endDate}`,
            sampleRow: rawData.length > 0 ? rawData[0] : null
        });

        // Transform the data
        const transformedData = rawData.map(row => ({
            date: row.Date,
            impressions: Number(row.Impressions || 0),
            clicks: Number(row.Clicks || 0),
            position: Number(row.AvgPosition || 0),
            ctr: Number(row.CTR || 0)
        }));

        return {
            data: transformedData,
            totalCount: transformedData.length
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('Failed to fetch Bing data', {
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
            params: {
                ...params,
                apiKey: process.env.BING_API_KEY ? '[PRESENT]' : '[MISSING]'
            }
        });
        throw error;
    }
}

// Parse SOAP response
const parseSoapResponse = (responseText: string): BingRawResponse[] => {
    try {
        const parsed = xmlParser.parse(responseText);
        const result = parsed?.Envelope?.Body?.GetRankAndTrafficStatsResponse?.GetRankAndTrafficStatsResult;

        if (!result) {
            logger.warn('No data found in response');
            return [];
        }

        // Handle both single item and array responses
        const stats = Array.isArray(result.RankAndTrafficStats)
            ? result.RankAndTrafficStats
            : result.RankAndTrafficStats ? [result.RankAndTrafficStats] : [];

        return stats.map((stat: BingRankAndTrafficStats) => ({
            Date: stat.Date,
            Impressions: Number(stat.Impressions || 0),
            Clicks: Number(stat.Clicks || 0),
            AvgPosition: Number(stat.Position || 0),
            CTR: Number(stat.CTR || 0)
        }));
    } catch (error) {
        logger.error('Failed to parse SOAP response', {
            error: error instanceof Error ? error.message : String(error),
            responseText
        });
        return [];
    }
};

export async function saveToJsonFile(data: BingApiResponse): Promise<string> {
    return await saveData(data, {
        baseDir: 'bing/search-console',
        filePrefix: 'bing-webmaster',
        customMetadata: {
            dataType: 'webmaster-stats',
            dimensions: data.data[0] ? Object.keys(data.data[0]) : []
        }
    });
} 