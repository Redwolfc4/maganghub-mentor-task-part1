interface HeaderProps {
    className?: string
    children: React.ReactNode
}

/**
 * Header Component
 * 
 * A reusable header container with centered content.
 * Accepts custom classes for additional styling.
 */
export default function Header({ children, className = '' }: Readonly<HeaderProps>) {
    return (
        <div className={`flex items-center justify-center w-full ${className}`}>
            {children}
        </div>
    )
}