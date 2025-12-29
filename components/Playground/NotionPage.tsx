import React, { useEffect, useState } from 'react';
import { NotionRenderer } from 'react-notion-x';
import { ExtendedRecordMap } from 'notion-types';
import { Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import { fetchNotionPage, getNotionPageId } from '../../lib/notion';

// Import react-notion-x styles
import 'react-notion-x/src/styles.css';

interface NotionPageProps {
    title: string;
    notionUrl: string;
}

export const NotionPage: React.FC<NotionPageProps> = ({ title, notionUrl }) => {
    const [recordMap, setRecordMap] = useState<ExtendedRecordMap | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPage = async () => {
            setIsLoading(true);
            setError(null);

            const pageId = getNotionPageId(notionUrl);
            if (!pageId) {
                setError('Invalid Notion URL');
                setIsLoading(false);
                return;
            }

            const data = await fetchNotionPage(pageId);
            if (data) {
                setRecordMap(data);
            } else {
                setError('페이지를 불러올 수 없습니다');
            }
            setIsLoading(false);
        };

        loadPage();
    }, [notionUrl]);

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen pt-16 bg-brand-bg flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-accent-gold animate-spin" />
                    <p className="text-brand-line/60">Notion 페이지를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    // Error state - show link to open in Notion
    if (error || !recordMap) {
        return (
            <div className="min-h-screen pt-16 bg-brand-bg">
                <div className="max-w-2xl mx-auto px-6 py-20">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-accent-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-8 h-8 text-accent-gold/60" />
                        </div>
                        <h2 className="text-xl font-bold text-brand-text mb-3">{title}</h2>
                        <p className="text-brand-line/60 mb-8">
                            직접 임베드가 제한되어 있습니다.<br />
                            아래 버튼을 클릭하여 Notion에서 확인해주세요.
                        </p>
                        <a
                            href={notionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-gold text-brand-bg font-medium rounded-xl hover:bg-accent-goldLight transition-colors"
                        >
                            <ExternalLink className="w-5 h-5" />
                            Notion에서 열기
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Success - render Notion page
    return (
        <div className="min-h-screen pt-16 bg-white">
            <style>{`
                .notion-page {
                    padding: 0 24px;
                }
                .notion-collection-header {
                    display: none;
                }
                .notion-collection-view-type-gallery .notion-collection-gallery {
                    padding: 12px 0;
                }
            `}</style>
            <NotionRenderer
                recordMap={recordMap}
                fullPage={false}
                darkMode={false}
                disableHeader={true}
            />
        </div>
    );
};
