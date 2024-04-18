/*=====================================
    工作經歷相關 api

    Author: Gray
    CreateTime: 2024 / 04 / 15
=====================================*/
import { getListResponseInfo } from "./responseInfo";
import ExperienceListData from "../data/experience/list.json";

/*--------------------------
    Methods
--------------------------*/

/**
 * [GET] 取得工作經歷列表
 */
const getExperienceList = async (req, res) => {
    const { perPage, currentPage } = req.query;
    const result = getListResponseInfo(ExperienceListData, perPage, currentPage, 1, undefined);

    res.json(result);
};

export { getExperienceList };
