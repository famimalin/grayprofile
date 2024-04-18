/*=====================================
    Button 共通樣式

    只給基本置中、顏色等
    實際按鈕大小、文字大小要繼承
    詳細看各個樣式

    Author: Gray
    CreateTime: 2024 / 04 / 08
=====================================*/
import styled, { css } from "styled-components";
import { GlobalStyle } from ".";

// 預設樣式 預設置中
const BaseStyle = css`
    display: flex;
    border: none;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s;
    cursor: pointer;
`;

// 基本按鈕 disabled狀態為半透明
const BaseButton = styled.button.attrs<{ disabled?: boolean }>({
    type: "button",
})`
    ${BaseStyle}

    ${(props) => {
        if (props.disabled) {
            return css`
                cursor: default;
                opacity: 0.5;
            `;
        } else {
            return css`
                ${GlobalStyle.getPCMedia(css`
                    &:hover {
                        opacity: 0.8;
                    }
                `)}
            `;
        }
    }}
`;

/*--------------------------
    Export
--------------------------*/
const Buttons = {
    BaseButton, // 基本按鈕
};

export default Buttons;
