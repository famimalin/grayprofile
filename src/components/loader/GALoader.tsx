/*=====================================
    GALoader 

    Author: Gray
    CreateTime: 2023 / 01 / 18
=====================================*/
import { useCallback, useEffect, useState } from "react";
import { useEffectOnce } from "react-use";
import { initGA, trackPageview } from "../../utils/googleAnalyticsUtil";
import { useLocation } from "react-router-dom";

/*--------------------------
    Component
--------------------------*/
const GAHandleLocation = () => {
    const location = useLocation();

    useEffect(() => {
        trackPageview();
    }, [location]);

    return null;
};

/*--------------------------
    Main 
--------------------------*/
const GALoader = () => {
    const [isHandleLocation, setIsHandleLocation] = useState<boolean>(false);

    const loadGA = useCallback(() => {
        initGA(() => {
            setIsHandleLocation(true);
        });
    }, []);

    useEffectOnce(() => {
        if (typeof window === "undefined") {
            return;
        }

        loadGA();
    });

    if (isHandleLocation) {
        return <GAHandleLocation />;
    }

    return null;
};

export default GALoader;
