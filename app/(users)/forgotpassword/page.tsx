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
    const { login, reset, sendEmailVerify } = useAuth();
    const t = useTranslations('Users')

    const [isPending, startTransition] = useTransition();

    const [params, setParams] = useState({
        email: '',
        timer: -1,
        isVisible: false,
        isVisible1: false
    })

    type FormValues = z.infer<typeof schema>;
    // 定义 Zod 模式
    const emailSchema = z.string().email({ message: t('emailInvalid') });
    const schema = z.object({
        email: z.string().email({ message: t('emailInvalid') }),
        verifyCode: z.string().min(1, { message: t('verifyCodeInvalid') }),
        password: z.string().min(8, { message: t('passwordInvalid') }),
        password1: z.string()
    }).refine(
        (values) => values.password === values.password1, {
        message: t('password1Invalid'),
        path: ["password1"],
    });

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log(data)
        startTransition(async () => {
            try {
                const result = await reset(data.email, data.password, data.verifyCode)
                if (!result?.success) throw Error(result.data)
                await login(data.email, data.password)
                toast.success(t("resetSuccess"))
            } catch (e) {
                toast.error((e as Error).message)
                setParams(prevParams => ({ ...prevParams, isChecking: false }));
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
            emailSchema.parse(params.email)
            const result = await sendEmailVerify(params.email)
            if (!result?.success) throw Error(result.data)
            toast.success(t("verifyCodeSent"))
            setParams(prevParams => ({ ...prevParams, timer: 60 }));
        } catch (e) {
            if (e instanceof z.ZodError) {
                toast.error(e.issues[0].message)
            } else {
                toast.error((e as Error).message)
            }
        }
    }

    const inputClass = {
        inputWrapper: 'data-[hover=true]:border-primary/50 group-data-[focus=true]:border-primary/75',
        helperWrapper: 'h-4'
    }

    return (<div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
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
            />
            <Input
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
            />
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
            <Button type="submit" color="primary" radius="sm" isLoading={isPending}>
                {!isPending && <Icon icon="ri:reset-right-line" width={20} />}
                {t('bForget')}
            </Button>
        </form>
        <div className="flex items-center gap-4">
            <Divider className="flex-1" />
            <p className="shrink-0 text-tiny text-default-500">{t('or')}</p>
            <Divider className="flex-1" />
        </div>
        <p className="text-center text-small">
            {t('loginDesc2')}{' '}
            <Link href="/login" size="sm">
                {t('login')}
            </Link>
        </p>
    </div >)
}