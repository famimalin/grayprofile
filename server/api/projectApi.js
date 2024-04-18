/*=====================================
    專案相關 api

    Author: Gray
    CreateTime: 2024 / 04 / 15
=====================================*/
import { getListResponseInfo, getDataResponseInfo } from "./responseInfo";
import ProjectListData from "../data/project/list.json";
import OnecrmData from "../data/project/onecrm.json";
import CupoyData from "../data/project/cupoy.json";
import JcolorData from "../data/project/jcolor.json";

/*--------------------------
    Methods
--------------------------*/

/**
 * [GET] 取得專案列表
 */
const getProjectList = async (req, res) => {
    const { perPage, currentPage } = req.query;
    const result = getListResponseInfo(ProjectListData, perPage, currentPage, 1, undefined);

    res.json(result);
};

/**
 * [GET] 取得專案資訊
 */
const getProjectInfo = async (req, res) => {
    const { id } = req.params;

    let result;

    switch (id) {
        case "onecrm":
            result = getDataResponseInfo(OnecrmData, undefined);
            break;
        case "cupoy":
            result = getDataResponseInfo(CupoyData, undefined);
            break;
        case "jcolor":
            result = getDataResponseInfo(JcolorData, undefined);
            break;
        default:
            result = getDataResponseInfo(undefined, "查無資料");
            break;
    }

    res.json(result);
};

export { getProjectList, getProjectInfo };
