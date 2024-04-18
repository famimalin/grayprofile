/*=====================================
    Scroll 相關

    Author: Gray
    CreateTime: 2024 / 04 / 11
=====================================*/

/*--------------------------
    Variable
--------------------------*/
let _isOn: boolean = false;
let _scrollbarSize: number | undefined = undefined;
let _scrollTop: number;
let _scrollLeft: number;

/*--------------------------
    Method
--------------------------*/

/**
 * 取得scroll bar寬度
 *
 * @returns number
 */
const getScrollbarSize = (): number => {
    if (typeof _scrollbarSize !== "undefined") {
        return _scrollbarSize;
    }

    if (typeof window === "undefined") {
        return 0;
    }

    let doc = window.document.documentElement;
    let dummyScroller = window.document.createElement("div");

    dummyScroller.setAttribute(
        "style",
        `
        position:absolute;
        top:-9999px;
        width:99px;
        height:99px;
        overflow:scroll;
    `
    );

    doc.appendChild(dummyScroller);
    _scrollbarSize = dummyScroller.offsetWidth - dummyScroller.clientWidth;
    doc.removeChild(dummyScroller);

    return _scrollbarSize;
};

/**
 * 判斷目前是否有scroll bar
 *
 * @returns boolean
 */
const hasScrollbar = (): boolean => {
    if (typeof window === "undefined") {
        return false;
    }

    return window.document.documentElement.scrollHeight > window.innerHeight;
};

/**
 * 鎖定 body scroll
 *
 * @param callback
 * @returns void
 */
const lockBodyScroll = (callback?: (scrollSize: number, hasScrollbar: boolean) => void): void => {
    if (typeof window === "undefined" || _isOn) {
        return;
    }

    let doc = window.document.documentElement;
    _scrollTop = window.pageYOffset || window.scrollY;
    _scrollLeft = window.pageXOffset || window.scrollX;

    const nowSize = getScrollbarSize();
    const nowHasScrollbar = hasScrollbar();

    if (nowHasScrollbar) {
        doc.style.width = `calc(100% - ${nowSize}px)`;
    } else {
        doc.style.width = "100%";
    }

    doc.style.position = "fixed";
    doc.style.top = -_scrollTop + "px";
    doc.style.left = -_scrollLeft + "px";
    doc.style.overflow = "hidden";
    _isOn = true;

    callback && callback(nowSize, nowHasScrollbar);
};

/**
 * 解除鎖定 body scroll
 *
 * @param callback
 * @returns void
 */
const unlockBodyScroll = (callback?: () => void): void => {
    if (typeof window === "undefined" || !_isOn) {
        return;
    }

    let doc = document.documentElement;

    doc.style.width = "";
    doc.style.position = "";
    doc.style.top = "";
    doc.style.left = "";
    doc.style.overflow = "";

    window.scroll(_scrollLeft, _scrollTop);
    _isOn = false;

    callback && callback();
};

/**
 * 強制更新 解除鎖定時的 scroll top
 * @param new_scrollTop
 */
const forcedUpdatingScrollTop = (new_scrollTop: number, new_scrollLeft?: number) => {
    _scrollTop = new_scrollTop;
    if (new_scrollLeft) {
        _scrollLeft = new_scrollLeft;
    }
};

export {
    lockBodyScroll, // 鎖定 body scroll
    unlockBodyScroll, // 解除鎖定 body scroll
    forcedUpdatingScrollTop, // 強制更新 解除鎖定時的 scroll top
};
