/*=====================================
    專案定義顏色 以及 相關 method

    Author: Gray
    CreateTime: 2024 / 04 / 08
=====================================*/

/*--------------------------
	Variable
--------------------------*/

// 黑白色調
const Dark_100 = "#F7F7F9"; // F5F5F5
const Dark_200 = "#EBEBEB";
const Dark_300 = "#C3C3C3";
const Dark_400 = "#888888";
const Dark_500 = "#3A3A3A";
const Dark_600 = "#312A2B";
const Dark_700 = "#291D1F";
const Dark_800 = "#211216";
const Dark_900 = "#1B0B10";

// 綠色 (主色)
const Dingley_100 = "#F0F8E2";
const Dingley_200 = "#E0F2C6";
const Dingley_300 = "#BDD89D";
const Dingley_400 = "#93B175";
const Dingley_500 = "#5E7E45";
const Dingley_600 = "#486C32";
const Dingley_700 = "#355A22";
const Dingley_800 = "#234916";
const Dingley_900 = "#173C0D";
const Dingley = Dingley_500;

// 綠色 (成功)
const Green_100 = "#E6FBD7";
const Green_200 = "#C9F7B0";
const Green_300 = "#9FE784";
const Green_400 = "#76CF60";
const Green_500 = "#41AF33";
const Green_600 = "#289625";
const Green_700 = "#197D1E";
const Green_800 = "#10651B";
const Green_900 = "#095319";
const Green = Green_500;

// 藍色
const Blue_100 = "#CAF3FC";
const Blue_200 = "#96E2FA";
const Blue_300 = "#60C5F1";
const Blue_400 = "#39A6E4";
const Blue_500 = "#007BD3";
const Blue_600 = "#005FB5";
const Blue_700 = "#004797";
const Blue_800 = "#00327A";
const Blue_900 = "#002365";
const Blue = Blue_500;

// 黃色
const Yellow_100 = "#FDFBCE";
const Yellow_200 = "#FCF69E";
const Yellow_300 = "#F7ED6D";
const Yellow_400 = "#EFE248";
const Yellow_500 = "#E5D310";
const Yellow_600 = "#C4B30B";
const Yellow_700 = "#A49408";
const Yellow_800 = "#847605";
const Yellow_900 = "#6D6103";
const Yellow = Yellow_500;

// 紅色
const Red_100 = "#FDEACE";
const Red_200 = "#FBD09F";
const Red_300 = "#F4AC6E";
const Red_400 = "#EA8A49";
const Red_500 = "#DD5713";
const Red_600 = "#BE3D0D";
const Red_700 = "#9F2809";
const Red_800 = "#801706";
const Red_900 = "#6A0B03";
const Red = Red_500;

/*--------------------------
	Methods
--------------------------*/

/**
 * hex色碼 3 碼防呆，轉成6碼。 @see http://stackoverflow.com/a/5624139
 *
 * @param hex
 * @returns
 */
const foolproofHex = (hex: string): string => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    return hex;
};

/**
 * 用 hex 去取得 rgba 值
 *
 * @param hex (3碼 or 6碼都可以， ex: #000 or #000000)
 * @param opacity 透明度 0 ~ 1
 * @returns rgba(x,x,x,x)
 */
const hexToRgba = (hex: string, opacity: number): string | null => {
    hex = foolproofHex(hex);

    const execArray = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (!execArray) {
        return null;
    }

    return `rgba(${parseInt(execArray[1], 16)}, ${parseInt(execArray[2], 16)}, ${parseInt(
        execArray[3],
        16
    )}, ${opacity})`;
};

/**
 * 將 hex 顏色 加深或加亮
 * 參考網址： https://css-tricks.com/snippets/javascript/lighten-darken-color/
 *
 * @param hex (3碼 or 6碼都可以， ex: #000 or #000000)
 * @param amt (> 0 加亮；< 0 加深)
 * @returns hex string
 */
const lightenDarkenColor = (hex: string, amt: number): string => {
    let usePound = false;

    if (hex[0] === "#") {
        hex = hex.slice(1);
        usePound = true;
    }

    let num = parseInt(hex, 16);

    let r = (num >> 16) + amt;

    if (r > 255) {
        r = 255;
    } else if (r < 0) {
        r = 0;
    }

    let b = ((num >> 8) & 0x00ff) + amt;

    if (b > 255) {
        b = 255;
    } else if (b < 0) {
        b = 0;
    }

    let g = (num & 0x0000ff) + amt;

    if (g > 255) {
        g = 255;
    } else if (g < 0) {
        g = 0;
    }

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
};

/*--------------------------
	Export
--------------------------*/
const Colors = {
    /*--------------------------
		Variable
	--------------------------*/
    Dark_100,
    Dark_200,
    Dark_300,
    Dark_400,
    Dark_500,
    Dark_600,
    Dark_700,
    Dark_800,
    Dark_900,
    Dingley_100,
    Dingley_200,
    Dingley_300,
    Dingley_400,
    Dingley_500,
    Dingley_600,
    Dingley_700,
    Dingley_800,
    Dingley_900,
    Dingley,
    Green_100,
    Green_200,
    Green_300,
    Green_400,
    Green_500,
    Green_600,
    Green_700,
    Green_800,
    Green_900,
    Green,
    Blue_100,
    Blue_200,
    Blue_300,
    Blue_400,
    Blue_500,
    Blue_600,
    Blue_700,
    Blue_800,
    Blue_900,
    Blue,
    Yellow_100,
    Yellow_200,
    Yellow_300,
    Yellow_400,
    Yellow_500,
    Yellow_600,
    Yellow_700,
    Yellow_800,
    Yellow_900,
    Yellow,
    Red_100,
    Red_200,
    Red_300,
    Red_400,
    Red_500,
    Red_600,
    Red_700,
    Red_800,
    Red_900,
    Red,

    /*--------------------------
		Methods
	--------------------------*/
    hexToRgba,
    lightenDarkenColor,
};

export default Colors;
