import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavLinkProps {
    to: string;
    count: number;
    badgeColor: string;
    activeColor: string;
    children: React.ReactNode;
    dataTestId?: string;
}

const NavLink: React.FC<NavLinkProps> = ({
    to,
    count,
    badgeColor,
    activeColor,
    children,
    dataTestId
}) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
                to={to}
                className={`btn relative ${isActive
                    ? `${activeColor} text-white`
                    : `btn-outline ${activeColor} text-base-content`
                    }`}
                data-testid={dataTestId}
            >
                {children}
                <div className={`badge badge-sm ${badgeColor} absolute -top-2 -right-2 ${isActive ? 'text-white' : ''}`}>
                    {count}
                </div>
                {isActive && (
                    <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-1 bg-accent"
                        layoutId="activeIndicator"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                )}
            </Link>
        </motion.div>
    );
};

export default NavLink; 