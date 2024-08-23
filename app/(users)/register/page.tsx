'use client'

import { PasswordMask } from "@/components/passwordMask";
import {
    Button,
    Checkbox,
    Divider,
    Input,
    Link
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Icon } from "@iconify/react/dist/iconify.js";
import { useSearchParams } from "next/dist/client/components/navigation";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";


export default function Component() {
    const { webConfig, login, register: reg, sendEmailVerify } = useAuth();
    const t = useTranslations('Users')
    const searchParams = useSearchParams()

    const [isPending, startTransition] = useTransition();

    const [params, setParams] = useState({
        email: '',
        timer: -1,
        isVisible: false,
        isVisible1: false,
        isAcceptTerms: false
    })
    const emailSuffixRef = useRef<HTMLSelectElement>(null);

    type FormValues = z.infer<typeof schema>;
    // 定义 Zod 模式
    const schema = z.object({
        email: Array.isArray(webConfig?.email_whitelist_suffix) ?
            z.string().min(1, { message: t('emailEmpty') })
            :
            z.string().email({ message: t('emailInvalid') }),
        verifyCode: webConfig?.is_email_verify === 1 ?
            z.string().min(1, { message: t('verifyCodeInvalid') })
            :
            z.string().optional(),
        password: z.string().min(8, { message: t('passwordInvalid') }),
        password1: z.string(),
        inviteCode: webConfig?.is_invite_force === 1 ?
            z.string().min(6, { message: t('inviteCodeInvalid') })
            :
            z.string().optional()
    }).refine(
        (values) => values.password === values.password1, {
        message: t('password1Invalid'),
        path: ["password1"],
    });

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        const email = Array.isArray(webConfig?.email_whitelist_suffix) ?
            data.email + '@' + emailSuffixRef.current?.value : data.email;

        console.log(data, email)
        startTransition(async () => {
            try {
                const result = await reg(
                    email,
                    data.password,
                    data.verifyCode ?? '',
                    data.inviteCode ?? ''
                )
                if (!result?.success) throw Error(result.data)
                await login(email, data.password)
                toast.success(t("registerSuccess"))
            } catch (e) {
                toast.error((e as Error).message)
            }
        })
    };

    // 获取验证码间隔
    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (params.timer > 0) {
            intervalId = setInterval(() => {
                setParams(prevParams => ({ ...prevParams, timer: prevParams.timer - 1 }));
            }, 1000);
        } else {
            setParams(prevParams => ({ ...prevParams, timer: -1 }));
        }
        return () => clearInterval(intervalId);
    }, [params.timer]);

    const handleVerifySend = async () => {
        try {
            console.log(params.email)
            if (params.email === '') throw Error(t('emailEmpty'))
            const email = Array.isArray(webConfig?.email_whitelist_suffix) ?
                params.email + '@' + emailSuffixRef.current?.value : params.email;
            const result = await sendEmailVerify(email)
            if (!result?.success) throw Error(result.data)
            toast.success(t("verifyCodeSent"))
            setParams(prevParams => ({ ...prevParams, timer: 60 }));
        } catch (e) {
            toast.error((e as Error).message)
        }
    }

    const inputClass = {
        inputWrapper: 'data-[hover=true]:border-primary/50 group-data-[focus=true]:border-primary/75',
        helperWrapper: 'h-4'
    }

    return (<div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            {!Array.isArray(webConfig?.email_whitelist_suffix) ? (<Input
                {...register('email')}
                type="email"
                label={t('email')}
                placeholder={t('emailDesc')}
                variant="bordered"
                radius="sm"
                classNames={inputClass}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
                value={params.email}
                onValueChange={(value) => setParams({ ...params, email: value })}
            />) : (<Input
                {...register('email')}
                type="text"
                label={t('email')}
                placeholder={t('emailDesc')}
                variant="bordered"
                radius="sm"
                classNames={inputClass}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
                value={params.email}
                onValueChange={(value) => setParams({ ...params, email: value })}
                endContent={
                    <div className="flex items-center">
                        <label className='text-default-400'>
                            @
                        </label>
                        <select
                            className="outline-none border-0 bg-transparent text-default-400 text-small"
                            id="emailSuffix"
                            name="emailSuffix"
                            ref={emailSuffixRef}
                        >
                            {webConfig?.email_whitelist_suffix.map((suffix: string) => (
                                <option key={suffix} value={suffix}>
                                    {suffix}
                                </option>
                            ))}
                        </select>
                    </div >
                }
            />
            )}
            {webConfig?.is_email_verify === 1 && <Input
                {...register('verifyCode')}
                type="text"
                label={t('verifyCode')}
                placeholder={t('verifyCodeDesc')}
                variant="bordered"
                radius="sm"
                classNames={inputClass}
                isInvalid={!!errors.verifyCode}
                errorMessage={errors.verifyCode?.message}
                endContent={<Button
                    radius="sm"
                    color="primary"
                    className="h-full"
                    onPress={handleVerifySend}
                    isLoading={params.timer > 0}
                >
                    {params.timer <= 0 ? t("bVerify") : params.timer.toString()}
                </Button>}
            />}

            <Input
                {...register('password')}
                type={params.isVisible ? "text" : "password"}
                label={t('password')}
                placeholder={t('passwordDesc')}
                variant="bordered"
                radius="sm"
                classNames={inputClass}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
                endContent={<PasswordMask
                    isVisible={params.isVisible}
                    onClick={() => setParams({ ...params, isVisible: !params.isVisible })}
                />}
            />
            <Input
                {...register('password1')}
                type={params.isVisible1 ? "text" : "password"}
                label={t('password1')}
                placeholder={t('password1Desc')}
                variant="bordered"
                radius="sm"
                classNames={inputClass}
                isInvalid={!!errors.password1}
                errorMessage={errors.password1?.message}
                endContent={<PasswordMask
                    isVisible={params.isVisible1}
                    onClick={() => setParams({ ...params, isVisible1: !params.isVisible1 })}
                />}
            />
            <Input
                {...register('inviteCode')}
                type="text"
                label={t('inviteCode')}
                placeholder={t("inviteCodeDesc") + (webConfig?.is_invite_force === 1 ? '' : t("inviteCodeOptional"))}
                variant="bordered"
                radius="sm" classNames={inputClass}
                isInvalid={!!errors.inviteCode}

                errorMessage={errors.inviteCode?.message}
                defaultValue={searchParams.get('code') ?? ''}
                isReadOnly={searchParams.get('code') !== null}
            />
            {webConfig?.tos_url && <div className='w-full justify-start mb-3 '>
                <Checkbox
                    size="sm"
                    isSelected={params.isAcceptTerms}
                    onValueChange={(bool) => setParams({ ...params, isAcceptTerms: bool })}
                >
                    {t.rich('tos', {
                        toslink: (value) => (
                            <Link
                                href={webConfig.tos_url ?? ""}
                                size="sm"
                                target="_blank"
                            >
                                {value}
                            </Link>)
                    })}
                </Checkbox>
            </div>}
            <Button type="submit" color="primary" radius="sm" isLoading={isPending}
                isDisabled={webConfig?.tos_url && !params.isAcceptTerms ? true : false}
            >
                {!isPending && <Icon icon="ri:file-list-3-line" width={20} />}
                {t('bRegister')}
            </Button>
        </form>
        <div className="flex items-center gap-4">
            <Divider className="flex-1" />
            <p className="shrink-0 text-tiny text-default-500">{t('or')}</p>
            <Divider className="flex-1" />
        </div>
        <p className="text-center text-small">
            {t('loginDesc')}{' '}
            <Link href="/login" size="sm">
                {t('login')}
            </Link>
        </p>
    </div >)
}