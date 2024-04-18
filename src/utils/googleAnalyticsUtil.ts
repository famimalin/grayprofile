/*=====================================
    Google Analytics 相關

    Author: Gray
    CreateTime: 2024 / 04 / 18
=====================================*/

import { injectScriptToDom } from "./globalUtil";

/*--------------------------
    Valirbale
--------------------------*/
const TRACKING_4_ID = process.env.REACT_APP_GA_4_TRACKING_ID;
const FAKE_URI = {
    PROJECT_MODAL: "/_modal_/project-modal",
};
let isInit4 = false;

/*--------------------------
    Methods
--------------------------*/
/**
 * 初始化ga
 */
const initGA = (callback?: () => void) => {
    if (typeof window === "undefined" || isInit4 || !TRACKING_4_ID) {
        return;
    }

    injectScriptToDom({
        id: "gtag-script",
        src: `https://www.googletagmanager.com/gtag/js?id=$${TRACKING_4_ID}`,
        defer: true,
        async: true,
        onload: () => {
            if (typeof window.gtag === "undefined") {
                window.dataLayer = window.dataLayer || [];
                window.gtag = function gtag() {
                    window.dataLayer.push(arguments);
                };
            }

            window.gtag("js", new Date());
            window.gtag("config", TRACKING_4_ID);

            callback && callback();

            isInit4 = true;
        },
    });
};

/**
 * 發送頁面轉換事件
 * @param uri
 */
const trackPageview = (_location?: Location) => {
    try {
        if (isInit4) {
            if (_location) {
                gtag("event", "page_view", {
                    page_location: _location,
                });
            } else {
                gtag("event", "page_view");
            }
        } else {
            if (_location) {
                console.log("[TESTG] google analytics tracking page view on: ", _location.href);
            } else {
                console.log("[TESTG] google analytics tracking page view");
            }
        }
    } catch (e) {}
};

/**
 * 發送假頁面轉換事件 (modal)
 * @param uri
 */
const _trackModalview = (uri: string) => {
    try {
        if (isInit4) {
            gtag("event", "modal_view", {
                modal_uri: uri,
            });
        } else {
            console.log("[TESTG] google analytics tracking modal view on: ", uri);
        }
    } catch (e) {}
};

/**
 * 發送查看專案詳情的轉換事件
 * @param id
 */
const trackProjectModalview = (id: string) => {
    const uri = `${FAKE_URI.PROJECT_MODAL}/${id}`;
    _trackModalview(uri);
};

export {
    initGA, // 初始化ga
    trackPageview, // 發送頁面轉換事件
    trackProjectModalview, // 發送查看專案詳情的轉換事件
};
