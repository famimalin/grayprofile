/*=====================================
    SkillGroup 

    Author: Gray
    CreateTime: 2024 / 04 / 14
=====================================*/
import styled, { css } from "styled-components";
import { Colors, GlobalStyle } from "../../stylecomponents";
import SkillGroupInfo from "../../types/data/skill/skillGroupInfo.interface";

/*--------------------------
    Styled
--------------------------*/
const Content = styled.div`
    position: relative;
`;
const Header = styled.div`
    ${GlobalStyle.getPhoneMedia(css`
        text-align: center;
    `)}
`;
const Title = styled.div`
    display: inline-block;
    line-height: 1;
    padding: 0 2px 8px 2px;
    border-bottom: 2px solid ${Colors.Dingley_300};
    color: ${Colors.Dark_500};
    font-size: 22px;
    font-weight: bold;

    ${GlobalStyle.getPhoneMedia(css`
        font-size: 20px;
        padding: 0 2px 6px 2px;
    `)}
`;
const List = styled.div`
    display: flex;
    margin: 30px 0 0 0;
    padding: 0 0 0 16px;
    flex-direction: column;
    gap: 20px;

    ${GlobalStyle.getPhoneMedia(css`
        margin: 30px 0 0 0;
        padding: 0;
        gap: 18px;
    `)}
`;
const Item = styled.div`
    display: flex;
    position: relative;
    line-height: 1.4;
    color: ${Colors.Dark_500};
    font-size: 16px;
    align-items: center;

    ${GlobalStyle.getPhoneMedia(css`
        line-height: 1.3;
        font-size: 14px;
    `)}
`;
const Image = styled.div`
    width: 28px;
    min-width: 28px;
    height: 28px;
    margin: 0 20px 0 0;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;

    ${GlobalStyle.getPhoneMedia(css`
        width: 24px;
        min-width: 24px;
        height: 24px;
        margin: 0 14px 0 0;
    `)}
`;

/*--------------------------
    Main 
--------------------------*/
type SkillGroupProps = {
    groupInfo: SkillGroupInfo;
};

const SkillGroup = (props: SkillGroupProps) => {
    const { groupInfo } = props;

    const { title, list } = groupInfo;

    return (
        <Content>
            <Header>
                <Title>{title}</Title>
            </Header>
            <List>
                {list.map((item, index) => {
                    const { imageUrl, text } = item;
                    return (
                        <Item key={index}>
                            <Image
                                style={{
                                    backgroundImage: `url("${imageUrl}")`,
                                }}
                            />
                            {text}
                        </Item>
                    );
                })}
            </List>
        </Content>
    );
};

export default SkillGroup;
