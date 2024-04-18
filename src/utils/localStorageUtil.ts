/*=====================================
    LocalStorage

    Author: Gray
    CreateTime: 2024 / 04 / 10
=====================================*/

/*--------------------------
    Methods
--------------------------*/
const getItem = (key: string) => {
    if (typeof window === "undefined") {
        return null;
    }

    return localStorage.getItem(key);
};

const setItem = (key: string, value: any) => {
    if (typeof window === "undefined") {
        return;
    }

    if (typeof value === "string") {
        localStorage.setItem(key, value);
    } else {
        const json = JSON.stringify(value);
        localStorage.setItem(key, json);
    }
};

const removeItem = (key: string) => {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.removeItem(key);
};

const LocalStorageUtil = {
    getItem,
    setItem,
    removeItem,
};
export default LocalStorageUtil;
