import React from 'react';
import { ExternalLink } from 'lucide-react';

interface InsidersEmbedProps {
    notionUrl?: string;
}

export const InsidersEmbed: React.FC<InsidersEmbedProps> = ({
    notionUrl = ''
}) => {
    // Convert Notion URL to embeddable format if provided
    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        // Convert notion.so URL to embeddable format
        // e.g., https://notion.so/page-id → https://notion.site/page-id
        return url.replace('notion.so', 'notion.site');
    };

    const embedUrl = getEmbedUrl(notionUrl);

    if (!embedUrl) {
        return (
            <div className="min-h-screen pt-24 px-6 md:px-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-accent-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ExternalLink className="w-10 h-10 text-accent-gold/60" />
                        </div>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">
                            29기 Insiders
                        </h2>
                        <p className="text-brand-line/60 mb-8 max-w-md mx-auto">
                            Notion 페이지가 아직 설정되지 않았습니다.
                            <br />
                            관리자에게 문의해주세요.
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg text-sm text-brand-line/50">
                            <span>Notion URL을 설정하면 여기에 콘텐츠가 표시됩니다</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16">
            <iframe
                src={embedUrl}
                className="w-full h-[calc(100vh-64px)] border-0"
                title="29th Insiders - Notion"
                allowFullScreen
            />
        </div>
    );
};
