import React, { useEffect, useState } from 'react';

// DaisyUI theme list
const themes = [
    'abyss',
    'dracula',
    'cyberpunk',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
];

const ThemeSelector: React.FC = () => {
    const [theme, setTheme] = useState<string>('light');

    useEffect(() => {
        // Get saved theme from localStorage or use system default
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTheme = e.target.value;
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <div className="flex items-center gap-2">
            <label htmlFor="theme-select" className="text-sm font-medium">
                Theme:
            </label>
            <select
                id="theme-select"
                value={theme}
                onChange={handleThemeChange}
                className="select select-bordered select-sm w-full max-w-xs"
            >
                {themes.map((themeName) => (
                    <option key={themeName} value={themeName}>
                        {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ThemeSelector;
