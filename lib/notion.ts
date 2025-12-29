import { ExtendedRecordMap } from 'notion-types';

// Extract page ID from Notion URL
export const getNotionPageId = (url: string): string => {
    // Handle various Notion URL formats
    // e.g., https://insiders.notion.site/2bd06a53832680aa8451e517398c3f87
    // or with view query params
    const match = url.match(/([a-f0-9]{32})/);
    if (match) {
        return match[1];
    }
    // Try to extract from path
    const pathMatch = url.split('/').pop()?.split('?')[0];
    if (pathMatch && pathMatch.length === 32) {
        return pathMatch;
    }
    // Handle hyphenated format
    const hyphenatedMatch = url.match(/([a-f0-9-]{36})/);
    if (hyphenatedMatch) {
        return hyphenatedMatch[1].replace(/-/g, '');
    }
    return '';
};

// Fetch Notion page data using the public API
export const fetchNotionPage = async (pageId: string): Promise<ExtendedRecordMap | null> => {
    try {
        // Use notion.so's public API endpoint
        const response = await fetch(`https://notion.so/api/v3/loadPageChunk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pageId: pageId,
                limit: 100,
                cursor: { stack: [] },
                chunkNumber: 0,
                verticalColumns: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();

        // Transform to ExtendedRecordMap format
        const recordMap: ExtendedRecordMap = {
            block: data.recordMap?.block || {},
            collection: data.recordMap?.collection || {},
            collection_view: data.recordMap?.collection_view || {},
            notion_user: data.recordMap?.notion_user || {},
            collection_query: {},
            signed_urls: {},
        };

        return recordMap;
    } catch (error) {
        console.error('Error fetching Notion page:', error);
        return null;
    }
};
