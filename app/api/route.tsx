import request from "@/lib/request"
import axios, { AxiosError } from "axios"

const route = {
    guest: [
        // Plan
        // '/plan/fetch',
        // Telegram
        // '/telegram/webhook', 
        // Comm
        '/comm/config',
    ],
    passport: [
        // Auth
        '/auth/register',
        '/auth/login',
        // '/auth/token2Login', 
        '/auth/forget',
        // '/auth/getQuickLoginUrl', 
        // '/auth/loginWithMailLink', 
        // Comm
        '/comm/sendEmailVerify',
        // '/comm/pv', 
    ],
    user: [
        // User
        '/resetSecurity',
        '/info',
        '/changePassword',
        '/update',
        '/getSubscribe',
        '/getStat',
        '/checkLogin',
        '/transfer',
        // '/getQuickLoginUrl',
        // '/getActiveSession',
        // '/removeActiveSession',
        // Order
        '/order/save',
        '/order/checkout',
        '/order/check',
        '/order/detail',
        '/order/fetch',
        '/order/getPaymentMethod',
        '/order/cancel',
        // Plan
        '/plan/fetch',
        // Invite
        '/invite/save',
        '/invite/fetch',
        '/invite/details',
        // Notice
        '/notice/fetch',
        // Ticket
        '/ticket/reply',
        '/ticket/close',
        '/ticket/save',
        '/ticket/fetch',
        '/ticket/withdraw',
        // Server
        '/server/fetch',
        // Coupon
        '/coupon/check',
        // Telegram
        '/telegram/getBotInfo',
        // Comm
        '/comm/config',
        // '/comm/getStripePublicKey', 
        // Knowledge
        '/knowledge/fetch',
        // '/knowledge/getCategory', 
        // Stat
        // '/stat/getTrafficLog',
    ]
}

const exec = async (req: Request) => {
    try {
        const { search, searchParams } = new URL(req.url)
        const scheme = searchParams.get('scheme')
        if (!scheme) throw Error('无效的请求1')
        const schemeList = scheme.split('/')
        const cate = schemeList[0] as string
        if (!(cate in route)) throw Error('无效的请求2')
        const subCate = '/' + schemeList.splice(1).join('/')
        if (!route[cate as keyof typeof route].includes(subCate)) throw Error('无效的请求3')

        let referer = req.headers.get('Referer') ?? ''
        if (referer) {
            referer = referer.split('/').slice(0, 3).join('/')
        }

        const res = await request.request({
            url: scheme + search,
            method: req.method,
            headers: {
                Authorization: req.headers.get('Authorization') ?? undefined,
                Origin: referer
            },
            data: req.method == 'POST' ? await req.json() : undefined
        })

        return new Response(
            JSON.stringify({ success: true, data: res.data.data }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (e) {
        if (axios.isAxiosError(e)) {
            const data = (e as AxiosError<ErrorResponse>).response?.data
            return new Response(
                JSON.stringify({ success: false, data: data?.errors ? Object.values(data?.errors) : data?.message }),
                {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        } else {
            return new Response(
                JSON.stringify({ success: false, data: (e as Error).message }),
                {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
    }
}

export async function GET(request: Request) { return await exec(request) }
export async function POST(request: Request) { return await exec(request) }