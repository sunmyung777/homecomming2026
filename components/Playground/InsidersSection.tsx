import React from 'react';
import { ArrowUpRight } from 'lucide-react';

// Notion page URLs
const NOTION_LINKS = [
    {
        id: 'teams',
        number: '01',
        title: '팀별 브랜드',
        description: '각 팀의 프로젝트와 브랜드 아이덴티티',
        url: 'https://insiders.notion.site/2bd06a53832680aa8451e517398c3f87',
    },
    {
        id: 'members',
        number: '02',
        title: '학회원 소개',
        description: '29기 인사이더스 멤버들',
        url: 'https://insiders.notion.site/26106a53832681e8a934ca3563347e5a',
    },
];

export const InsidersSection: React.FC = () => {
    return (
        <div className="min-h-screen pt-16 bg-brand-bg">
            <div className="max-w-3xl mx-auto px-6 py-20">
                {/* Header */}
                <div className="mb-20">
                    <p className="text-accent-gold/50 text-xs uppercase tracking-[0.3em] mb-4">
                        29th Generation
                    </p>
                    <h1 className="font-sans font-bold text-4xl md:text-5xl text-brand-text tracking-tight">
                        Insiders
                    </h1>
                </div>

                {/* Links - Simple list style */}
                <div className="space-y-0">
                    {NOTION_LINKS.map((link) => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between py-8 border-t border-white/10 hover:border-white/20 transition-colors"
                        >
                            <div className="flex items-start gap-8">
                                <span className="text-brand-line/30 text-sm font-mono mt-1">
                                    {link.number}
                                </span>
                                <div>
                                    <h2 className="text-xl md:text-2xl font-medium text-brand-text group-hover:text-accent-gold transition-colors mb-1">
                                        {link.title}
                                    </h2>
                                    <p className="text-brand-line/50 text-sm">
                                        {link.description}
                                    </p>
                                </div>
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-brand-line/30 group-hover:text-accent-gold transition-colors flex-shrink-0" />
                        </a>
                    ))}
                    <div className="border-t border-white/10" />
                </div>

                {/* Footer note */}
                <p className="mt-16 text-xs text-brand-line/30 text-center">
                    Notion으로 연결됩니다
                </p>
            </div>
        </div>
    );
};
