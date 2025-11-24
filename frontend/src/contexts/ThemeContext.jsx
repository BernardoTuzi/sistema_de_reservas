import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

// Definição das Cores
const paletas = {
    light: {
        background: '#fff',
        text: '#333',
        sidebar: '#A8CFA0',
        sidebarText: '#000',
        card: '#f9f9f9',
        cardBorder: '#eee',
        inputBg: '#fff',
        inputBorder: '#ccc'
    },
    dark: {
        background: '#121212',
        text: '#e0e0e0',
        sidebar: '#1f3b1f',
        sidebarText: '#fff',
        card: '#1e1e1e',
        cardBorder: '#333',
        inputBg: '#2c2c2c',
        inputBorder: '#555'
    }
};

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    const colors = paletas[theme];

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}