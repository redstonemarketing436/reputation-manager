"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Star, CheckCircle, Clock, ChevronLeft } from 'lucide-react';

type SurveyStep = 'rating' | 'feedback-low' | 'success-high' | 'success-low';

function SurveyContent() {
    const searchParams = useSearchParams();
    const propertyId = searchParams.get('propertyId') || 'prop-1'; // Default for demo

    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [step, setStep] = useState<SurveyStep>('rating');
    const [feedback, setFeedback] = useState('');
    const [timeLeft, setTimeLeft] = useState(30);
    const [showBackupLink, setShowBackupLink] = useState(false);

    const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=PLACE_ID";

    const handleRatingSelect = (selectedRating: number) => {
        setRating(selectedRating);
        if (selectedRating >= 4) {
            setStep('success-high');
        } else {
            setStep('feedback-low');
        }
    };

    const handleFeedbackSubmit = () => {
        // Mock submission
        console.log('Internal Feedback:', { rating, feedback, propertyId });
        setStep('success-low');
        setTimeLeft(30);
        setShowBackupLink(false);
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (step === 'success-low' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setShowBackupLink(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [step, timeLeft]);

    return (
        <div className="min-h-screen bg-redstone-bg flex flex-col items-center justify-center p-6 font-sans">
            <div className="bg-redstone-card p-12 rounded-none border border-redstone-card/50 max-w-xl w-full text-center shadow-2xl relative overflow-hidden">
                {/* Decorative Accent */}
                <div className="absolute top-0 left-0 w-1 h-full bg-redstone-red"></div>

                {/* Step 1: Initial Rating */}
                {step === 'rating' && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                        <h1 className="text-4xl font-bold text-white mb-4 tracking-tighter">SHARE YOUR EXPERIENCE</h1>
                        <p className="text-gray-400 mb-12 uppercase tracking-[0.2em] text-[10px] font-bold">Your feedback shapes our community</p>

                        <div className="flex justify-center gap-4 mb-10">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    className="transition-all hover:scale-110 active:scale-95 focus:outline-none"
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => handleRatingSelect(star)}
                                >
                                    <Star
                                        className={`w-14 h-14 ${star <= (hoveredRating || rating)
                                            ? 'fill-redstone-red text-redstone-red'
                                            : 'text-gray-700'
                                            } transition-colors duration-300 stroke-[1px]`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Tap a star to begin</p>
                    </div>
                )}

                {/* Step 2A: High Rating Success */}
                {step === 'success-high' && (
                    <div className="animate-in fade-in zoom-in duration-700">
                        <div className="w-20 h-20 rounded-none bg-redstone-bg border border-redstone-red/30 flex items-center justify-center mx-auto mb-10">
                            <CheckCircle className="w-10 h-10 text-redstone-red stroke-[1.5px]" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight uppercase">Exceptional Service</h2>
                        <p className="text-gray-400 mb-12 leading-relaxed text-sm">
                            We are delighted you enjoyed your stay. Would you be willing to share this experience publicly on our Google Business Profile?
                        </p>

                        <a
                            href={GOOGLE_REVIEW_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-full px-8 py-5 text-sm font-bold text-white transition-all bg-redstone-red hover:bg-red-700 rounded-none uppercase tracking-widest"
                        >
                            Post to Google
                        </a>
                    </div>
                )}

                {/* Step 2B: Low Rating Feedback Form */}
                {step === 'feedback-low' && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 text-left">
                        <button
                            onClick={() => setStep('rating')}
                            className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500 hover:text-white mb-8 transition-colors font-bold"
                        >
                            <ChevronLeft className="w-3 h-3" /> Back
                        </button>

                        <h2 className="text-3xl font-bold text-white mb-4 tracking-tighter uppercase">Help Us Improve</h2>
                        <p className="text-gray-400 mb-10 text-xs italic tracking-wide">
                            Your feedback will be delivered directly to our executive management team for immediate review.
                        </p>

                        <textarea
                            className="w-full p-6 bg-redstone-bg border border-gray-700 focus:border-redstone-red outline-none text-white mb-8 h-48 resize-none rounded-none transition-colors text-sm"
                            placeholder="Please provide details regarding your experience..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        />

                        <button
                            onClick={handleFeedbackSubmit}
                            disabled={!feedback.trim()}
                            className="w-full px-8 py-5 text-sm font-bold text-white transition-all bg-redstone-red hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-none uppercase tracking-widest"
                        >
                            Submit Feedback
                        </button>
                    </div>
                )}

                {/* Step 3: Low Rating Success & Countdown */}
                {step === 'success-low' && (
                    <div className="animate-in fade-in zoom-in duration-700">
                        <div className="w-20 h-20 rounded-none bg-redstone-bg border border-gray-700 flex items-center justify-center mx-auto mb-10">
                            <Clock className="w-10 h-10 text-gray-500 stroke-[1.5px]" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-tight text-center">Feedback Received</h2>
                        <p className="text-gray-400 mb-12 text-sm leading-relaxed text-center">
                            Our management team has been alerted. We appreciate the opportunity to make this right.
                        </p>

                        {!showBackupLink ? (
                            <div className="p-10 bg-redstone-bg/50 border border-gray-800 rounded-none">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Processing Record</span>
                                    <span className="text-[10px] text-redstone-red font-mono">{timeLeft}s</span>
                                </div>
                                <div className="w-full h-[2px] bg-gray-900 overflow-hidden">
                                    <div
                                        className="h-full bg-redstone-red transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(186,0,36,0.5)]"
                                        style={{ width: `${(timeLeft / 30) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-6 font-bold">Public Review Option</p>
                                <a
                                    href={GOOGLE_REVIEW_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center w-full px-8 py-5 text-xs font-bold text-gray-400 transition-all border border-gray-800 hover:border-gray-500 hover:text-white rounded-none uppercase tracking-widest"
                                >
                                    Still leave a review on Google
                                </a>
                            </div>
                        )}
                    </div>
                )}

                {/* Property Context Footer */}
                <div className="mt-12 pt-8 border-t border-gray-800 flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold italic">Redstone Resident Survey</p>
                    <p className="text-[10px] font-mono text-gray-700">REF: {propertyId?.toUpperCase()}</p>
                </div>
            </div>
        </div>
    );
}

export default function SurveyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-redstone-bg flex items-center justify-center text-gray-500 uppercase tracking-widest text-[10px]">Initializing...</div>}>
            <SurveyContent />
        </Suspense>
    );
}
