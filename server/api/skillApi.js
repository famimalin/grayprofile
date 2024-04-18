/*=====================================
    技術與經驗相關 api

    Author: Gray
    CreateTime: 2024 / 04 / 15
=====================================*/
import { getListResponseInfo } from "./responseInfo";
import SkillListData from "../data/skill/list.json";

/*--------------------------
    Methods
--------------------------*/

/**
 * [GET] 取得技術與經驗列表
 */
const getSkillList = async (req, res) => {
    const { perPage, currentPage } = req.query;
    const result = getListResponseInfo(SkillListData, perPage, currentPage, 1, undefined);

    res.json(result);
};

export { getSkillList };
