import { createContext, useContext, useState } from 'react';

const ActiveMenuContext = createContext();

export function AactiveMenuWrapper({ children }) {
    const [activeMenu, setActiveMenu] = useState({})
    // const [menus, setMenus] = useState(undefined)

    return (
        <ActiveMenuContext.Provider value={{ activeMenu, setActiveMenu }}>
            {children}
        </ActiveMenuContext.Provider>
    );
}

export function useActiveMenuContext() {
    return useContext(ActiveMenuContext);
}