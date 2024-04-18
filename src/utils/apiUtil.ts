/*=====================================
    自己服務 api 相關 code

    Author: Gray
    CreateTime: 2024 / 04 / 10
=====================================*/
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { encryptText, decryptText, getSHA256 } from "./aesUtil";
import LocalStorageUtil from "./localStorageUtil";

/*--------------------------
    Variable
--------------------------*/
// 自家api 路徑
const SELF_API_ROOT = process.env.REACT_APP_API_ROOT_PATH;

/*--------------------------
    types
--------------------------*/
interface ApiPageInfo {
    perPage: number;
    currentPage: number;
    totalPage: number;
}

type ApiResultData = {
    isSuccess: boolean;
    errorMessage?: string;
    data?: any;
    pager?: ApiPageInfo;
};

type ApiPageListObj = {
    totalPage: number;
    isLoading: boolean;
    isNoMore: boolean;
    isEmpty: boolean;
    isError: boolean;
    pageIdListMap: { [page: number]: string[] };
};

type ApiInfoObj<T> = {
    isLoading: boolean;
    isEmpty: boolean;
    isError: boolean;
    info?: T;
};

/*--------------------------
    Methods
--------------------------*/

/**
 * 產生 api result error object
 * @param errorMessage
 * @param data
 * @returns ApiResultData
 */
const generateApiResultError = (
    errorMessage: string = "unknow error.",
    data?: any
): ApiResultData => {
    return {
        isSuccess: false,
        errorMessage: errorMessage,
        data: data,
    };
};

/**
 * 產生預設 listObj
 */
const generateDefaultApiPageListObj = (): ApiPageListObj => {
    return {
        totalPage: 0,
        isLoading: false,
        isNoMore: false,
        isEmpty: false,
        isError: false,
        pageIdListMap: {},
    };
};

/**
 * 產生預設 infoObj
 */
const generateDefaultApiInfoObj = <T>(): ApiInfoObj<T> => {
    return {
        isLoading: false,
        isEmpty: false,
        isError: false,
        info: undefined,
    };
};

/*--------------------------
    Class
--------------------------*/
class SelfAxiosInstance {
    instanceName: string;
    private instance: AxiosInstance;
    private tokensStartKey: string;
    private tokensEndKey: string;
    private loginId?: string;
    private accessToken?: string;
    private refreshToken?: string;
    private refreshTokenUrl?: string;
    private useLocalStorage?: boolean;
    private clearCallback?: () => void;
    private tokenBroadcast?: BroadcastChannel;
    private temporaryToken?: string;

    constructor(
        instanceName: string,
        options: {
            refreshTokenUrl?: string; // 重新產生 token 的api網址
            initLoginId?: string; // 預設的 login id
            initAccessToken?: string; // 預設的 token
            initRefreshToken?: string; // 預設的 token
            autoRefresh?: boolean; // default: true; 是否在 401 自動重新取得 token
            useLocalStorage?: boolean; // default: true; 是否將 token 存在 LocalStorage
            clearCallback?: () => void; // 清除 token 後的callback
        }
    ) {
        const {
            refreshTokenUrl,
            initLoginId,
            initAccessToken,
            initRefreshToken,
            autoRefresh = true,
            useLocalStorage = true,
            clearCallback,
        } = options;

        const tokensStartKey = `${instanceName}-authtokens-start`;
        const tokensEndKey = `${instanceName}-authtokens-end`;

        this.instanceName = instanceName;
        this.tokensStartKey = getSHA256(tokensStartKey);
        this.tokensEndKey = getSHA256(tokensEndKey);

        this.refreshTokenUrl = refreshTokenUrl;
        this.useLocalStorage = useLocalStorage;
        this.clearCallback = clearCallback;
        this.tokenBroadcast = undefined;

        this.instance = axios.create();

        // bind this to all methods
        this._initToken = this._initToken.bind(this);
        this._initInstance = this._initInstance.bind(this);
        this._initBroadcastChannel = this._initBroadcastChannel.bind(this);
        this._sendCurrentTokenBroadcast = this._sendCurrentTokenBroadcast.bind(this);
        this.getAuthTokens = this.getAuthTokens.bind(this);
        this.setAuthTokens = this.setAuthTokens.bind(this);
        this.clearAuthTokens = this.clearAuthTokens.bind(this);
        this.requestRefreshToken = this.requestRefreshToken.bind(this);
        this.getAuthHeader = this.getAuthHeader.bind(this);
        this.getApiPromise = this.getApiPromise.bind(this);
        this.getApiBlobPromise = this.getApiBlobPromise.bind(this);

        this._initToken(initLoginId, initAccessToken, initRefreshToken);
        this._initInstance(autoRefresh);
        this._initBroadcastChannel();
    }

    /**
     * [private] 初始化 token
     */
    _initToken(initLoginId?: string, initAccessToken?: string, initRefreshToken?: string) {
        if (initAccessToken) {
            this.loginId = initLoginId;
            this.accessToken = initAccessToken;
            this.refreshToken = initRefreshToken;
            return;
        }

        if (this.useLocalStorage) {
            const jsonStart = LocalStorageUtil.getItem(this.tokensStartKey);
            const jsonEnd = LocalStorageUtil.getItem(this.tokensEndKey);

            if (jsonStart && jsonEnd) {
                const json = decryptText(jsonStart + jsonEnd);

                try {
                    const result = JSON.parse(json);
                    this.loginId = result.loginId;
                    this.accessToken = result.accessToken;
                    this.refreshToken = result.refreshToken;
                    return;
                } catch (error) {}
            }
        }
    }

    /**
     * [private] 初始化 instance
     */
    _initInstance(autoRefresh: boolean) {
        this.instance.interceptors.request.use(
            async (config) => {
                config.headers = Object.assign(this.getAuthHeader(), config.headers);
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        this.instance.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const status = error.response?.status;

                if (status === 401) {
                    const originalRequest = error.config;

                    if (autoRefresh) {
                        const token = this.getAuthTokens();

                        if (token.refreshToken) {
                            try {
                                const isRefresh = await this.requestRefreshToken(
                                    token.refreshToken
                                );

                                if (isRefresh) {
                                    originalRequest.headers = Object.assign(
                                        originalRequest.headers,
                                        this.getAuthHeader()
                                    );

                                    return this.instance(originalRequest);
                                }
                            } catch (refreshError) {
                                // console.log(refreshError);
                            }
                        }
                    }

                    return Promise.reject("authorization token has expired");
                }

                return Promise.reject(error);
            }
        );
    }

    /**
     * [private] 初始化 通知橋樑
     */
    _initBroadcastChannel() {
        if (!this.useLocalStorage) {
            return;
        }

        if (typeof window === "undefined" || !window.BroadcastChannel) {
            return;
        }

        const bcKey = this.tokensStartKey + this.tokensEndKey;
        this.tokenBroadcast = new BroadcastChannel(bcKey);

        this.tokenBroadcast.onmessage = (
            event: MessageEvent<{
                accessToken: string | undefined;
                refreshToken: string | undefined;
            }>
        ) => {
            this.accessToken = event.data.accessToken;
            this.refreshToken = event.data.refreshToken;
        };
    }

    /**
     * [private] 發送最新token給各個分頁
     */
    _sendCurrentTokenBroadcast() {
        this.tokenBroadcast?.postMessage({
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
        });
    }

    /**
     * 取得身份驗證token
     * @returns object
     */
    getAuthTokens(): {
        loginId?: string;
        accessToken?: string;
        refreshToken?: string;
    } {
        if (this.temporaryToken) {
            return {
                accessToken: this.temporaryToken,
            };
        }

        return {
            loginId: this.loginId,
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
        };
    }

    /**
     * 儲存身份驗證token
     * @param args
     */
    setAuthTokens(args: { loginId?: string; accessToken: string; refreshToken: string }) {
        const { loginId, accessToken, refreshToken } = args;

        this.loginId = loginId;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;

        const _token = JSON.stringify(args);
        const token = encryptText(_token);
        const halfLength = Math.floor(token.length / 2);
        const startToken = token.substring(0, halfLength);
        const endToken = token.substring(halfLength);

        if (this.useLocalStorage) {
            LocalStorageUtil.setItem(this.tokensStartKey, startToken);
            LocalStorageUtil.setItem(this.tokensEndKey, endToken);
        }

        this._sendCurrentTokenBroadcast();
    }

    /**
     * 清除身份驗證token
     */
    clearAuthTokens() {
        this.loginId = undefined;
        this.accessToken = undefined;
        this.refreshToken = undefined;

        if (this.useLocalStorage) {
            LocalStorageUtil.removeItem(this.tokensStartKey);
            LocalStorageUtil.removeItem(this.tokensEndKey);
        }

        this.clearCallback && this.clearCallback();
        this._sendCurrentTokenBroadcast();
    }

    /**
     * 記錄暫時使用的 token (for singlapage, 避免真的蓋掉已登入的人)
     * @param args
     */
    setTemporaryToken(args: { temporaryToken: string }) {
        this.temporaryToken = args.temporaryToken;
    }

    /**
     * 清除暫時使用的 token
     */
    clearTemporaryToken() {
        this.temporaryToken = undefined;
    }

    /**
     * 像伺服器更新身份驗證token
     * @param refreshToken
     * @returns Promise
     */
    async requestRefreshToken(refreshToken?: string) {
        if (!this.refreshTokenUrl) {
            throw new Error("No refreshTokenUrl");
        }

        if (!refreshToken) {
            this.clearAuthTokens();
            throw new Error("No refresh token");
        }

        const url = this.refreshTokenUrl;
        const response = await axios.post(url, {
            refreshToken: refreshToken,
        });
        const responseData = response.data as ApiResultData;

        if (responseData.data?.accessToken && responseData.data?.refreshToken) {
            this.setAuthTokens({
                loginId: responseData.data.id,
                accessToken: responseData.data.accessToken,
                refreshToken: responseData.data.refreshToken,
            });

            return true;
        } else {
            this.clearAuthTokens();
            const errorMessage = responseData.errorMessage || "Refresh token is expired";
            throw new Error(errorMessage);
        }
    }

    /**
     * 取得 request 身份驗證 header
     * @returns
     */
    getAuthHeader() {
        const token = this.getAuthTokens();

        if (token && token.accessToken) {
            return { Authorization: "Bearer " + token.accessToken };
        } else {
            return {};
        }
    }

    /**
     * 取得整理過的 呼叫自家api promise
     *
     * @param httpVerb
     * @param url
     * @param data
     * @param config
     * @returns Promise
     */
    getApiPromise(
        httpVerb: "get" | "post" | "put" | "delete",
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<ApiResultData> {
        return new Promise((resolve, reject) => {
            let axiosPromise = undefined;
            let withDataConfig = undefined;

            if (data || config) {
                withDataConfig = {
                    data: data,
                    ...config,
                } as AxiosRequestConfig;
            }

            switch (httpVerb) {
                case "get":
                    axiosPromise = this.instance.get(url, withDataConfig);
                    break;
                case "post":
                    axiosPromise = this.instance.post(url, data, config);
                    break;
                case "put":
                    axiosPromise = this.instance.put(url, data, config);
                    break;
                case "delete":
                    axiosPromise = this.instance.delete(url, withDataConfig);
                    break;
            }

            axiosPromise
                .then((response) => {
                    if (!response) {
                        return reject(generateApiResultError("empty response."));
                    }

                    const responseData = response.data as ApiResultData;

                    if (!responseData) {
                        return reject(generateApiResultError("empty response data."));
                    }

                    if (!responseData.isSuccess) {
                        return reject(
                            generateApiResultError(responseData.errorMessage, responseData.data)
                        );
                    }

                    return resolve(responseData);
                })
                .catch((error) => {
                    let errorMessage = "unknow error.";

                    if (error && error.toString) {
                        errorMessage = error.toString();
                    }
                    return reject(generateApiResultError(errorMessage));
                });
        });
    }

    /**
     * 取得呼叫自家api 轉 blob 的 promise
     *
     * @param httpVerb
     * @param url
     * @param data
     * @param config
     * @returns Promise
     */
    getApiBlobPromise(
        httpVerb: "get" | "post", // 通常只會用 get, post (建議用post, get有機會亂碼)
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<Blob> {
        return new Promise((resolve, reject) => {
            let axiosPromise = undefined;
            let withDataConfig = undefined;
            const requestConfig: AxiosRequestConfig = {
                responseType: "blob",
                ...config,
            };

            if (data || config) {
                withDataConfig = {
                    data: data,
                    ...requestConfig,
                } as AxiosRequestConfig;
            }

            switch (httpVerb) {
                case "get":
                    axiosPromise = this.instance.get(url, withDataConfig);
                    break;
                case "post":
                    axiosPromise = this.instance.post(url, data, requestConfig);
                    break;
            }

            axiosPromise
                .then((response) => {
                    if (!response) {
                        return reject(generateApiResultError("empty response."));
                    }

                    const responseBlob = new Blob([response.data]);

                    if (!responseBlob) {
                        return reject(generateApiResultError("empty response data."));
                    }

                    return resolve(responseBlob);
                })
                .catch((error) => {
                    let errorMessage = "unknow error.";

                    if (error && error.toString) {
                        errorMessage = error.toString();
                    }
                    return reject(generateApiResultError(errorMessage));
                });
        });
    }
}

/*--------------------------
    Axios Variable
--------------------------*/
// 網站基本使用的 axios
const AppAxios = new SelfAxiosInstance("app", {
    refreshTokenUrl: ``,
    autoRefresh: false,
    useLocalStorage: false,
});

export {
    /*--------------------------
        Variable
    --------------------------*/
    SELF_API_ROOT, // api 路徑

    /*--------------------------
        Methods
    --------------------------*/
    generateApiResultError, // 產生 api result error object
    generateDefaultApiPageListObj, // 產生預設 listObj
    generateDefaultApiInfoObj, // 產生預設 infoObj

    /*--------------------------
        Axios Variable
    --------------------------*/
    AppAxios, // 網站基本使用的 axios
};

export type { ApiPageInfo, ApiResultData, ApiPageListObj, ApiInfoObj };
