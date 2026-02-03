"use client";

import { useState } from 'react';
import { usePropertyFilter } from '@/contexts/PropertyContext';
import { Link, Copy, Check } from 'lucide-react';
import { generateSurveyLink } from '@/lib/utils/survey';

export function SurveyLinkWidget() {
    const { selectedPropertyId } = usePropertyFilter();
    const [copied, setCopied] = useState(false);

    const linkUrl = selectedPropertyId === 'ALL' ? '' : generateSurveyLink(selectedPropertyId);

    const handleCopy = async () => {
        if (!linkUrl) return;
        try {
            await navigator.clipboard.writeText(linkUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <div className="bg-redstone-card border border-redstone-card/50 p-10 flex flex-col justify-center h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-redstone-red/5 -rotate-45 translate-x-12 -translate-y-12"></div>

            <div className="flex items-center gap-6 mb-10">
                <div className="w-12 h-12 bg-redstone-red/10 border border-redstone-red/20 text-redstone-red flex items-center justify-center">
                    <Link className="w-6 h-6 stroke-[1.5px]" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white tracking-tight italic uppercase">Survey Acquisition</h3>
                    <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-1">Direct feedback collection channel</p>
                </div>
            </div>

            <p className="text-xs text-gray-500 mb-10 leading-relaxed font-light">
                Deploy this unique acquisition URL to residents. Feedback is automatically processed and categorized by Gemini to generate actionable intelligence.
            </p>

            <div className="flex items-center gap-4 bg-redstone-bg/60 border border-gray-900 p-5 group/box hover:border-redstone-red/30 transition-colors">
                <code className="text-[10px] text-gray-400 truncate flex-1 font-mono tracking-tighter">
                    {selectedPropertyId === 'ALL' ? 'Awaiting Property Selection' : linkUrl}
                </code>
                <button
                    onClick={handleCopy}
                    disabled={selectedPropertyId === 'ALL'}
                    className="p-3 bg-redstone-bg border border-gray-800 hover:border-redstone-red hover:text-white transition-all text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed group-hover/box:shadow-[0_0_15px_rgba(186,0,24,0.1)]"
                    title="Copy Link"
                >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}
