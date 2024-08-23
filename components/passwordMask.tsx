import { Icon } from "@iconify/react/dist/iconify.js"

export const PasswordMask = ({
    isVisible,
    onClick
}: {
    isVisible: boolean,
    onClick: () => void
}) => {

    return (
        <button type="button"
            onClick={onClick}
        >
            {isVisible ? (
                <Icon
                    className="pointer-events-none text-2xl text-foreground/50"
                    icon="solar:eye-closed-linear"
                />
            ) : (
                <Icon
                    className="pointer-events-none text-2xl text-foreground/50"
                    icon="solar:eye-bold"
                />
            )}
        </button>
    )
}