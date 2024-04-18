/*=====================================
    LogUtil

    Author: Gray
    CreateTime: 2024 / 03 / 27
=====================================*/
import fs from "fs";
import util from "util";

/*--------------------------
    Variables
--------------------------*/
const LOGS_DIR = "logs";
const LOGS_NAME = "web.log";
const log_stdout = process.stdout;

let log_file = undefined;

/*--------------------------
    Methods
--------------------------*/

/**
 * checkDirExist
 * @param {string} type
 */
const checkDirExist = (path) => {
    const isHtmlDirExist = fs.existsSync(path);

    if (!isHtmlDirExist) {
        fs.mkdirSync(path);
    }
};

/**
 * 建立本次log檔案
 */
const createLogFile = () => {
    checkDirExist(LOGS_DIR);

    log_file = fs.createWriteStream(`${LOGS_DIR}/${LOGS_NAME}`, {
        flags: "a",
    });
};

/**
 * log
 * @param object
 */
const log = (object) => {
    if (log_file) {
        log_file.write(util.format(object) + "\n");
    }

    log_stdout.write(util.format(object) + "\n");
};

/**
 * init
 */
const init = () => {
    createLogFile();
};

const LogUtil = {
    log,
    init,
};

export default LogUtil;
