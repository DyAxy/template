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