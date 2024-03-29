import React, { useState } from 'react';

export const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
    return <AppContext.Provider value={{}}>
        {children}
    </AppContext.Provider>
}
