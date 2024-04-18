/*=====================================
    Spin

    Author: Gray
    CreateTime: 2024 / 04 / 10
=====================================*/
import styled, { keyframes } from "styled-components";
import { Colors } from "../../stylecomponents";

/*--------------------------
    Styled
--------------------------*/
const rotate360 = keyframes`
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
`;
const RotateCircle = styled.div`
    display: inline-block;
    position: relative;
    border-style: solid;
    border-radius: 100%;
    vertical-align: sub;
    animation: ${rotate360} 0.6s linear infinite;
`;

/*--------------------------
    Main 
--------------------------*/
type SpinProp = {
    size?: string;
    margin?: string;
    borderWidth?: string;
    color?: string;
    bgColor?: string;
};

const Spin = (props: SpinProp) => {
    const {
        size = "20px",
        margin = "0",
        borderWidth = "4px",
        bgColor = "transparent",
        color = Colors.Dingley_300,
    } = props;

    return (
        <RotateCircle
            style={{
                width: size,
                height: size,
                margin: margin,
                borderWidth: borderWidth,
                borderTopColor: bgColor,
                borderLeftColor: bgColor,
                borderRightColor: color,
                borderBottomColor: color,
            }}
        />
    );
};

export default Spin;
