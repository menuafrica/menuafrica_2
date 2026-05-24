"use client";
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface AutoTranslateProps {
    children: string;
    className?: string;
}

export const AutoTranslate: React.FC<AutoTranslateProps> = ({ children, className }) => {
    const { language, translateContent } = useLanguage();
    const [translated, setTranslated] = useState(children);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const performTranslation = async () => {
            if (!children) return;
            setIsLoading(true);
            try {
                const result = await translateContent(children);
                setTranslated(result);
            } catch (error) {
                console.error("AutoTranslate error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (children && children.trim() !== '') {
            performTranslation();
        } else {
            setTranslated(children);
        }
    }, [children, language, translateContent]);

    return (
        <span className={className}>
            {isLoading ? (
                <span className="opacity-50 blur-[1px] transition-all">{translated || children}</span>
            ) : (
                translated
            )}
        </span>
    );
};
