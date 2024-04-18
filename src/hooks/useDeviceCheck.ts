/*=====================================
    取得專案的裝置檢查

    Author: Gray
    CreateTime: 2024 / 04 / 10
=====================================*/
import { useMediaQuery } from "react-responsive";
import { GlobalStyle } from "../stylecomponents";

/*--------------------------
    Main
--------------------------*/
const useDeviceCheck = () => {
    const isTabletSize = useMediaQuery({
        minWidth: GlobalStyle.PhoneMaxWidth,
        maxWidth: GlobalStyle.TabletMaxWidth,
    });

    const isPhoneSize = useMediaQuery({
        maxWidth: GlobalStyle.PhoneMaxWidth,
    });

    const isMobileSize = isTabletSize || isPhoneSize;
    const isPCSize = !isMobileSize;

    return {
        isTabletSize,
        isPhoneSize,
        isMobileSize,
        isPCSize,
    };
};

export default useDeviceCheck;
