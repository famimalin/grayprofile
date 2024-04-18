/*=====================================
    useExperienceList 

    Author: Gray
    CreateTime: 2024 / 04 / 10
=====================================*/

import { useDispatch, useSelector } from "react-redux";
import { RootDispatch, RootState } from "../../redux/configureStore";
import { useMemo } from "react";
import ExperienceListInfo from "../../types/data/experience/experienceListInfo.interface";
import ExperienceService from "../../services/experienceService";
import { useEffectOnce, useUpdateEffect } from "react-use";

/*--------------------------
    Variable
--------------------------*/
let IS_HOOKS_API_LOADING = false; // 避免同畫面多個 hooks 同時發api

/*--------------------------
    Main 
--------------------------*/
type Payload = {
    perPage: number;
    currentPage: number;
};

const useExperienceList = (payload: Payload) => {
    const { perPage, currentPage } = payload;

    const dispatch: RootDispatch = useDispatch();

    const experienceListInfoMap = useSelector(
        (state: RootState) => state.experience.experienceListInfoMap
    );
    const experienceListObjMap = useSelector(
        (state: RootState) => state.experience.experienceListObjMap
    );

    /**
     * 列表 key
     */
    const listKey = useMemo(() => {
        let key = `perPage_${perPage}`;

        return key;
    }, [perPage]);

    const listObj = experienceListObjMap[listKey] || {};

    const { totalPage, isLoading, isError, isEmpty, isNoMore, pageIdListMap = {} } = listObj;

    /**
     * 取得整理過，排序過的資料列表
     */
    const formatList = useMemo(() => {
        const pageIdList = pageIdListMap[currentPage] || [];

        if (pageIdList.length === 0) {
            return [];
        }

        const list: ExperienceListInfo[] = [];

        pageIdList.forEach((id) => {
            const info = experienceListInfoMap[id];

            if (!info) {
                return;
            }

            list.push(info);
        });

        return list;
    }, [currentPage, pageIdListMap, experienceListInfoMap]);

    /**
     * 取得下一批列表
     */
    const loadNextList = () => {
        // if (isLoading || isError || isEmpty) {
        if (isLoading || IS_HOOKS_API_LOADING) {
            return;
        }

        if (totalPage >= 1 && currentPage > totalPage) {
            return;
        }

        // 已經有資料了
        if (formatList.length > 0) {
            return;
        }

        IS_HOOKS_API_LOADING = true;

        dispatch(
            ExperienceService.getExperienceList({
                listKey: listKey,
                pager: {
                    perPage: perPage,
                    currentPage: currentPage,
                },
            })
        )
            .then(() => {
                IS_HOOKS_API_LOADING = false;
            })
            .catch(() => {
                IS_HOOKS_API_LOADING = false;
            });
    };

    const reloadList = () => {
        dispatch(
            ExperienceService.getExperienceList({
                listKey: listKey,
                pager: {
                    perPage: perPage,
                    currentPage: currentPage,
                },
            })
        );
    };

    useEffectOnce(() => {
        loadNextList();
    });

    useUpdateEffect(() => {
        loadNextList();
    }, [perPage, currentPage]);

    return {
        formatList,
        totalPage,
        isLoading,
        isError,
        isEmpty,
        isNoMore,
        reloadList,
    };
};

export default useExperienceList;
