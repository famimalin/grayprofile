/*=====================================
    技能與開發經驗 相關 api

    Author: Gray
    CreateTime: 2024 / 04 / 10
=====================================*/
import { AppAxios, SELF_API_ROOT } from "../utils/apiUtil";
import { createAsyncThunk } from "@reduxjs/toolkit";

/*--------------------------
    Api Methods
--------------------------*/
// ------------------------------
// 取得 技能與開發經驗 列表
// ------------------------------
const getSkillGroupList = createAsyncThunk(
    "skill/getSkillGroupList",
    async (
        arg: {
            listKey: string;
            pager: {
                perPage: number;
                currentPage: number;
            };
        },
        thunkAPI
    ) => {
        try {
            const pager = arg.pager;
            const url = `${SELF_API_ROOT}/skills?perPage=${pager.perPage}&currentPage=${pager.currentPage}`;
            const result = await AppAxios.getApiPromise("get", url);
            return result;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

/*--------------------------
    Export
--------------------------*/
const SkillService = {
    getSkillGroupList, // 取得 技能與開發經驗 列表
};

export default SkillService;
