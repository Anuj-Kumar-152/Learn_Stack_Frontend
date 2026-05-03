import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';
import { ShieldCheck, KeyRound } from 'lucide-react';

const VerifyOtp = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const mfaEmail = useAuthStore((state) => state.mfaEmail);
    const verifyOtpAction = useAuthStore((state) => state.verifyOtp);
    const resendOtpAction = useAuthStore((state) => state.resendOtp);
    const navigate = useNavigate();
    const [isResending, setIsResending] = useState(false);

    // If there's no email in state, they shouldn't be here
    if (!mfaEmail) {
        return <Navigate to="/login" replace />;
    }

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && e.target.previousSibling) {
                e.target.previousSibling.focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) {
            toast.error('Please enter the full 6-digit code');
            return;
        }

        setIsSubmitting(true);
        try {
            await verifyOtpAction(mfaEmail, code);
            toast.success('Authentication successful!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid or expired OTP');
            setOtp(['', '', '', '', '', '']); // Reset on fail
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (isResending) return;
        setIsResending(true);
        try {
            await resendOtpAction(mfaEmail);
            toast.success('A new OTP has been sent to your email.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 relative overflow-hidden">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
            
            <div className="w-full max-w-md backdrop-blur-2xl bg-white/5 p-8 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(79,70,229,0.3)] relative z-10 transform transition-all hover:scale-[1.01]">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)] rotate-3">
                        <ShieldCheck className="text-white w-8 h-8 -rotate-3" />
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">Two-Factor Authentication</h2>
                    <p className="text-gray-400 mt-2 text-sm leading-relaxed">
                        We've sent a 6-digit verification code to <br/>
                        <span className="font-semibold text-emerald-400">{mfaEmail}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex justify-center gap-2 sm:gap-3">
                        {otp.map((data, index) => {
                            return (
                                <input
                                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold text-white bg-gray-800 border border-gray-600 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all duration-200"
                                    type="text"
                                    name="otp"
                                    maxLength="1"
                                    key={index}
                                    value={data}
                                    onChange={e => handleChange(e.target, index)}
                                    onKeyDown={e => handleKeyDown(e, index)}
                                    onFocus={e => e.target.select()}
                                />
                            );
                        })}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3.5 px-4 rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 flex justify-center items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 shadow-[0_10px_20px_rgba(16,185,129,0.3)]'}`}
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <KeyRound className="w-4 h-4" />
                                Verify Identity
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button 
                        onClick={handleResend}
                        disabled={isResending}
                        className={`text-sm text-gray-400 hover:text-white transition-colors duration-200 ${isResending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Didn't receive the code? <span className="text-emerald-400 font-medium">{isResending ? 'Sending...' : 'Resend'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
