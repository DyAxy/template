import cfg from "@/config";
import { encode } from 'js-base64';

export const hex2rgb = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

export const rgb2hex = (r: number, g: number, b: number) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export const adjustColorBrightness = (color: string, amount: number) => {
    const { r, g, b } = hex2rgb(color);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    if (brightness < 50 || brightness > 200) {
        // 颜色过于黑暗或过于明亮，返回反色
        return rgb2hex(255 - r, 255 - g, 255 - b);
    } else {
        const adjustedR = Math.min(255, Math.max(0, r + amount));
        const adjustedG = Math.min(255, Math.max(0, g + amount));
        const adjustedB = Math.min(255, Math.max(0, b + amount));
        return rgb2hex(adjustedR, adjustedG, adjustedB);
    }
}

export const color2dark = (color: string) => {
    return adjustColorBrightness(color, -30); // Adjust the amount as needed
}

export const app2scheme = (appName: string, subUrl: string) => {
    switch (appName) {
        case 'clash':
            return `clash://install-config?url=${encodeURIComponent(subUrl)}&name=${cfg.appName}`
        case 'surge':
            return `surge:///install-config?url=${encodeURIComponent(subUrl)}&name=${cfg.appName}`
        case 'loon':
            return `loon://import?sub=${encodeURIComponent(subUrl)}&name=${cfg.appName}`
        case 'quanx':
            return `quantumult-x:///add-resource?remote-resource=${encodeURI(JSON.stringify({ server_remote: [`${subUrl}, tag=${cfg.appName}`] }))}`
        case 'shadowrocket':
            return `shadowrocket://add/sub://${encode(subUrl + '&flag=shadowrocket')}?remark=${cfg.appName}`
        case 'sing-box':
            return `sing-box://import-remote-profile?url=${encodeURIComponent(subUrl)}#${cfg.appName}`
    }
    return ''
}