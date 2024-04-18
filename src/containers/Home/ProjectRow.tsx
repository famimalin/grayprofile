/*=====================================
    ProjectRow 

    Author: Gray
    CreateTime: 2024 / 04 / 10
=====================================*/
import styled, { css } from "styled-components";
import { Buttons, Colors, GlobalStyle } from "../../stylecomponents";
import ProjectListInfo from "../../types/data/project/projectListInfo.interface";
import { useCallback } from "react";

/*--------------------------
    Styled
--------------------------*/
const Content = styled.div`
    display: flex;
    padding: 24px;
    border: 1px solid ${Colors.Dark_200};
    border-radius: 8px;
    background-color: ${Colors.Dark_100};
    align-items: center;
    gap: 40px;

    ${GlobalStyle.getTabletMedia(css`
        flex-direction: column;
        gap: 20px;
    `)}

    ${GlobalStyle.getPhoneMedia(css`
        padding: 16px;
        flex-direction: column;
        gap: 20px;
    `)}
`;
const Image = styled.div`
    min-width: 0;
    width: 400px;

    > img {
        max-width: 100%;
        max-height: 100%;
    }

    ${GlobalStyle.getTabletMedia(css`
        width: 100%;
    `)}

    ${GlobalStyle.getPhoneMedia(css`
        width: 100%;
    `)}
`;
const Info = styled.div`
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
`;
const InfoAuthor = styled.span`
    position: absolute;
    top: 0;
    right: 0;
    color: ${Colors.Dark_300};
    font-size: 14px;
    font-weight: normal;

    ${GlobalStyle.getPhoneMedia(css`
        top: -15px;
        font-size: 13px;
    `)}
`;
const InfoTitle = styled.div`
    color: ${Colors.Dark_500};
    font-size: 28px;
    font-weight: bold;

    ${GlobalStyle.getPhoneMedia(css`
        font-size: 24px;
    `)}
`;
const InfoTip = styled.div`
    margin: 4px 0 0 0;
    color: ${Colors.Dark_400};
    font-size: 14px;
`;
const InfoDesc = styled.div`
    position: relative;
    line-height: 1.6;
    margin: 12px 0 0 0;
    color: ${Colors.Dark_500};
    font-size: 16px;
    white-space: pre-wrap;
    flex: 1;

    ${GlobalStyle.getPhoneMedia(css`
        line-height: 1.4;
        margin: 10px 0 0 0;
        padding: 0 0 20px 0;
        font-size: 15px;
    `)}
`;
const InfoActions = styled.div`
    display: flex;
    margin: 20px 0 0 0;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
`;
const ActionStyle = css`
    height: 32px;
    padding: 0 20px;
    border-radius: 5px;
    color: #fff;
    font-size: 15px;
`;
const ReadMoreAction = styled(Buttons.BaseButton)`
    ${ActionStyle}
    background-color: ${Colors.Blue};
`;
const OpenUrlAction = styled(Buttons.BaseButton)`
    ${ActionStyle}
    background-color: ${Colors.Green};
`;
const InfoUrl = styled.div`
    margin: 10px 0 0 0;
    text-align: right;

    a {
        color: ${Colors.Blue};
    }
`;

/*--------------------------
    Main 
--------------------------*/
type ProjectRowProps = {
    info: ProjectListInfo;
    openProjectInfoModal?: (id: string) => void;
};

const ProjectRow = (props: ProjectRowProps) => {
    const { info, openProjectInfoModal } = props;
    const { id, title, author, imageUrl, url, participate, skill, content } = info;

    const readMore = useCallback(() => {
        openProjectInfoModal && openProjectInfoModal(id);
    }, [openProjectInfoModal, id]);

    return (
        <Content>
            <Image>
                <img src={imageUrl} alt={title} />
            </Image>
            <Info>
                <InfoAuthor>{author}</InfoAuthor>
                <InfoTitle>{title}</InfoTitle>
                <InfoTip>
                    專案參與： {participate}
                    <br />
                    使用技術： {skill}
                </InfoTip>
                <InfoDesc>{content}</InfoDesc>
                {openProjectInfoModal ? (
                    <InfoActions>
                        <OpenUrlAction as="a" href={url} target="_blank" rel="noreferrer">
                            前往網站
                        </OpenUrlAction>
                        <ReadMoreAction onClick={readMore}>了解更多</ReadMoreAction>
                    </InfoActions>
                ) : (
                    <InfoUrl>
                        <a href={url} target="_blank" rel="noreferrer">
                            {url}
                        </a>
                    </InfoUrl>
                )}
            </Info>
        </Content>
    );
};

export default ProjectRow;
