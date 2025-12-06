interface NotificationBadgeProps {
    count: number
}

export default function NotificationBadge({ count }: NotificationBadgeProps) {
    if (count === 0) return null

    return (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            <span className="relative z-10">{count > 99 ? '99+' : count}</span>
            {count > 0 && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            )}
        </span>
    )
}
