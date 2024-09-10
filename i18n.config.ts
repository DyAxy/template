export type Locale = typeof locales[number]['key'];
export const defaultLocale: Locale = 'zh-CN';
export const locales = [
    {
        "key": "en-US",
        "label": "English"
    },
    {
        "key": "zh-CN",
        "label": "简体中文"
    },
    {
        "key": "zh-TW",
        "label": "繁體中文"
    },
] as const;