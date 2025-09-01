"use client";
import React from 'react';
import Nav from './Nav';
import MobileNav from './MobileNav';

const ResponsiveNav = () => {
    // state for mobile nav
    const [showNav, setShowNav] = React.useState(false);
    const handleNavOpen = () => {
        setShowNav(true);
    };
    const handleNavClose = () => {
        setShowNav(false);
    };

    return (
        <div>
            <Nav openNav={handleNavOpen} />
            <MobileNav showNav={showNav} closeNav={handleNavClose} />
        </div>
    );
}

export default ResponsiveNav;
