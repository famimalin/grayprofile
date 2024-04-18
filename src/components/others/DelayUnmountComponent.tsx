/*=====================================
    DelayUnmountComponent 

    Author: Gray
    CreateTime: 2024 / 04 / 11
=====================================*/
import { ReactNode, useState } from "react";
import { useUpdateEffect } from "react-use";
import { pureTimeout } from "../../utils/globalUtil";

/*--------------------------
    Hooks
--------------------------*/
const useDelayBoolean = (initValue: boolean, delay: number) => {
    const [value, setValue] = useState(initValue);

    const setToFalse = async () => {
        await pureTimeout(delay);
        setValue(false);
    };

    useUpdateEffect(() => {
        if (!initValue) {
            setToFalse();
        } else {
            setValue(true);
        }
    }, [initValue]);

    return value;
};

/*--------------------------
    Main 
--------------------------*/
type DelayUnmountComponentProp = {
    children: ReactNode;
    isShow: boolean;
    delay?: number;
};

const DelayUnmountComponent = (props: DelayUnmountComponentProp) => {
    const { children, isShow, delay = 300 } = props;

    const isDelayShow = useDelayBoolean(isShow, delay);

    return isDelayShow ? <>{children}</> : null;
};

export default DelayUnmountComponent;
