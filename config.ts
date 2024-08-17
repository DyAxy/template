const cfg = {
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'V2Board',
    appColor: process.env.NEXT_PUBLIC_APP_COLOR ? '#' + process.env.NEXT_PUBLIC_APP_COLOR : '#006FEE',
    appWallpaper: process.env.NEXT_PUBLIC_APP_WALLPAPER || 'https://img.loliapi.com/i/pc/img318.webp',

    crispWebsiteId: process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID || '',
    // 添加其他配置
};

export default cfg;