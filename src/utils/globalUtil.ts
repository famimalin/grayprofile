/*=====================================
    Global util 

    Author: Gray
    CreateTime: 2024 / 04 / 08
=====================================*/

/*--------------------------
    Variable
--------------------------*/
// 網域 origin url
const ORIGIN_URL = typeof window !== "undefined" ? window.location.origin : "";

/*--------------------------
    Method
--------------------------*/

/**
 * 簡易複製 object
 *
 * @param  object
 * @returns copy result
 */
const shallowCopy = (object?: object): object | undefined => {
    if (object === undefined) {
        return undefined;
    }

    return JSON.parse(JSON.stringify(object));
};

/**
 * 複製文字
 * @param text
 * @returns boolean
 */
const copyText = async (text: string) => {
    let isSuccess = false;
    if (navigator && navigator.clipboard) {
        try {
            navigator.clipboard.writeText(text);
            isSuccess = true;
        } catch (error) {
            isSuccess = false;
        }
    } else if (document) {
        let textField = document.createElement("textarea");
        textField.innerText = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand("copy");
        textField.remove();
        isSuccess = true;
    }

    return isSuccess;
};

/**
 * 延遲
 * @param delay
 */
const pureTimeout = (delay: number) => {
    return new Promise((res) => setTimeout(res, delay));
};

/**
 * 檢查裝置是否為手機平板
 * @returns boolean
 */
const checkAgentIsMobileDevice = () => {
    if (typeof window === "undefined") {
        return false;
    }

    if (!navigator.userAgent) {
        return false;
    }

    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
};

/**
 * 取得裝置系統
 * @returns string "Android" | "iOS" | "Other"
 */
const getMobileOS = () => {
    if (typeof window !== "undefined" && navigator) {
        const ua = navigator.userAgent;
        if (/android/i.test(ua)) {
            return "Android";
        } else if (
            /iPad|iPhone|iPod/i.test(ua) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
        ) {
            return "iOS";
        }
    }
    return "Other";
};

/**
 * 是否為 ios pwa 模式
 */
const isInStandaloneMode = () => {
    if (typeof window === "undefined") {
        return false;
    }

    if (typeof window.navigator === "undefined") {
        return false;
    }

    return "standalone" in window.navigator && window.navigator["standalone"];
};

/**
 * 四捨五入到小數特定位數
 */
const roundToDecimalPlace = (value: number, decimalPlace: number) => {
    const multipleValue = +`${value}e+${decimalPlace}`;
    const roundValue = Math.round(multipleValue);
    const resultValue = +`${roundValue}e-${decimalPlace}`;
    return resultValue;
};

/**
 * 將 script 加到 body
 */
const injectScriptToDom = (payload: {
    id: string;
    src?: string;
    scriptText?: string;
    async?: boolean;
    defer?: boolean;
    onload?: (this: GlobalEventHandlers, ev: Event) => any;
}): void => {
    if (typeof window === "undefined") {
        return;
    }

    const { id, src, scriptText, async, defer, onload } = payload;

    // 已經加入了
    if (window.document.getElementById(id)) {
        return;
    }

    const script = window.document.createElement("script");
    script.id = id;

    if (src) {
        script.src = src;
    }

    if (scriptText) {
        script.text = scriptText;
    }

    if (async) {
        script.async = true;
    }

    if (defer) {
        script.defer = true;
    }

    if (onload) {
        script.onload = onload;
    }

    const firstScript = window.document.getElementsByTagName("script")[0];

    if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
    } else {
        document.body.append(script);
    }

    // document.head.appendChild(script);
};

export {
    /*--------------------------
        Variable
    --------------------------*/
    ORIGIN_URL, // 網域 origin url
    /*--------------------------
        Method
    --------------------------*/
    shallowCopy, // 簡易複製 object
    copyText, // 複製文字
    pureTimeout, // 延遲
    checkAgentIsMobileDevice, // 檢查裝置是否為手機平板
    getMobileOS, // 取得裝置系統
    isInStandaloneMode, // 是否為 ios pwa 模式
    roundToDecimalPlace, // 四捨五入到小數特定位數
    injectScriptToDom, // 將 script 加到 body
};
