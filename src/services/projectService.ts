/*=====================================
    專案相關 api

    Author: Gray
    CreateTime: 2024 / 04 / 10
=====================================*/
import { AppAxios, SELF_API_ROOT } from "../utils/apiUtil";
import { createAsyncThunk } from "@reduxjs/toolkit";

/*--------------------------
    Api Methods
--------------------------*/
// ------------------------------
// 取得專案作品列表
// ------------------------------
const getProjectList = createAsyncThunk(
    "project/getProjectList",
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
            const url = `${SELF_API_ROOT}/projects?perPage=${pager.perPage}&currentPage=${pager.currentPage}`;
            const result = await AppAxios.getApiPromise("get", url);
            return result;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// ------------------------------
// 取得專案作品詳細資訊
// ------------------------------
const getProjectInfo = createAsyncThunk(
    "project/getProjectInfo",
    async (
        arg: {
            id: string;
        },
        thunkAPI
    ) => {
        try {
            const url = `${SELF_API_ROOT}/projects/${arg.id}`;
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
const ProjectService = {
    getProjectList, // 取得專案作品列表
    getProjectInfo, // 取得專案作品詳細資訊
};

export default ProjectService;
