'use client';

import { useState } from 'react';
import { Lock, Loader2, KeyRound } from "lucide-react";
import { verifyAdmin } from "@/lib/actions";

interface LoginScreenProps {
    onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
    const [secret, setSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleLogin = async () => {
        if (!secret) return;
        setLoading(true);
        try {
            const result = await verifyAdmin(secret);
            if (result.success) {
                onLoginSuccess();
            } else {
                alert(result.error || 'Access Denied');
                setSecret('');
            }
        } catch (error) {
            alert("Login failed.");
        }
        setLoading(false);
    };

    return (
        // Outer container with radial gradient background for depth
        <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1f2937] via-[#0c1015] to-[#0c1015]">
            
            {/* Card container with glassmorphism effect, deeper shadow, and larger padding */}
            <div className="bg-[#1f2937]/80 backdrop-blur-md p-10 rounded-3xl border border-white/10 text-center space-y-8 w-full max-w-[400px] shadow-2xl shadow-black/70 relative overflow-hidden animate-in fade-in zoom-in-90 duration-500">
                
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-skin-primary to-skin-secondary animate-pulse"></div>
                
                {/* Header Section */}
                <div className="space-y-4">
                    <div className="inline-flex p-5 bg-skin-primary/10 rounded-full text-skin-primary relative ring-4 ring-skin-primary/5 shadow-[0_0_40px_-10px] shadow-skin-primary/30">
                        <Lock size={40} className="drop-shadow-md relative z-10"/>
                    </div>
                    <div>
                        {/* Added font-clash if you have it available globally, otherwise font-bold works */}
                        <h1 className="text-3xl font-bold font-clash text-white drop-shadow-sm">Admin Portal</h1>
                        <p className="text-skin-muted text-xs uppercase tracking-wider font-bold mt-2">Restricted Access Point</p>
                    </div>
                </div>
                
                {/* Input Section */}
                <div className="space-y-4">
                    <div className={`relative group transition-all duration-300 ${isFocused ? 'scale-105' : ''}`}>
                        {/* Input Icon */}
                        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${isFocused ? 'text-skin-primary' : 'text-skin-muted'}`}>
                            <KeyRound size={20} />
                        </div>
                        <input 
                            type="password" 
                            placeholder="Enter Access Key" 
                            className="w-full bg-[#0c1015]/60 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-skin-primary/60 focus:bg-[#0c1015] transition-all text-sm font-bold placeholder:text-skin-muted/50 text-center shadow-inner"
                            value={secret}
                            onChange={(e) => setSecret(e.target.value)} 
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()} 
                            disabled={loading} 
                        />
                    </div>
                    
                    <button 
                        onClick={handleLogin} 
                        disabled={loading || !secret} 
                        className="admin-btn-primary w-full py-4 text-[15px] shadow-lg shadow-skin-primary/20 hover:shadow-skin-primary/40 transition-all active:scale-[0.98]"
                    >
                        {loading ? <Loader2 size={22} className="animate-spin mx-auto"/> : "Authenticate"}
                    </button>
                </div>
            </div>
        </div>
    );
}
