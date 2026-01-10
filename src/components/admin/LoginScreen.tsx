'use client';

import { useState } from 'react';
import { Lock, Loader2 } from "lucide-react";
import { verifyAdmin } from "@/lib/actions";

interface LoginScreenProps {
    onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
    const [secret, setSecret] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!secret) return;
        setLoading(true);
        try {
            const result = await verifyAdmin(secret);
            if (result.success) {
                onLoginSuccess();
            } else {
                alert(result.error || 'Access Denied');
            }
        } catch (error) {
            alert("Login failed.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#0c1015]">
            <div className="bg-[#1f2937] p-8 rounded-xl border border-white/10 text-center space-y-4 w-full max-w-sm shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-skin-primary to-skin-secondary"></div>
                <div className="inline-flex p-4 bg-skin-primary/10 rounded-full text-skin-primary mb-2">
                    <Lock size={32}/>
                </div>
                <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
                
                <input 
                    type="password" 
                    placeholder="Enter Access Key" 
                    className="admin-input text-center" 
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()} 
                    disabled={loading} 
                />
                
                <button 
                    onClick={handleLogin} 
                    disabled={loading} 
                    className="admin-btn-primary w-full flex justify-center items-center"
                >
                    {loading ? <Loader2 size={18} className="animate-spin"/> : "Login"}
                </button>
            </div>
        </div>
    );
}
