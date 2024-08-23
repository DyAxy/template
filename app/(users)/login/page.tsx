'use client'

import { PasswordMask } from "@/components/passwordMask";
import {
    Button,
    Divider,
    Input,
    Link
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Icon } from "@iconify/react/dist/iconify.js";


export default function Component() {
    const t = useTranslations('Users')
    const { login } = useAuth();
    const [isPending, startTransition] = useTransition();

    type FormValues = z.infer<typeof schema>;
    // 定义 Zod 模式
    const schema = z.object({
        email: z.string().email({ message: t('emailInvalid') }),
        password: z.string().min(8, { message: t('passwordInvalid') }),
    });
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        startTransition(async () => {
            try {
                const result = await login(data.email, data.password);
                if (!result?.success) throw Error(result.data);
                toast.success(t('loginSuccess'));
            } catch (e) {
                toast.error((e as Error).message);
            }
        });
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
        console.log(event)
        if (event.key === 'Enter') {
            handleSubmit(onSubmit)();
        }
    };

    const [params, setParams] = useState({
        isVisible: false
    })

    const inputClass = {
        inputWrapper: 'data-[hover=true]:border-primary/50 group-data-[focus=true]:border-primary/75',
        helperWrapper: 'h-4'
    }

    return (<div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <form className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={handleKeyPress}
        >
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
            <div className="flex items-center justify-end px-1 py-2">
                <Link className="text-default-500" href="/forgotpassword" size="sm">
                    {t('forgotPassword')}
                </Link>
            </div>
            <Button type="submit" color="primary" radius="sm" isLoading={isPending}>
                {!isPending && <Icon icon="ri:login-box-line" width={20} />}
                {t('bLogin')}
            </Button>
        </form>
        <div className="flex items-center gap-4">
            <Divider className="flex-1" />
            <p className="shrink-0 text-tiny text-default-500">{t('or')}</p>
            <Divider className="flex-1" />
        </div>
        <p className="text-center text-small">
            {t('signUpDesc')}{' '}
            <Link href="/register" size="sm">
                {t('signUp')}
            </Link>
        </p>
    </div >)
}