/*=====================================
    skill 的 redux

    Author: Gray
    CreateTime: 2024 / 04 / 10
=====================================*/
import { createSlice } from "@reduxjs/toolkit";
import SkillGroupInfo from "../../types/data/skill/skillGroupInfo.interface";
import SkillService from "../../services/skillService";
import { ApiPageListObj, generateDefaultApiPageListObj } from "../../utils/apiUtil";

/*--------------------------
    store initial state
--------------------------*/
interface SkillState {
    skillGroupListInfoMap: { [id: string]: SkillGroupInfo };
    skillGroupListObjMap: {
        [listkey: string]: ApiPageListObj;
    };
}

const initialState = {
    skillGroupListInfoMap: {},
    skillGroupListObjMap: {},
} as SkillState;

const skillSlice = createSlice({
    name: "skill",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        /**
         * [處理中] 取得 技能與開發經驗 列表
         */
        builder.addCase(SkillService.getSkillGroupList.pending, (state, { meta, payload }) => {
            const { listKey } = meta.arg;

            if (!state.skillGroupListObjMap[listKey]) {
                state.skillGroupListObjMap[listKey] = generateDefaultApiPageListObj();
            }

            const listObj = state.skillGroupListObjMap[listKey];

            listObj.isLoading = true;
            listObj.isEmpty = false;
            listObj.isNoMore = false;
            listObj.isError = false;
        });
        /**
         * [成功] 取得 技能與開發經驗 列表
         */
        builder.addCase(SkillService.getSkillGroupList.fulfilled, (state, { meta, payload }) => {
            if (payload) {
                const { listKey } = meta.arg;

                const { data, pager } = payload;
                const { currentPage } = pager || { currentPage: 1 };

                if (!state.skillGroupListObjMap[listKey]) {
                    state.skillGroupListObjMap[listKey] = generateDefaultApiPageListObj();
                }

                const listObj = state.skillGroupListObjMap[listKey];
                let isEmpty = false;
                let isNoMore = false;

                if (pager !== undefined && Array.isArray(data)) {
                    const size = data.length;
                    isEmpty = pager.currentPage === 1 && size === 0;
                    isNoMore = pager.currentPage >= pager.totalPage;
                    listObj.totalPage = pager.totalPage;

                    if (size > 0) {
                        const list: string[] = [];

                        data.forEach((item: SkillGroupInfo) => {
                            const id = item.id;
                            state.skillGroupListInfoMap[id] = item;
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
        });
        /**
         * [失敗] 取得 技能與開發經驗 列表
         */
        builder.addCase(SkillService.getSkillGroupList.rejected, (state, { meta, payload }) => {
            const { listKey } = meta.arg;

            if (!state.skillGroupListObjMap[listKey]) {
                state.skillGroupListObjMap[listKey] = generateDefaultApiPageListObj();
            }

            const listObj = state.skillGroupListObjMap[listKey];

            listObj.isLoading = false;
            listObj.isEmpty = true;
            listObj.isNoMore = false;
            listObj.isError = false;
        });
    },
});

/*--------------------------
    Exprot
--------------------------*/
const SkillReducer = skillSlice.reducer;
const SkillActions = skillSlice.actions;
export default SkillReducer;
export { SkillActions };
