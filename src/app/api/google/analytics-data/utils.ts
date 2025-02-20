import { logger } from "@/utils/logger";
import { AnalyticsSession } from "./types";
import fs from "fs";
import path from "path";

export async function saveToJsonFile(data: Record<string, AnalyticsSession>) {
    try {
        // Create nested directory structure if it doesn't exist
        const baseDir = path.join(process.cwd(), 'src', 'data', 'google');
        if (!fs.existsSync(baseDir)) {
            fs.mkdirSync(baseDir, { recursive: true });
        }

        // Create timestamp for filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `${timestamp}-analytics-data.json`;
        const filePath = path.join(baseDir, fileName);

        // Convert data object to array for better readability
        const dataArray = Object.values(data);

        // Write to file with pretty formatting
        fs.writeFileSync(filePath, JSON.stringify(dataArray, null, 2));
        logger.info(`Analytics data saved to src/data/google/${fileName}`);
    } catch (error) {
        logger.error('Error saving analytics data:', error instanceof Error ? error.message : String(error));
    }
}