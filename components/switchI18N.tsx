import { locales } from "@/i18n.config"
import { setUserLocale } from "@/lib/i18n"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react"
import { useTranslations } from "next-intl"
import { useTransition } from "react"

export const SwitchI18N = ({
    iconOnly,
    radius
}: {
    iconOnly?: boolean
    radius?: "none" | "full" | "sm" | "md" | "lg" | undefined
}) => {
    const [isPending, startTransition] = useTransition();
    const t = useTranslations('Components');

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    className={`${iconOnly ? 'justify-center' : 'justify-start'} text-default-500 data-[hover=true]:text-foreground`}
                    isIconOnly={iconOnly}
                    disableAnimation
                    variant="light"
                    isLoading={isPending}
                    radius={radius}
                >
                    {isPending ? null : <Icon
                        className="text-default-500"
                        icon={'ri:translate-2'}
                        width={24}
                    />}
                    {iconOnly ? null : t('I18NSwitch')}
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                selectionMode="single"
                aria-label="Static Actions"
                items={locales}
            >
                {(item) => (
                    <DropdownItem
                        onPress={() =>
                            startTransition(() => {
                                setUserLocale(item.key)
                            })
                        }
                        key={item.key}
                    >
                        {item.label}
                    </DropdownItem>
                )}
            </DropdownMenu>
        </Dropdown>
    )
}