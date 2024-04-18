/*=====================================
    Response

    Author: Gray
    CreateTime: 2024 / 04 / 15
=====================================*/

/**
 * 取得回傳結果的資料型態
 *
 * @param {object | undefined} data
 * @param {string | undefined} errorMessage
 * @returns
 */
const getDataResponseInfo = (data, errorMessage) => {
    return {
        isSuccess: !errorMessage,
        errorMessage: errorMessage,
        data: data,
    };
};

/**
 * 取得回傳結果的資料型態
 *
 * @param {object | undefined} data
 * @param {number} perPage
 * @param {number} currentPage
 * @param {number} totalPage
 * @param {string | undefined} errorMessage
 * @returns
 */
const getListResponseInfo = (data, perPage, currentPage, totalPage, errorMessage) => {
    return {
        isSuccess: !errorMessage,
        errorMessage: errorMessage,
        data: data,
        pager: {
            perPage: perPage,
            currentPage: currentPage,
            totalPage: totalPage,
        },
    };
};

export { getDataResponseInfo, getListResponseInfo };
