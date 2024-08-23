import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useMemo, useTransition } from "react";

export const SwitchTheme = ({
    iconOnly,
    radius
}: {
    iconOnly?: boolean
    radius?: "none" | "full" | "sm" | "md" | "lg" | undefined
}) => {
    const t = useTranslations("Components");
    const { theme, systemTheme, setTheme } = useTheme();
    const [isPending, startTransition] = useTransition();

    const isLightMode = useMemo(() => theme === 'system' ? systemTheme === 'light' : theme === 'light', [theme, systemTheme]);

    const toggleTheme = () => {
        startTransition(() => {
            if (theme === 'system') {
                setTheme(systemTheme === 'light' ? 'dark' : 'light');
            } else {
                setTheme(theme !== systemTheme ? 'system' : isLightMode ? 'dark' : 'light');
            }
        })
    };

    return (
        <Button
            className={`${iconOnly ? 'justify-center' : 'justify-start'} text-default-500 data-[hover=true]:text-foreground`}
            isIconOnly={iconOnly}
            onPress={toggleTheme}
            variant="light"
            radius={radius}
            isLoading={isPending}
        >
            {isPending ? null : <Icon
                className="text-default-500"
                icon={isLightMode ? 'ri:moon-line' : 'ri:sun-line'}
                width={24}
            />}
            {iconOnly ? null : isLightMode ? t('modeDark') : t('modeLight')}
        </Button>
    )
}