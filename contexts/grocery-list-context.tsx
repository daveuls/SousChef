import React, { createContext, useContext, useState } from "react";

export type GroceryItem = {
    id: string;
    name: string;
    checked: boolean;
};

type GroceryListContextType = {
    items: GroceryItem[];
    addItems: (items: string[]) => void;
    toggleItem: (id: string) => void;
};

const GroceryListContext = createContext<GroceryListContextType | undefined>(undefined);

export function GroceryListProvider({ children } : { children: React.ReactNode }) {
    // const [items, setItems] = useState<string[]>([]);
    const [items, setItems] = useState<GroceryItem[]>([]);

    const addItems = (newItems: string[]) => {
        const cleaned = newItems.filter(Boolean);

        // setItems((prev) => {
        //     const merged = [...prev, ...cleaned];
        //     return Array.from(new Set(merged));
        // });

        setItems((prev) => {
            const existingItems = new Set(prev.map((item) => item.name.toLowerCase()));
            const nextItems = cleaned
                .filter((name) => !existingItems.has(name.toLowerCase()))
                .map((name) => ({
                    id: `${Date.now()}-${name}`,
                    name,
                    checked: false
                }));
            
            return [...prev, ...nextItems];
        });
    };

    const toggleItem = (id: string) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id? { ...item, checked: !item.checked } : item
            )
        );
    };

    return (
        <GroceryListContext.Provider value={{ items, addItems, toggleItem }}>
            {children}
        </GroceryListContext.Provider>
    );
}

export function useGroceryList() {
    const context = useContext(GroceryListContext);

    if (!context) {
        throw new Error("useGroceryList must be used inside the GroceryListProvider.");
    }

    return context;
}