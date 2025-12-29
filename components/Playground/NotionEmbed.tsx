import React, { useState } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';

interface NotionEmbedProps {
    title: string;
    notionUrl: string;
}

export const NotionEmbed: React.FC<NotionEmbedProps> = ({ title, notionUrl }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Convert Notion URL to embeddable format
    // insiders.notion.site URLs should work for public pages
    const getEmbedUrl = (url: string) => {
        // Already using notion.site - good for embedding
        if (url.includes('notion.site')) {
            // Clean and return the URL
            return url.split('?')[0];
        }
        // Convert notion.so to notion.site
        return url.replace('notion.so', 'notion.site').split('?')[0];
    };

    const embedUrl = getEmbedUrl(notionUrl);

    return (
        <div className="min-h-screen pt-16 bg-brand-bg">
            {/* Header with title and external link */}
            <div className="bg-brand-deep/50 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                    <h1 className="text-lg font-bold text-brand-text">{title}</h1>
                    <a
                        href={notionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-brand-line/60 hover:text-accent-gold transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span className="hidden md:inline">새 탭에서 열기</span>
                    </a>
                </div>
            </div>

            {/* Embed Container */}
            <div className="relative w-full" style={{ height: 'calc(100vh - 112px)' }}>
                {/* Loading indicator */}
                {isLoading && !hasError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-brand-bg z-10">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 text-accent-gold animate-spin" />
                            <p className="text-brand-line/60 text-sm">Notion 페이지를 불러오는 중...</p>
                        </div>
                    </div>
                )}

                {/* Error state */}
                {hasError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-brand-bg z-10">
                        <div className="text-center px-6">
                            <p className="text-brand-line/60 mb-4">
                                페이지를 불러올 수 없습니다.
                                <br />
                                Notion 페이지가 공개 상태인지 확인해주세요.
                            </p>
                            <a
                                href={notionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-gold text-brand-bg font-medium rounded-lg hover:bg-accent-goldLight transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Notion에서 열기
                            </a>
                        </div>
                    </div>
                )}

                {/* Notion iframe */}
                <iframe
                    src={embedUrl}
                    className="w-full h-full border-0"
                    title={title}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setIsLoading(false);
                        setHasError(true);
                    }}
                    allow="fullscreen"
                    style={{
                        backgroundColor: 'white',
                    }}
                />
            </div>
        </div>
    );
};
