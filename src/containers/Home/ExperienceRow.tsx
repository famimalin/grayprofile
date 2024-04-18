/*=====================================
    ExperienceRow 

    Author: Gray
    CreateTime: 2024 / 04 / 10
=====================================*/
import styled, { css } from "styled-components";
import { GlobalStyle, Colors } from "../../stylecomponents";
import ExperienceListInfo from "../../types/data/experience/experienceListInfo.interface";
import { useCallback } from "react";
import { BiSolidBriefcase } from "react-icons/bi";

/*--------------------------
    Styled
--------------------------*/
const Content = styled.div`
    display: flex;
`;
const CardStyle = css`
    padding: 20px 0;
    flex: 1;

    ${GlobalStyle.getPhoneMedia(css`
        padding: 10px;
    `)}
`;
const LeftCard = styled.div`
    ${CardStyle}
    text-align: right;

    ${GlobalStyle.getTabletMedia(css`
        display: none;
    `)}

    ${GlobalStyle.getPhoneMedia(css`
        display: none;
    `)}
`;
const RightCard = styled.div`
    ${CardStyle}
    text-align: left;
`;
const Title = styled.div`
    color: ${Colors.Dark_500};
    font-size: 26px;
    font-weight: bold;

    ${GlobalStyle.getPhoneMedia(css`
        font-size: 20px;
    `)}
`;
const SubTitle = styled.div`
    margin: 4px 0 0 0;
    color: ${Colors.Dark_300};
    font-size: 16px;

    ${GlobalStyle.getPhoneMedia(css`
        margin: 2px 0 0 0;
        font-size: 13px;
    `)}
`;
const DurationText = styled.span`
    display: inline-block;
    margin: 0 0 0 20px;

    ${GlobalStyle.getPhoneMedia(css`
        display: block;
        margin: 0;
    `)}
`;
const Desc = styled.ul`
    line-height: 1.9;
    margin: 12px 0 0 0;
    padding: 0 4px;
    color: ${Colors.Dark_500};
    font-size: 17px;
    list-style: none;

    li {
        margin: 0;
        padding: 0;
    }

    ${GlobalStyle.getPhoneMedia(css`
        line-height: 1.6;
        margin: 4px 0 0 0;
        padding: 0 0 0 20px;
        font-size: 14px;
        list-style: disc;
    `)}
`;
const MiddleCard = styled.div`
    position: relative;
    display: flex;
    width: 100px;
    min-width: 100px;
    justify-content: center;

    ${GlobalStyle.getPhoneMedia(css`
        width: 40px;
        min-width: 40px;
    `)}
`;
const Divide = styled.div`
    width: 2px;
    background-color: ${Colors.Dark_200};
`;
const DivideIcon = styled.div`
    position: absolute;
    display: flex;
    top: 50%;
    left: 50%;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    color: #fff;
    font-size: 22px;
    background-color: ${Colors.Dingley_400};
    transform: translateX(-50%) translateY(-50%);
    align-items: center;
    justify-content: center;

    ${GlobalStyle.getPhoneMedia(css`
        top: 10px;
        width: 32px;
        height: 32px;
        font-size: 17px;
        transform: translateX(-50%);
    `)}
`;

/*--------------------------
    Main 
--------------------------*/
type ExperienceRowProps = {
    info: ExperienceListInfo;
    innerShow: "left" | "right";
    layout?: "default" | "onlyRight";
};

const ExperienceRow = (props: ExperienceRowProps) => {
    const { info, innerShow, layout = "default" } = props;

    const renderInner = useCallback(() => {
        const { position, employment, duration, responsibilities } = info;

        return (
            <>
                <Title>{position}</Title>
                <SubTitle>
                    {employment}
                    <DurationText>{duration}</DurationText>
                </SubTitle>
                <Desc>
                    {responsibilities.map((responsibility, index) => {
                        return <li key={index}>{responsibility}</li>;
                    })}
                </Desc>
            </>
        );
    }, [info]);

    return (
        <Content>
            {layout === "default" && <LeftCard>{innerShow === "left" && renderInner()}</LeftCard>}
            <MiddleCard>
                <Divide />
                <DivideIcon>
                    <BiSolidBriefcase />
                </DivideIcon>
            </MiddleCard>
            <RightCard>{innerShow === "right" && renderInner()}</RightCard>
        </Content>
    );
};

export default ExperienceRow;
