import React, { useState } from 'react';
import { PlaygroundNav } from './PlaygroundNav';
import { InsidersSection } from './InsidersSection';
import { Timeline } from '../Timeline';
import { MessageWall } from './MessageWall';

export const PlaygroundPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'insiders' | 'timeline' | 'wall'>('insiders');

    return (
        <div className="min-h-screen bg-brand-bg">
            <PlaygroundNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Content based on active tab */}
            {activeTab === 'insiders' && <InsidersSection />}

            {activeTab === 'timeline' && (
                <div className="pt-16">
                    <Timeline />
                </div>
            )}

            {activeTab === 'wall' && <MessageWall />}
        </div>
    );
};
