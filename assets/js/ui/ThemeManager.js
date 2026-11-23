/**
 * ThemeManager.js
 * Gerenciamento do tema (Claro / Escuro / Sistema).
 * Respeita preferências de acessibilidade e sincroniza com o sistema operacional.
 */

export class ThemeManager {
    constructor() {
        this.STORAGE_KEY = 'mychords_theme_pref';
        this.currentPreference = localStorage.getItem(this.STORAGE_KEY) || 'system';
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        this._handleSystemChange = this._handleSystemChange.bind(this);
        this.mediaQuery.addEventListener('change', this._handleSystemChange);
    }

    init() {
        this.setTheme(this.currentPreference);
    }

    setTheme(themeOption) {
        this.currentPreference = themeOption;
        localStorage.setItem(this.STORAGE_KEY, themeOption);

        let effectiveTheme = 'light';
        if (themeOption === 'dark') {
            effectiveTheme = 'dark';
        } else if (themeOption === 'light') {
            effectiveTheme = 'light';
        } else {
            // Sistema
            effectiveTheme = this.mediaQuery.matches ? 'dark' : 'light';
        }

        document.documentElement.setAttribute('data-theme', effectiveTheme);
        document.documentElement.setAttribute('data-theme-preference', themeOption);

        // Notifica listeners
        window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme: effectiveTheme, preference: themeOption } }));
    }

    _handleSystemChange(e) {
        if (this.currentPreference === 'system') {
            const effectiveTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', effectiveTheme);
            window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme: effectiveTheme, preference: 'system' } }));
        }
    }

    getTheme() {
        return this.currentPreference;
    }
}

export const themeManager = new ThemeManager();
