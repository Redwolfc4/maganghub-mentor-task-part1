interface HeaderProps {
    className?: string
    children: React.ReactNode
}

export default function Header({ children, className = '' }: Readonly<HeaderProps>) {
    return (
        <div className={`flex items-center justify-center w-full ${className}`}>
            {children}
        </div>
    )
}