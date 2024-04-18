/*=====================================
    global style

    Author: Gray
    CreateTime: 2024 / 04 / 08
=====================================*/
import styled, { RuleSet, css } from "styled-components";

/*--------------------------
    Variables
--------------------------*/

const TopbarZindex = 1000; // topbar z軸
const TopbarHeight = 70; // topbar 高度
const FooterHeight = 50; // footer 高度
const PhoneMaxWidth = 599; // 手機 最大寬度
const TabletMaxWidth = 1023; // 平板 最大寬度
const ModalDefaultZindex = 2000; // modal 預設 z軸

/*--------------------------
    Style Component
--------------------------*/
const FlexBreak = styled.div`
    flex-basis: 100%;
    height: 0;
`;

/*--------------------------
	Methods
--------------------------*/

/**
 * 取得PC的 media css code
 * @param cssText
 * @returns css
 */
const getPCMedia = (cssText: RuleSet<object>): RuleSet<object> => {
    return css`
        @media (min-width: ${TabletMaxWidth + 1}px) {
            ${cssText}
        }
    `;
};

/**
 * 取得平板的 media css code
 * @param cssText
 * @returns css
 */
const getTabletMedia = (cssText: RuleSet<object>): RuleSet<object> => {
    return css`
        @media (max-width: ${TabletMaxWidth}px) and (min-width: ${PhoneMaxWidth + 1}px) {
            ${cssText}
        }
    `;
};

/**
 * 取得手機的 media css code
 * @param cssText
 * @returns css
 */
const getPhoneMedia = (cssText: RuleSet<object>): RuleSet<object> => {
    return css`
        @media (max-width: ${PhoneMaxWidth}px) {
            ${cssText}
        }
    `;
};

/**
 * 取得小於12的文字大小 (瀏覽預設最低只顯示到12px，所以只能用縮放的方式)
 * @param size
 * @returns css
 */
const getSmallFont = (size: number): RuleSet<object> => {
    if (size >= 12) {
        return css`
            font-size: ${size}px;
        `;
    }

    const rate = size / 12;

    return css`
        font-size: 12px;
        zoom: ${rate};
    `;
};

/**
 * 取得幾行要...的css
 * @param size
 * @returns css
 */
const getMultLineEllipsis = (line: number): RuleSet<object> => {
    return css`
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        -webkit-line-clamp: ${line};
        -webkit-box-orient: vertical;
    `;
};

/*--------------------------
    Export
--------------------------*/
const GlobalStyle = {
    /*--------------------------
		Variables
	--------------------------*/
    TopbarZindex, // topbar z軸
    TopbarHeight, // topbar 高度
    FooterHeight, // footer 高度
    PhoneMaxWidth, // 手機 最大寬度
    TabletMaxWidth, // 平板 最大寬度
    ModalDefaultZindex, // modal 預設 z軸

    /*--------------------------
		Component
	--------------------------*/
    FlexBreak, // 讓flex-wrap內強制換行

    /*--------------------------
		Methods
	--------------------------*/
    getPCMedia, // 取得PC的 media css code
    getTabletMedia, // 取得平板的 media css code
    getPhoneMedia, // 取得手機的 media css code
    getSmallFont, // 取得小於12的文字大小 (瀏覽預設最低只顯示到12px，所以只能用縮放的方式)
    getMultLineEllipsis, // 取得幾行要...的css
};

export default GlobalStyle;
