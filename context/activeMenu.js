import { createContext, useContext, useState } from 'react';

const ActiveMenuContext = createContext();

export function AactiveMenuWrapper({ children }) {
    const [activeMenu, setActiveMenu] = useState(undefined)
    const [menus, setMenus] = useState(undefined)

    return (
        <ActiveMenuContext.Provider value={{ activeMenu, setActiveMenu, menus, setMenus }}>
            {children}
        </ActiveMenuContext.Provider>
    );
}

export function useActiveMenuContext() {
    return useContext(ActiveMenuContext);
}