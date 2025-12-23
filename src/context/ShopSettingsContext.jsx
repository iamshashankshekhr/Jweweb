import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopSettingsContext = createContext();

const defaultSettings = {
    shopName: 'Jewelry Shop',
    tagline: 'Exquisite Jewelry for Every Occasion'
};

export const ShopSettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('shop_settings');
        return saved ? JSON.parse(saved) : defaultSettings;
    });

    useEffect(() => {
        localStorage.setItem('shop_settings', JSON.stringify(settings));
    }, [settings]);

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
    };

    const value = {
        settings,
        updateSettings,
        resetSettings
    };

    return (
        <ShopSettingsContext.Provider value={value}>
            {children}
        </ShopSettingsContext.Provider>
    );
};

export const useShopSettings = () => {
    return useContext(ShopSettingsContext);
};
