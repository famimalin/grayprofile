import path from "path";
import fs from "fs";
import React from "react";
import { renderToString } from "react-dom/server";
import { matchPath } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { ServerStyleSheet } from "styled-components";
import { Context as ResponsiveContext } from "react-responsive";
import App from "../src/App.tsx";
import { drainHydrateMarks } from "react-imported-component";
import { ROUTER_PATHS } from "../src/router/RouterUtil.ts";

/*--------------------------
    Varaible
--------------------------*/
const PhoneMaxWidth = 599;
const TabletMaxWidth = 1023;
const PcWidth = 1920;
const helmetContext = {};

/*--------------------------
    Methods
--------------------------*/
const formatUrlFromRouter = (uri) => {
    let result = undefined;

    for (let key in ROUTER_PATHS) {
        const routerPath = ROUTER_PATHS[key];
        const match = matchPath(
            {
                path: routerPath,
                end: false,
            },
            uri
        );

        if (match) {
            result = match;
        }
    }

    return result ? result.url : undefined;
};

const checkUrl = (req) => {
    let uri = req.url;

    uri = formatUrlFromRouter(uri);

    if (!uri) {
        return undefined;
    }

    return uri;
};

const getRequestDeviceInfo = (headers) => {
    const result = {
        isPhone: false,
        isTablet: false,
        isPc: true,
        width: PcWidth,
    };

    if (!headers) {
        return result;
    }

    try {
        const clientHints = headers["Accept-CH"] || headers["accept-CH"] || headers["accept-ch"];
        const scuMobile = headers["sec-ch-ua-mobile"] || headers["Sec-CH-UA-Mobile"];
        const userAgent = headers["user-agent"] || headers["User-Agent"];

        if (clientHints) {
            const ch_width_str = clientHints.split(",")[0];
            const ch_width = Number(ch_width_str);

            if (!isNaN(ch_width) && ch_width > 0) {
                result.isPhone = ch_width <= PhoneMaxWidth + 1;
                result.isTablet = ch_width > PhoneMaxWidth + 1 && ch_width <= TabletMaxWidth;
                result.isPc = ch_width > TabletMaxWidth + 1;
                result.width = ch_width;

                return result;
            }
        }

        if (scuMobile && scuMobile === "?1") {
            result.isPhone = true;
            result.isTablet = false;
            result.isPc = false;
            result.width = PhoneMaxWidth;

            return result;
        }

        if (userAgent) {
            if (userAgent.indexOf("Android") > -1) {
                result.isPhone = true;
                result.isTablet = false;
                result.isPc = false;
                result.width = PhoneMaxWidth;
            } else if (userAgent.indexOf("iPhone") > -1) {
                result.isPhone = true;
                result.isTablet = false;
                result.isPc = false;
                result.width = PhoneMaxWidth;
            } else if (userAgent.indexOf("iPad") > -1) {
                result.isPhone = false;
                result.isTablet = true;
                result.isPc = false;
                result.width = TabletMaxWidth;
            }

            return result;
        }

        return result;
    } catch (error) {
        return result;
    }
};

let IndexHtml;
let isIndexHtmlError = false;

const loadIndexHtml = () => {
    return new Promise((resolve, reject) => {
        if (IndexHtml) {
            resolve(IndexHtml);
            return;
        }

        if (isIndexHtmlError) {
            reject(false);
            return;
        }

        fs.readFile(path.resolve(__dirname, "../build/index.html"), "utf8", (err, htmlData) => {
            if (err) {
                isIndexHtmlError = true;
                reject(false);
                return;
            }
            IndexHtml = htmlData;
            resolve(IndexHtml);
        });
    });
};

export default (req, res) => {
    const deviceInfo = getRequestDeviceInfo(req.headers);

    // 載入 build / index.html 內容後轉為字串，然後將實際畫面會有的內容補齊至該字串內後輸出出去
    loadIndexHtml()
        .then((htmlData) => {
            const sheet = new ServerStyleSheet();

            const _locationUrl = checkUrl(req);
            const locationUrl = _locationUrl ? _locationUrl : ROUTER_PATHS.HOME;

            try {
                const body = renderToString(
                    sheet.collectStyles(
                        <HelmetProvider context={helmetContext}>
                            <ResponsiveContext.Provider value={{ width: deviceInfo.width }}>
                                <StaticRouter location={locationUrl}>
                                    <App wording="THIS IS Server Side Render" />
                                    {/* <div></div> */}
                                </StaticRouter>
                            </ResponsiveContext.Provider>
                        </HelmetProvider>
                    )
                );

                const helmet = helmetContext.helmet || {};
                const title = helmet.title ? helmet.title.toString() : "";
                const meta = helmet.meta ? helmet.meta.toString() : "";
                const styles = sheet.getStyleTags();

                const html = injectHTML(htmlData, {
                    title: title,
                    meta: meta,
                    body: body,
                    styles: styles,
                });

                res.send(html);
            } catch (error) {
                // handle error
                console.error(error);

                // 還是回傳html給前端，畢竟前端檔案是在的，可能只是 renderToString 出錯
                const html = injectHTML(htmlData);
                res.send(html);
                // res.status(404).end();
            } finally {
                sheet.seal();
            }
        })
        .catch((e) => {
            console.log(e);
            console.error(`Error page`);
            return res.status(404).end();
        });
};

const injectHTML = (data, { title, meta, body, styles }) => {
    if (title) {
        data = data.replace(/<title>.*?<\/title>/g, title);
    }
    if (meta) {
        data = data.replace("</head>", `${meta}</head>`);
    }
    if (styles) {
        data = data.replace("<style></style>", styles);
    }

    // const marks = printDrainHydrateMarks();
    const marks = "<script>const marks=" + JSON.stringify(drainHydrateMarks()) + "</script>";

    data = data.replace('<div id="root"></div>', `<div id="root">${body}${marks}</div>`);

    return data;
};
