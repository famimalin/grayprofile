/*=====================================
    Router 

    react-router v6 移除 history 相關，部分code有做調整

    Author: Gray
    CreateTime: 2024 / 04 / 10
=====================================*/
import {
    matchPath,
    useNavigate,
    useLocation,
    useParams,
    PathMatch,
    Location,
} from "react-router-dom";

/*--------------------------
    Variable
--------------------------*/
// prettier-ignore
enum ROUTER_PATHS {
    HOME = "/",
    PROJECT = "/project/:id",
}

/*--------------------------
    Private 
--------------------------*/
/**
 * 將網址 query 部分轉換成 object
 * @param text
 * @returns object
 * @see https://stackoverflow.com/questions/8648892/how-to-convert-url-parameters-to-a-javascript-object?page=1&tab=scoredesc#tab-top
 */
const _queryStrToObject = (text: string): { [param: string]: string } => {
    if (!text) {
        return {};
    }

    if (text.indexOf("?") === 0) {
        text = text.substring(1);
    }

    try {
        const result = JSON.parse(
            '{"' + text.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
            function (key, value) {
                return key === "" ? value : decodeURIComponent(value);
            }
        );

        return result;
    } catch (e) {
        return {};
    }
};

/*--------------------------
    Methods
--------------------------*/

/**
 * 用 routerPath 和各種參數取得實際網址
 *
 * @param routerPath
 * @param params
 * @returns url
 */
const getRouterPathUrl = (routerPath: ROUTER_PATHS, params?: { [key: string]: string }): string => {
    // 如果網址是 / 時，原先下方結果會回傳空字串，但空字串給react router不會轉址
    // 所以強制回傳 /
    if (routerPath === "/") {
        return "/";
    }

    const url_params = routerPath.split("/");
    let url_param;
    let param;
    let url = "";

    // 將params補上
    for (let i = 0; i < url_params.length; i++) {
        url_param = url_params[i];

        if (url_param.indexOf(":") === 0) {
            url_param = url_param.substring(1);
            param =
                params && (params[url_param] !== undefined || params[url_param] !== null)
                    ? params[url_param]
                    : "";
            url = url.concat("/").concat(param);
        } else if (url_param) {
            url = url.concat("/").concat(url_param);
        }
    }

    return url;
};

/**
 * 將query object轉換成query url
 *
 * @param querys
 * @returns query url
 */
const getQueryUrl = (querys?: { [key: string]: string }): string => {
    let queryUrl = "";

    if (querys) {
        queryUrl = Object.keys(querys).reduce((acc, key, index) => {
            const value = querys[key];

            let searchString;

            if (Array.isArray(value)) {
                searchString = value.reduce(
                    (sAcc, text, index) =>
                        index === 0 ? `${key}=${text}` : `${sAcc}&${key}=${text}`,
                    ""
                );
            } else {
                searchString = `${key}=${value}`;
            }

            return index === 0 ? `?${searchString}` : `${acc}&${searchString}`;
        }, "");
    }

    return queryUrl;
};

/**
 * 用 routerPath h和各種參數取得實際網址 (含 query url)
 *
 * @param routerPath
 * @param params
 * @param querys
 * @returns url
 */
const getRealUrl = (
    routerPath: ROUTER_PATHS,
    params?: { [key: string]: string },
    querys?: { [key: string]: string }
): string => {
    const url = getRouterPathUrl(routerPath, params);
    const queryUrl = getQueryUrl(querys);

    return url + queryUrl;
};

/**
 * 判斷傳入的 path 是否符合傳入的 location
 * @param location
 * @param routerPaths
 * @param options
 * @returns
 */
const matchLocation = (
    location: Location,
    routerPaths: ROUTER_PATHS[],
    options: {
        end?: boolean;
    }
) => {
    const matchMap: { [key: string]: PathMatch | null } = {};

    const { end = false } = options;

    routerPaths.forEach((routerPath) => {
        const match = matchPath(
            {
                path: routerPath,
                end: end,
            },
            location.pathname
        );

        matchMap[routerPath] = match;
    });

    return matchMap;
};

/*--------------------------
    Hooks
--------------------------*/
const useRouter = () => {
    const navigate = useNavigate();
    // const historyLength = navigate.length;

    /**
     * 用 routerPath 和各種參數轉址
     *
     * @param routerPath
     * @param params
     * @param querys
     * @param locationState
     */
    const goToUrl = (
        routerPath: ROUTER_PATHS,
        params?: { [key: string]: string },
        querys?: { [key: string]: string },
        locationState?: { [key: string]: any }
    ): void => {
        const url = getRealUrl(routerPath, params, querys);

        navigate(url, { state: locationState });
    };

    /**
     * 用 routerPath 和各種參數轉址 (replace)
     *
     * @param routerPath
     * @param params
     * @param querys
     * @param locationState
     */
    const replaceToUrl = (
        routerPath: ROUTER_PATHS,
        params?: { [key: string]: string },
        querys?: { [key: string]: string },
        locationState?: { [key: string]: any }
    ): void => {
        const url = getRealUrl(routerPath, params, querys);

        navigate(url, { replace: true, state: locationState });
    };

    /**
     * 回上一頁，如果已經沒上一頁，轉址到傳入的位置
     *
     * @param routerPath
     * @param params
     * @param querys
     * @param locationState
     * @deprecated
     */
    const goBackWithDefault = (
        routerPath: ROUTER_PATHS,
        params?: { [key: string]: string },
        querys?: { [key: string]: string },
        locationState?: { [key: string]: any }
    ): void => {
        // if (historyLength > 1) {
        navigate(-1);
        // return;
        // }

        // replaceToUrl(routerPath, params, querys, locationState);
    };

    /**
     * 用 location 轉址
     * @param location
     * @param otherState
     * @return boolean
     */
    const goToUrlByLocation = (location: any, otherState?: { [key: string]: any }): boolean => {
        if (!location || !location.pathname) {
            return false;
        }

        const url = `${location.pathname}${location.search}`;
        const locationState = Object.assign({}, location.state, otherState);

        navigate(url, { replace: true, state: locationState });

        return true;
    };

    return {
        // historyLength, // 歷史記錄長度
        goToUrl, // 用 routerPath 和各種參數轉址
        replaceToUrl, // 用 routerPath 和各種參數轉址 (replace)
        goBackWithDefault, // 回上一頁，如果已經沒上一頁，轉址到傳入的位置
        goToUrlByLocation, // 用 location 轉址
    };
};

/**
 * 判斷 router path 是否 active
 * @param routerPaths
 * @param options
 * @returns
 */
const useRouterPathMatch = (
    routerPaths: ROUTER_PATHS[],
    options: {
        end?: boolean;
        needCheckBg?: boolean;
    } = {}
): { [key: string]: PathMatch | null } => {
    const matchMap: { [key: string]: PathMatch | null } = {};
    const { end = false, needCheckBg = false } = options;

    const location = useLocation();
    const background = location.state && location.state.background;

    if (!routerPaths || routerPaths.length === 0) {
        return matchMap;
    }

    let _matchMap = matchLocation(location, routerPaths, {
        end: end,
    });

    Object.assign(matchMap, _matchMap);

    if (background && needCheckBg) {
        _matchMap = matchLocation(background, routerPaths, {
            end: end,
        });

        Object.assign(matchMap, _matchMap);
    }

    return matchMap;
};

/**
 * 取得query object
 * @returns
 */
const useQuery = () => {
    const location = useLocation();
    const searchStr = location.search;
    const result = _queryStrToObject(searchStr);

    return result;
};

/**
 * 目前位置資訊
 * @returns
 */
const useCurrentRouter = () => {
    const params = useParams();
    const querys = useQuery();
    const location = useLocation();

    return {
        routerPath: location.pathname,
        params: params,
        querys: querys,
        locationState: location.state,
    };
};

export {
    /*--------------------------
        Variable
    --------------------------*/
    ROUTER_PATHS, // router 網址路徑
    /*--------------------------
        Methods
    --------------------------*/
    getRouterPathUrl, // 用 routerPath 和各種參數取得實際網址
    getQueryUrl, // 將 query object 轉換成query url
    getRealUrl, // 用 routerPath 和各種參數取得實際網址 (含 query url)
    matchLocation, // 判斷傳入的 path 是否符合傳入的 location
    /*--------------------------
        Hooks
    --------------------------*/
    useRouter, // 歷史紀錄、轉址相關 method
    useRouterPathMatch, // 判斷 router path 是否 active
    useQuery, // 取得query object
    useCurrentRouter, // 目前位置資訊
};
