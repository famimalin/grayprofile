/*=====================================
    工作經歷相關 api

    Author: Gray
    CreateTime: 2024 / 04 / 10
=====================================*/
import { AppAxios, SELF_API_ROOT } from "../utils/apiUtil";
import { createAsyncThunk } from "@reduxjs/toolkit";

/*--------------------------
    Api Methods
--------------------------*/
// ------------------------------
// 取得 工作經歷 列表
// ------------------------------
const getExperienceList = createAsyncThunk(
    "experience/getExperienceList",
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
            // const pager = arg.pager;
            // const url = `${SELF_API_ROOT}/experiences?perPage=${pager.perPage}&currentPage=${pager.currentPage}`;
            const url = `${SELF_API_ROOT}/experience/experienceList.json`;
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
const ExperienceService = {
    getExperienceList, // 取得 工作經歷 列表
};

export default ExperienceService;
