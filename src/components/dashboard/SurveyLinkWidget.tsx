"use client";

import { useState } from 'react';
import { usePropertyFilter } from '@/contexts/PropertyContext';
import { Link, Copy, Check } from 'lucide-react';

export function SurveyLinkWidget() {
    const { selectedPropertyId } = usePropertyFilter();
    const [copied, setCopied] = useState(false);

    const generateLink = () => {
        if (typeof window === 'undefined') return '';
        const baseUrl = window.location.origin;
        // If 'ALL' is selected, we can't generate a specific property link
        // In a real app, we might prompt to select a property or generate a generic link
        const idParam = selectedPropertyId === 'ALL' ? '' : `?propertyId=${selectedPropertyId}`;
        return `${baseUrl}/survey${idParam}`;
    };

    const handleCopy = async () => {
        const link = generateLink();
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const linkUrl = generateLink();

    return (
        <div className="bg-redstone-card p-10 rounded-none shadow-sm border border-redstone-card/50 flex flex-col justify-center h-full">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-redstone-red/10 text-redstone-red rounded-none">
                    <Link className="w-6 h-6 stroke-[1.5px]" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Survey Link</h3>
            </div>
            <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                Share this link with residents to collect feedback and improve your property's reputation.
            </p>

            <div className="flex items-center gap-3 bg-redstone-bg p-4 rounded-none border border-gray-700/30">
                <code className="text-xs text-gray-300 truncate flex-1 font-mono tracking-wider">
                    {selectedPropertyId === 'ALL' ? 'Select a property...' : `/survey?propertyId=${selectedPropertyId}`}
                </code>
                <button
                    onClick={handleCopy}
                    disabled={selectedPropertyId === 'ALL'}
                    className="p-2 hover:bg-white/5 rounded-none transition-colors text-gray-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Copy Link"
                >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}
