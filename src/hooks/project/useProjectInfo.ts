/*=====================================
    useProjectInfo 

    Author: Gray
    CreateTime: 2024 / 04 / 11
=====================================*/
import { useDispatch, useSelector } from "react-redux";
import { RootDispatch, RootState } from "../../redux/configureStore";
import ProjectService from "../../services/projectService";
import { useEffectOnce, useUpdateEffect } from "react-use";

/*--------------------------
    Variable
--------------------------*/
let IS_HOOKS_API_LOADING = false; // 避免同畫面多個 hooks 同時發api

/*--------------------------
    Main 
--------------------------*/
type Payload = {
    id: string;
};

const useProjectInfo = (payload: Payload) => {
    const { id } = payload;

    const dispatch: RootDispatch = useDispatch();
    const projectInfoObjMap = useSelector((state: RootState) => state.project.projectInfoObjMap);

    const infoObj = projectInfoObjMap[id] || {};

    const { isLoading, isError, isEmpty, info } = infoObj;

    /**
     * 取得資料
     */
    const loadInfo = () => {
        // if (isLoading || isError || isEmpty) {
        if (isLoading || IS_HOOKS_API_LOADING) {
            return;
        }

        // 已經有資料了
        if (info) {
            return;
        }

        IS_HOOKS_API_LOADING = true;

        dispatch(
            ProjectService.getProjectInfo({
                id: id,
            })
        )
            .then(() => {
                IS_HOOKS_API_LOADING = false;
            })
            .catch(() => {
                IS_HOOKS_API_LOADING = false;
            });
    };

    useEffectOnce(() => {
        loadInfo();
    });

    useUpdateEffect(() => {
        loadInfo();
    }, [id]);

    return {
        info,
        isLoading,
        isError,
        isEmpty,
    };
};

export default useProjectInfo;
