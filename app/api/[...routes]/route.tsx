import request from "@/lib/request"
import axios, { AxiosError } from "axios"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"

const routes = {
    guest: [
        // Plan
        '/plan/fetch',
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

const exec = async (req: Request, context: { params: Params }) => {
    try {
        const route = context.params.routes.join('/')
        const { search } = new URL(req.url)

        // origin HTTP referer
        let referer = req.headers.get('Referer') ?? ''
        if (referer) {
            referer = referer.split('/').slice(0, 3).join('/')
        }
        // origin IP if CF-Connecting-IP exists
        const originIP = req.headers.get('CF-Connecting-IP') ?? req.headers.get('x-forwarded-for') ?? undefined

        const res = await request.request({
            url: route + search,
            method: req.method,
            headers: {
                Authorization: req.headers.get('Authorization') ?? undefined,
                Origin: referer,
                'x-forwarded-for': originIP
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

export async function GET(request: Request, context: { params: Params }) { return await exec(request, context) }
export async function POST(request: Request, context: { params: Params }) { return await exec(request, context) }