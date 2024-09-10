interface WebConfig {
    app_description: string | null
    app_url: string | null
    email_whitelist_suffix: 0 | string[]
    is_email_verify: 0 | 1
    is_invite_force: 0 | 1
    is_recaptcha: 0 | 1
    logo: string | null
    recaptcha_site_key: string | null
    tos_url: string | null
}
interface UserInfo {
    avatar_url: string | null
    balance: number
    banned: 0 | 1
    commission_balance: number
    commission_rate: number | null
    created_at: number
    discount: number | null
    email: string
    expired_at: number | null
    last_login_at: number | null
    plan_id: number | null
    remind_expire: 0 | 1
    remind_traffic: 0 | 1
    telegram_id: number | null
    transfer_enable: number | null
    uuid: string
}
interface AppConfig {
    is_telegram: 0 | 1
    telegram_discuss_link: string | null
    stripe_pk: string | null
    withdraw_methods: string[]
    withdraw_close: 0 | 1
    currency: string
    currency_symbol: string
    commission_distribution_enable: 0 | 1
    commission_distribution_l1: number | null
    commission_distribution_l2: number | null
    commission_distribution_l3: number | null
}