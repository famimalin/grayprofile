/*=====================================
    PDF相關 api

    Author: Gray
    CreateTime: 2024 / 04 / 15
=====================================*/
import React from "react";
import path from "path";
import fs from "fs";
import { renderToString } from "react-dom/server";
import { StyleSheetManager, ServerStyleSheet } from "styled-components";
import { HomePDF } from "../../src/containers/Home";
import { Context as ResponsiveContext } from "react-responsive";
import LogUtil from "../logutil";

import ExperienceListData from "../data/experience/list.json";
import ProjectListData from "../data/project/list.json";
import SkillListData from "../data/skill/list.json";
import puppeteer from "puppeteer";

/*--------------------------
    Variable
--------------------------*/
const PORT = process.env.PORT || 8080;
const APP_URL = `http://127.0.0.1:${PORT}`;
const PUPPETEER_NO_SANDBOX = process.env.PUPPETEER_NO_SANDBOX === "true";

const HOME_PDF_NAME = "Gray-Lin.pdf";

let CacheHomePdf = undefined;
let CacheAppCss = undefined;

/*--------------------------
    Methods
--------------------------*/

/**
 * 載入專案預設css
 */
const getResetCssStyle = async () => {
    if (CacheAppCss) {
        return CacheAppCss;
    }

    const documentStyles = fs.readFileSync(path.resolve(__dirname, "../../src/App.css"), "utf-8");
    if (!documentStyles) {
        return ``;
    }

    const style = documentStyles.replace(/\r\n|\n/g, "");
    CacheAppCss = `<style>${style}</style>`;
    return CacheAppCss;
};

const getImportCssStyle = () => {
    return `
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap"
            rel="stylesheet"
        />
        <link
            href="https://fonts.googleapis.com/css2?family=Kaushan+Script&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
        />
    `;
};

/**
 * [GET] 下載首頁的 pdf
 */
const downloadHomePDF = async (req, res) => {
    const sheet = new ServerStyleSheet();

    try {
        if (CacheHomePdf) {
            res.writeHead(200, {
                "Content-Length": Buffer.byteLength(CacheHomePdf),
                "Content-Type": "application/pdf; charset=utf-8",
                "Content-disposition": `attachment;filename=${HOME_PDF_NAME}`,
            }).end(CacheHomePdf);
            return;
        }

        // Create a browser instance
        const browser = PUPPETEER_NO_SANDBOX
            ? await puppeteer.launch({
                  args: ["--no-sandbox", "--disable-setuid-sandbox"],
              })
            : await puppeteer.launch();

        // Create a new page
        const page = await browser.newPage();

        let body = renderToString(
            sheet.collectStyles(
                <ResponsiveContext.Provider value={{ width: 1920 }}>
                    <StyleSheetManager enableVendorPrefixes>
                        <HomePDF
                            experiencesData={ExperienceListData}
                            projectsData={ProjectListData}
                            skillsData={SkillListData}
                        />
                    </StyleSheetManager>
                </ResponsiveContext.Provider>
            )
        );

        let importStyle = getImportCssStyle();
        let resetStyle = await getResetCssStyle();
        let styles = sheet.getStyleTags();

        body = body.replace(/\.\/images\//g, `${APP_URL}/images/`);
        styles = styles.replace(/\.\/images\//g, `${APP_URL}/images/`);

        const html = `<!DOCTYPE html><html><head>${importStyle}${resetStyle}${styles}</head><body>${body}</body></html>`;

        await page.setContent(html, { waitUntil: "domcontentloaded" });
        await page.emulateMediaType("screen");

        // Downlaod the PDF
        const pdfData = await page.pdf({
            width: "1240px",
            height: "1754px",
            printBackground: true,
        });

        CacheHomePdf = pdfData;

        res.writeHead(200, {
            "Content-Length": Buffer.byteLength(CacheHomePdf),
            "Content-Type": "application/pdf; charset=utf-8",
            "Content-disposition": `attachment;filename=${HOME_PDF_NAME}`,
        }).end(CacheHomePdf);

        await browser.close();
    } catch (error) {
        // handle error
        LogUtil.log(error);
        res.status(400).end();
    } finally {
        sheet.seal();
    }
};

export { downloadHomePDF };
