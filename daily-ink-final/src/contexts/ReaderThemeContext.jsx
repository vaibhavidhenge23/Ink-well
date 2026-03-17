import { createContext, useContext, useState } from 'react';
import { jsx as _jsx } from "react/jsx-runtime";
export const readerThemes = [{
  id: 'midnight',
  name: 'Midnight',
  icon: '🌙',
  bg: '#0a0a0a',
  text: '#f5f5f5',
  secondary: '#a0a0a0',
  card: '#111111',
  accent: '#e8c547',
  border: '#222222',
  font: 'Georgia'
}, {
  id: 'sepia',
  name: 'Sepia',
  icon: '📜',
  bg: '#f4ecd8',
  text: '#3e2723',
  secondary: '#6d4c41',
  card: '#efe6d0',
  accent: '#8d6e63',
  border: '#d7cbb8',
  font: 'Georgia'
}, {
  id: 'paper',
  name: 'Paper White',
  icon: '📄',
  bg: '#ffffff',
  text: '#1a1a1a',
  secondary: '#666666',
  card: '#f5f5f5',
  accent: '#1a73e8',
  border: '#e0e0e0',
  font: 'Georgia'
}, {
  id: 'ocean',
  name: 'Ocean Deep',
  icon: '🌊',
  bg: '#0d1b2a',
  text: '#e0e1dd',
  secondary: '#778da9',
  card: '#1b2838',
  accent: '#00b4d8',
  border: '#1b3a4b',
  font: 'Georgia'
}, {
  id: 'forest',
  name: 'Forest',
  icon: '🌲',
  bg: '#1a2e1a',
  text: '#e8f5e9',
  secondary: '#81c784',
  card: '#243524',
  accent: '#66bb6a',
  border: '#2e4a2e',
  font: 'Georgia'
}, {
  id: 'lavender',
  name: 'Lavender',
  icon: '💜',
  bg: '#1a1625',
  text: '#e8e0f0',
  secondary: '#b39ddb',
  card: '#231e30',
  accent: '#ab47bc',
  border: '#2d2640',
  font: 'Georgia'
}, {
  id: 'rose',
  name: 'Rosé',
  icon: '🌹',
  bg: '#1f1218',
  text: '#fce4ec',
  secondary: '#e57373',
  card: '#2a1a20',
  accent: '#ef5350',
  border: '#3d2028',
  font: 'Georgia'
}, {
  id: 'amber',
  name: 'Amber Glow',
  icon: '🔥',
  bg: '#1a1408',
  text: '#fff8e1',
  secondary: '#ffb74d',
  card: '#252010',
  accent: '#ff9800',
  border: '#3d3418',
  font: 'Georgia'
}, {
  id: 'nord',
  name: 'Nord',
  icon: '❄️',
  bg: '#2e3440',
  text: '#eceff4',
  secondary: '#81a1c1',
  card: '#3b4252',
  accent: '#88c0d0',
  border: '#434c5e',
  font: 'Inter'
}, {
  id: 'monokai',
  name: 'Monokai',
  icon: '💻',
  bg: '#272822',
  text: '#f8f8f2',
  secondary: '#75715e',
  card: '#2d2e27',
  accent: '#a6e22e',
  border: '#3e3d32',
  font: 'Menlo, monospace'
}, {
  id: 'solarized',
  name: 'Solarized',
  icon: '☀️',
  bg: '#002b36',
  text: '#839496',
  secondary: '#586e75',
  card: '#073642',
  accent: '#b58900',
  border: '#094959',
  font: 'Georgia'
}, {
  id: 'cream',
  name: 'Cream',
  icon: '🍦',
  bg: '#faf8f0',
  text: '#2c2c2c',
  secondary: '#888888',
  card: '#f0ece0',
  accent: '#d4a574',
  border: '#e0dcc8',
  font: 'Georgia'
}];
const ThemeContext = /*#__PURE__*/createContext(null);
export const useReaderTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useReaderTheme must be used within ThemeProvider');
  return ctx;
};
export const ReaderThemeProvider = ({
  children
}) => {
  const [themeId, setThemeId] = useState('midnight');
  const [fontSize, setFontSize] = useState(18);
  const currentTheme = readerThemes.find(t => t.id === themeId) || readerThemes[0];
  return /*#__PURE__*/_jsx(ThemeContext.Provider, {
    value: {
      currentTheme,
      setTheme: setThemeId,
      fontSize,
      setFontSize
    },
    children: children
  });
};