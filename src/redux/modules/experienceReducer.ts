/*=====================================
    experience 的 redux

    Author: Gray
    CreateTime: 2024 / 04 / 10
=====================================*/
import { createSlice } from "@reduxjs/toolkit";
import ExperienceListInfo from "../../types/data/experience/experienceListInfo.interface";
import ExperienceService from "../../services/experienceService";
import { ApiPageListObj, generateDefaultApiPageListObj } from "../../utils/apiUtil";

/*--------------------------
    store initial state
--------------------------*/
interface ExperienceState {
    experienceListInfoMap: { [id: string]: ExperienceListInfo };
    experienceListObjMap: {
        [listkey: string]: ApiPageListObj;
    };
}

const initialState = {
    experienceListInfoMap: {},
    experienceListObjMap: {},
} as ExperienceState;

const experienceSlice = createSlice({
    name: "experience",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        /**
         * [處理中] 取得專案作品列表
         */
        builder.addCase(ExperienceService.getExperienceList.pending, (state, { meta, payload }) => {
            const { listKey } = meta.arg;

            if (!state.experienceListObjMap[listKey]) {
                state.experienceListObjMap[listKey] = generateDefaultApiPageListObj();
            }

            const listObj = state.experienceListObjMap[listKey];

            listObj.isLoading = true;
            listObj.isEmpty = false;
            listObj.isNoMore = false;
            listObj.isError = false;
        });
        /**
         * [成功] 取得專案作品列表
         */
        builder.addCase(
            ExperienceService.getExperienceList.fulfilled,
            (state, { meta, payload }) => {
                if (payload) {
                    const { listKey } = meta.arg;

                    const { data, pager } = payload;
                    const { currentPage } = pager || { currentPage: 1 };

                    if (!state.experienceListObjMap[listKey]) {
                        state.experienceListObjMap[listKey] = generateDefaultApiPageListObj();
                    }

                    const listObj = state.experienceListObjMap[listKey];
                    let isEmpty = false;
                    let isNoMore = false;

                    if (pager !== undefined && Array.isArray(data)) {
                        const size = data.length;
                        isEmpty = pager.currentPage === 1 && size === 0;
                        isNoMore = pager.currentPage >= pager.totalPage;
                        listObj.totalPage = pager.totalPage;

                        if (size > 0) {
                            const list: string[] = [];

                            data.forEach((item: ExperienceListInfo) => {
                                const id = item.id;
                                state.experienceListInfoMap[id] = item;
                                list.push(id);
                            });

                            listObj.pageIdListMap[currentPage] = list;
                        }
                    }

                    listObj.isLoading = false;
                    listObj.isError = false;
                    listObj.isEmpty = isEmpty;
                    listObj.isNoMore = isNoMore;
                }
            }
        );
        /**
         * [失敗] 取得專案作品列表
         */
        builder.addCase(
            ExperienceService.getExperienceList.rejected,
            (state, { meta, payload }) => {
                const { listKey } = meta.arg;

                if (!state.experienceListObjMap[listKey]) {
                    state.experienceListObjMap[listKey] = generateDefaultApiPageListObj();
                }

                const listObj = state.experienceListObjMap[listKey];

                listObj.isLoading = false;
                listObj.isEmpty = true;
                listObj.isNoMore = false;
                listObj.isError = false;
            }
        );
    },
});

/*--------------------------
    Exprot
--------------------------*/
const ExperienceReducer = experienceSlice.reducer;
const ExperienceActions = experienceSlice.actions;
export default ExperienceReducer;
export { ExperienceActions };
