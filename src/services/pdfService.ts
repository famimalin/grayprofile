/*=====================================
    pdf 相關 api

    Author: Gray
    CreateTime: 2024 / 04 / 15
=====================================*/
import { AppAxios, SELF_API_ROOT } from "../utils/apiUtil";

/*--------------------------
    Api Methods
--------------------------*/
// ------------------------------
// 下載 首頁 pdf
// ------------------------------
const downloadHomePDF = async () => {
    if (typeof window === "undefined") {
        return;
    }

    try {
        const url = `${SELF_API_ROOT}/pdf/downloadHomePDF`;
        const blob = await AppAxios.getApiBlobPromise("post", url);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", `Gray-Lin.pdf`);
        document.body.appendChild(link);
        link.click();
        return true;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

/*--------------------------
    Export
--------------------------*/
const PDFService = {
    downloadHomePDF, // 下載 首頁 pdf
};

export default PDFService;
