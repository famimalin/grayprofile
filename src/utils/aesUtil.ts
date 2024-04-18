/*=====================================
    aes 加密

    Author: Gray
    CreateTime: 2024 / 04 / 10
=====================================*/
import CryptoJS from "crypto-js"; // aes加密

/*--------------------------
    Variable
--------------------------*/
const secretKey = "famimalinprofileaeskeysecret";

/*--------------------------
    Methods
--------------------------*/

/**
 * 加密
 * @param text
 * @returns string
 */
const encryptText = (text: string) => {
    let encrypted = CryptoJS.AES.encrypt(text, secretKey);
    return encrypted.toString();
};

/**
 * 解密
 * @param ciphertext
 * @returns string
 */
const decryptText = (ciphertext: string) => {
    let decrypted = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return decrypted.toString(CryptoJS.enc.Utf8);
};

/**
 * 取得 SHA256 值
 * @param text
 */
const getSHA256 = (text: string) => {
    let sha256 = CryptoJS.SHA256(text);
    return sha256.toString();
};

export {
    encryptText, // 加密
    decryptText, // 解密
    getSHA256, //  取得 SHA256 值
};
