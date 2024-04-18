/*=====================================
    project 的 redux

    Author: Gray
    CreateTime: 2024 / 04 / 10
=====================================*/
import { createSlice } from "@reduxjs/toolkit";
import ProjectListInfo from "../../types/data/project/projectListInfo.interface";
import ProjectService from "../../services/projectService";
import {
    ApiInfoObj,
    ApiPageListObj,
    generateDefaultApiInfoObj,
    generateDefaultApiPageListObj,
} from "../../utils/apiUtil";
import ProjectInfo from "../../types/data/project/projectInfo.interface";

/*--------------------------
    store initial state
--------------------------*/
interface ProjectState {
    projectListInfoMap: { [id: string]: ProjectListInfo };
    projectListObjMap: {
        [listkey: string]: ApiPageListObj;
    };
    projectInfoObjMap: { [id: string]: ApiInfoObj<ProjectInfo> };
    projectInfoModal: {
        isOpen: boolean;
        projectId: string;
    };
}

const initialState = {
    projectListInfoMap: {},
    projectListObjMap: {},
    projectInfoObjMap: {},
    projectInfoModal: {
        isOpen: false,
        projectId: "",
    },
} as ProjectState;

const projectSlice = createSlice({
    name: "project",
    initialState: initialState,
    reducers: {
        openProjectInfoModal(
            state,
            action: {
                payload: {
                    projectId: string;
                };
            }
        ) {
            const { payload } = action;

            state.projectInfoModal.isOpen = true;
            state.projectInfoModal.projectId = payload.projectId;
        },
        closeProjectInfoModal(state) {
            state.projectInfoModal.isOpen = false;
        },
    },
    extraReducers: (builder) => {
        /**
         * [處理中] 取得專案作品列表
         */
        builder.addCase(ProjectService.getProjectList.pending, (state, { meta, payload }) => {
            const { listKey } = meta.arg;

            if (!state.projectListObjMap[listKey]) {
                state.projectListObjMap[listKey] = generateDefaultApiPageListObj();
            }

            const listObj = state.projectListObjMap[listKey];

            listObj.isLoading = true;
            listObj.isEmpty = false;
            listObj.isNoMore = false;
            listObj.isError = false;
        });
        /**
         * [成功] 取得專案作品列表
         */
        builder.addCase(ProjectService.getProjectList.fulfilled, (state, { meta, payload }) => {
            if (payload) {
                const { listKey } = meta.arg;

                const { data, pager } = payload;
                const { currentPage } = pager || { currentPage: 1 };

                if (!state.projectListObjMap[listKey]) {
                    state.projectListObjMap[listKey] = generateDefaultApiPageListObj();
                }

                const listObj = state.projectListObjMap[listKey];
                let isEmpty = false;
                let isNoMore = false;

                if (pager !== undefined && Array.isArray(data)) {
                    const size = data.length;
                    isEmpty = pager.currentPage === 1 && size === 0;
                    isNoMore = pager.currentPage >= pager.totalPage;
                    listObj.totalPage = pager.totalPage;

                    if (size > 0) {
                        const list: string[] = [];

                        data.forEach((item: ProjectListInfo) => {
                            const id = item.id;
                            state.projectListInfoMap[id] = item;
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
         * [失敗] 取得專案作品列表
         */
        builder.addCase(ProjectService.getProjectList.rejected, (state, { meta, payload }) => {
            const { listKey } = meta.arg;

            if (!state.projectListObjMap[listKey]) {
                state.projectListObjMap[listKey] = generateDefaultApiPageListObj();
            }

            const listObj = state.projectListObjMap[listKey];

            listObj.isLoading = false;
            listObj.isEmpty = true;
            listObj.isNoMore = false;
            listObj.isError = false;
        });

        /**
         * [處理中] 取得專案作品詳細資訊
         */
        builder.addCase(ProjectService.getProjectInfo.pending, (state, { meta, payload }) => {
            if (payload) {
                const { id } = meta.arg;

                if (!state.projectInfoObjMap[id]) {
                    state.projectInfoObjMap[id] = generateDefaultApiInfoObj();
                }

                const infoObj = state.projectInfoObjMap[id];

                infoObj.isLoading = true;
                infoObj.isEmpty = false;
                infoObj.isError = false;
                infoObj.info = undefined;
            }
        });
        /**
         * [成功] 取得專案作品詳細資訊
         */
        builder.addCase(ProjectService.getProjectInfo.fulfilled, (state, { meta, payload }) => {
            if (payload) {
                const { id } = meta.arg;

                if (!state.projectInfoObjMap[id]) {
                    state.projectInfoObjMap[id] = generateDefaultApiInfoObj();
                }

                const infoObj = state.projectInfoObjMap[id];
                const info = payload.data;

                infoObj.isLoading = false;
                infoObj.isError = false;

                if (info) {
                    infoObj.info = info as ProjectInfo;
                } else {
                    infoObj.isEmpty = true;
                }
            }
        });
        /**
         * [失敗] 取得專案作品詳細資訊
         */
        builder.addCase(ProjectService.getProjectInfo.rejected, (state, { meta, payload }) => {
            if (payload) {
                const { id } = meta.arg;

                if (!state.projectInfoObjMap[id]) {
                    state.projectInfoObjMap[id] = generateDefaultApiInfoObj();
                }

                const infoObj = state.projectInfoObjMap[id];

                infoObj.isLoading = false;
                infoObj.isEmpty = false;
                infoObj.isError = true;
            }
        });
    },
});

/*--------------------------
    Exprot
--------------------------*/
const ProjectReducer = projectSlice.reducer;
const ProjectActions = projectSlice.actions;
export default ProjectReducer;
export { ProjectActions };
