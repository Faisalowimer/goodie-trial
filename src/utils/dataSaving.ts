import { logger } from './logger';
import fs from 'fs';
import path from 'path';

/**
 * Configuration for data saving
 */
interface SaveConfig {
    /** Base directory for saving data (e.g., 'google/search-console') */
    baseDir: string;
    /** Optional prefix for the filename */
    filePrefix?: string;
    /** Optional custom metadata to include in the saved file */
    customMetadata?: Record<string, unknown>;
}

/**
 * Generic metadata structure for saved data
 */
interface DataMetadata {
    /** Timestamp when the data was saved */
    timestamp: string;
    /** Number of records in the data */
    rowCount: number;
    /** Size of the data in bytes */
    dataSize: number;
    /** Source of the data (e.g., 'bing', 'google') */
    source: string;
    /** Custom metadata fields */
    [key: string]: unknown;
}

/**
 * Generic data structure with optional data array
 */
interface DataWithArray {
    data: unknown[];
    [key: string]: unknown;
}

/**
 * Saves data to a JSON file with consistent metadata and directory structure
 * @param data The data to save
 * @param config Configuration for saving the data
 * @returns Promise<string> The path where the file was saved
 */
export async function saveToJsonFile<T>(
    data: T,
    config: SaveConfig
): Promise<string> {
    try {
        // Create the full directory path
        const baseDir = path.join(process.cwd(), 'src', 'data', config.baseDir);

        // Ensure directory exists
        if (!fs.existsSync(baseDir)) {
            fs.mkdirSync(baseDir, { recursive: true });
            logger.debug('Created directory structure', { path: baseDir });
        }

        // Create timestamp for filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `${timestamp}-${config.filePrefix ? config.filePrefix : ''}.json`;
        const filePath = path.join(baseDir, fileName);

        // Calculate data size and row count
        const dataString = JSON.stringify(data);
        const dataSize = Buffer.from(dataString).length;
        const rowCount = Array.isArray(data) ? data.length :
            (data && typeof data === 'object' &&
                'data' in data && Array.isArray((data as DataWithArray).data))
                ? (data as DataWithArray).data.length : 1;

        // Create metadata
        const metadata: DataMetadata = {
            timestamp: new Date().toISOString(),
            rowCount,
            dataSize,
            source: config.baseDir.split('/')[0], // First part of baseDir (e.g., 'bing' from 'bing/search-console')
            ...config.customMetadata
        };

        // Combine metadata and data
        const fileContent = {
            metadata,
            data
        };

        // Write to file
        fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2));

        const relativePath = path.relative(process.cwd(), filePath);
        logger.info('Data saved successfully', {
            path: relativePath,
            stats: {
                rowCount,
                fileSize: fs.statSync(filePath).size,
                source: metadata.source
            }
        });

        return relativePath;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('Failed to save data', {
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
            config
        });
        throw error;
    }
}
