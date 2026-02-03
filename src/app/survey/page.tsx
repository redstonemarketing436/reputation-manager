"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Star, CheckCircle, Clock } from 'lucide-react';

type SurveyStep = 'rating' | 'feedback-low' | 'success-high' | 'success-low';

function SurveyContent() {
    const searchParams = useSearchParams();
    const propertyId = searchParams.get('propertyId') || searchParams.get('locationId');

    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [step, setStep] = useState<SurveyStep>('rating');
    const [feedback, setFeedback] = useState('');
    const [timeLeft, setTimeLeft] = useState(30);
    const [showBackupLink, setShowBackupLink] = useState(false);

    // Constants
    const MIN_POSITIVE_RATING = 4;
    const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=PLACE_ID"; // Placeholder

    const handleRatingSelect = (selectedRating: number) => {
        setRating(selectedRating);
        // Log start of survey attempt with property attribution
        console.log('Rating selected:', { rating: selectedRating, propertyId });

        if (selectedRating >= MIN_POSITIVE_RATING) {
            setStep('success-high');
        } else {
            setStep('feedback-low');
        }
    };

    const handleFeedbackSubmit = () => {
        // Here we would submit the feedback to our backend
        console.log('Submitting internal feedback:', {
            rating,
            feedback,
            propertyId,
            timestamp: new Date().toISOString()
        });
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
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full text-center transition-all duration-500">

                {/* Step 1: Initial Rating */}
                {step === 'rating' && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">How was your experience?</h1>
                        <p className="text-gray-600 mb-8">Please rate your stay with us.</p>

                        <div className="flex justify-center gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => handleRatingSelect(star)}
                                >
                                    <Star
                                        className={`w-12 h-12 ${star <= (hoveredRating || rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-200'
                                            } transition-colors duration-200`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-gray-400">Select a star rating to continue</p>
                    </div>
                )}

                {/* Step 2A: High Rating Success */}
                {step === 'success-high' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">We're glad you enjoyed it!</h2>
                        <p className="text-gray-600 mb-8">
                            It would mean the world to us if you could share your experience on Google.
                        </p>

                        <a
                            href={GOOGLE_REVIEW_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-full px-6 py-4 text-base font-semibold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg shadow-blue-200"
                        >
                            Rate us on Google
                        </a>
                    </div>
                )}

                {/* Step 2B: Low Rating Feedback Form */}
                {step === 'feedback-low' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">We're sorry to hear that.</h2>
                        <p className="text-gray-600 mb-6">
                            Please let us know how we can improve. Your feedback goes directly to our management team.
                        </p>

                        <textarea
                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 mb-4 h-32 resize-none"
                            placeholder="Tell us what happened..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        />

                        <button
                            onClick={handleFeedbackSubmit}
                            disabled={!feedback.trim()}
                            className="w-full px-6 py-4 text-base font-semibold text-white transition-colors bg-gray-900 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit Feedback
                        </button>
                        <button
                            onClick={() => setStep('rating')}
                            className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-800"
                        >
                            Back
                        </button>
                    </div>
                )}

                {/* Step 3: Low Rating Success & Countdown */}
                {step === 'success-low' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank you for your feedback.</h2>
                        <p className="text-gray-600 mb-8">
                            Our team has been notified and will review your comments shortly.
                        </p>

                        {!showBackupLink ? (
                            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-100">
                                <Clock className="w-6 h-6 text-gray-400 mb-2 animate-pulse" />
                                <p className="text-sm text-gray-500 font-medium">Redirecting in {timeLeft}s...</p>
                                {/* Visual Progress Bar */}
                                <div className="w-full h-1 bg-gray-200 mt-4 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
                                        style={{ width: `${(timeLeft / 30) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in zoom-in duration-500">
                                <p className="text-sm text-gray-500 mb-4">Still want to leave a public review?</p>
                                <a
                                    href={GOOGLE_REVIEW_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-medium text-gray-700 transition-all bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300"
                                >
                                    Leave a review on Google
                                </a>
                            </div>
                        )}
                    </div>
                )}
                {/* Debug / Context Info */}
                {propertyId && (
                    <div className="mt-8 text-xs text-gray-300">
                        Property ID: {propertyId}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SurveyPage() {
    return (
        <Suspense fallback={<div>Loading survey...</div>}>
            <SurveyContent />
        </Suspense>
    );
}
