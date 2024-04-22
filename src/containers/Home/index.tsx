/*=====================================
    Home 

    Author: Gray
    CreateTime: 2024 / 04 / 07
=====================================*/
import styled, { css } from "styled-components";
import { Buttons, Colors, GlobalStyle } from "../../stylecomponents";
import useDeviceCheck from "../../hooks/useDeviceCheck";
import ExperienceRow from "./ExperienceRow";
import ProjectRow from "./ProjectRow";
import useProjectList from "../../hooks/project/useProjectList";
import HomeLoading from "./HomeLoading";
import useSkillGroupList from "../../hooks/skill/useSkillGroupList";
import useExperienceList from "../../hooks/experience/useExperienceList";
import SkillGroup from "./SkillGroup";
import SkillGroupInfo from "../../types/data/skill/skillGroupInfo.interface";
import ProjectListInfo from "../../types/data/project/projectListInfo.interface";
import ExperienceListInfo from "../../types/data/experience/experienceListInfo.interface";
import { RootDispatch } from "../../redux/configureStore";
import { useDispatch } from "react-redux";
import { useCallback, useState } from "react";
import { ProjectActions } from "../../redux/modules/projectReducer";
import PDFService from "../../services/pdfService";
import { FaGithub } from "react-icons/fa";
import { FiMail } from "react-icons/fi";

/*--------------------------
    Variable
--------------------------*/
const DefaultMaxWidth = 1080;
const DefaultPadMaxWidth = 600;
const A4_WIDTH_PX = 1240;
const A4_HEIGHT_PX = 1754;

const Test_Print = false;

/*--------------------------
    Styled
--------------------------*/
const Content = styled.div`
    position: relative;
    padding: 0 0 100px 0;

    ${GlobalStyle.getPhoneMedia(css`
        padding: 0 0 50px 0;
    `)}
`;
const Banner = styled.div<{ $isPrint?: boolean }>`
    display: flex;
    position: relative;
    width: 100%;
    height: 100vh;
    background-image: url(./images/banner.jpg);
    background-position: center center;
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;
    align-items: center;
    justify-content: center;

    ${(props) => {
        if (props.$isPrint) {
            return css`
                height: 100%;
                background-attachment: initial;
            `;
        }
    }}
`;
const BannerOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${Colors.hexToRgba(Colors.Dingley, 0.9)};
`;
const BannerContent = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;
const BannerIcon = styled.img`
    width: 120px;
    height: 120px;

    ${GlobalStyle.getPhoneMedia(css`
        width: 96px;
        height: 96px;
    `)}
`;
const BannerTitle = styled.h1`
    position: relative;
    margin: 16px 0 0 0;
    color: #fff;
    font-size: 50px;
    font-weight: 300;
    font-family: "Kaushan Script";
    transform: rotate(-4deg);

    &:before {
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        width: 50px;
        height: 4px;
        background-color: #fff;
        transform: translateX(-100%) translateX(-20px) translateY(-50%);
    }

    &:after {
        content: "";
        position: absolute;
        top: 50%;
        right: 0;
        width: 50px;
        height: 4px;
        background-color: #fff;
        transform: translateX(100%) translateX(20px) translateY(-50%);
    }

    ${GlobalStyle.getPhoneMedia(css`
        margin: 12px 0 0 0;
        font-size: 40px;
    `)}
`;
const BannerDesc = styled.div`
    margin: 16px 0 0 0;
    color: #fff;
    font-size: 16px;

    ${GlobalStyle.getPhoneMedia(css`
        margin: 12px 0 0 0;
        font-size: 15px;
    `)}
`;
const BannerIcons = styled.div`
    display: flex;
    margin: 16px 0 0 0;
    gap: 30px;

    a {
        display: flex;
        color: #fff;
        font-size: 32px;
    }
`;
const InfoBlock = styled.div`
    padding: 80px 0 0 0;

    ${GlobalStyle.getPhoneMedia(css`
        padding: 40px 0 0 0;
    `)}
`;
const InfoEnTitle = styled.div`
    line-height: 1;
    color: ${Colors.Dark_500};
    font-size: 28px;
    text-align: center;

    ${GlobalStyle.getPhoneMedia(css`
        font-size: 24px;
    `)}
`;
const InfoTitle = styled.div`
    line-height: 1;
    margin: 14px 0 0 0;
    color: ${Colors.Dark_500};
    font-size: 36px;
    font-weight: bold;
    text-align: center;

    ${GlobalStyle.getPhoneMedia(css`
        margin: 10px 0 0 0;
        font-size: 32px;
    `)}
`;
const AboutContent = styled.div`
    display: flex;
    width: calc(100% - 40px);
    max-width: ${DefaultMaxWidth}px;
    margin: 60px auto 0 auto;
    gap: 60px;
    align-items: center;

    ${GlobalStyle.getTabletMedia(css`
        margin: 40px auto 0 auto;
        max-width: ${DefaultPadMaxWidth}px;
        flex-direction: column;
        gap: 40px;
    `)}

    ${GlobalStyle.getPhoneMedia(css`
        margin: 30px auto 0 auto;
        flex-direction: column;
        gap: 30px;
    `)}
`;
const AboutImage = styled.div`
    position: relative;
    width: 240px;
    height: 240px;
    border-radius: 50px;
    background-image: url(./images/avatar.jpg);
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    overflow: hidden;

    &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.1);
    }
`;
const AboutParagraph = styled.div`
    padding: 10px 0 0 0;
    flex: 1;

    ${GlobalStyle.getPhoneMedia(css`
        padding: 0;
    `)}
`;
const AboutParagraphTitle = styled.div`
    color: ${Colors.Dark_500};
    font-size: 28px;

    ${GlobalStyle.getPhoneMedia(css`
        font-size: 24px;
    `)}
`;
const AboutParagraphDesc = styled.div`
    line-height: 1.5;
    margin: 16px 0 0 0;
    color: ${Colors.Dark_500};
    font-size: 18px;

    ${GlobalStyle.getPhoneMedia(css`
        margin: 10px 0 0 0;
        font-size: 16px;
    `)}
`;
const SkillContent = styled.div`
    display: flex;
    width: calc(100% - 40px);
    max-width: ${DefaultMaxWidth}px;
    margin: 60px auto 0 auto;
    gap: 40px;
    flex-direction: column;

    ${GlobalStyle.getPhoneMedia(css`
        margin: 30px auto 0 auto;
    `)}
`;
const ExperiencesContent = styled.div`
    width: calc(100% - 40px);
    margin: 60px auto 0 auto;

    ${GlobalStyle.getPhoneMedia(css`
        width: calc(100% - 20px);
        margin: 30px auto 0 auto;
    `)}
`;
const ProjectsContent = styled.div`
    width: calc(100% - 40px);
    max-width: ${DefaultMaxWidth}px;
    margin: 60px auto 0 auto;

    ${GlobalStyle.getTabletMedia(css`
        max-width: ${DefaultPadMaxWidth}px;
    `)}

    ${GlobalStyle.getPhoneMedia(css`
        margin: 30px auto 0 auto;
    `)}
`;
const ProjectsList = styled.div`
    display: flex;
    gap: 60px;
    flex-direction: column;

    ${GlobalStyle.getPhoneMedia(css`
        gap: 30px;
    `)}
`;
const DownloadBlock = styled.div`
    margin: 60px 0 0 0;
    text-align: center;
`;
const DownloadButton = styled(Buttons.BaseButton)`
    width: 260px;
    height: 40px;
    margin: 0 auto;
    border: 1px solid ${Colors.Dingley_300};
    border-radius: 8px;
    color: ${Colors.Dingley_300};
    font-size: 16px;
    transition: all 0.3s;

    ${(props) => {
        if (props.disabled) {
            return css`
                color: #fff;
                background-color: ${Colors.Dingley_300};
                cursor: default;
                opacity: 0.5;
            `;
        } else {
            return css`
                ${GlobalStyle.getPCMedia(css`
                    &:hover {
                        color: #fff;
                        background-color: ${Colors.Dingley_300};
                    }
                `)}
            `;
        }
    }}

    ${GlobalStyle.getPhoneMedia(css`
        width: 220px;
        height: 36px;
        font-size: 14px;
    `)}
`;
const PrintPreview = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100vw - 40px);
    height: calc(100vh - 40px);
    transform: translateX(40px) translateY(40px);
    background-color: #eee;
    overflow: scroll;
    z-index: 100000;
`;
const PrintWrapper = styled.div`
    position: relative;
    display: flex;
    background-color: #fff;
    flex-direction: column;
    align-items: center;
`;
const PrintCover = styled.div`
    position: relative;
    width: ${A4_WIDTH_PX}px;
    height: ${A4_HEIGHT_PX}px;
`;
const PrintPage = styled.div`
    position: relative;
    width: ${A4_WIDTH_PX}px;
    height: ${A4_HEIGHT_PX}px;
    padding: 20px;
    background-color: #fff;
`;
const PageNumber = styled.div`
    position: absolute;
    right: 30px;
    bottom: 20px;
    color: ${Colors.Dark_500};
    font-size: 18px;
`;

/*--------------------------
    Components
--------------------------*/
type BannerBlockProps = {
    isPrint?: boolean;
};
const BannerBlock = (props: BannerBlockProps) => {
    const { isPrint } = props;

    return (
        <Banner $isPrint={isPrint}>
            <BannerOverlay />
            <BannerContent>
                <BannerIcon src="./images/icon/coding.png" alt="coding" width="120" height="120" />
                <BannerTitle>Gray Lin</BannerTitle>
                <BannerDesc>a Web Developer.</BannerDesc>
                <BannerIcons>
                    <a href="https://github.com/famimalin" target="_blank" rel="noreferrer">
                        <FaGithub />
                    </a>
                    <a href="mailto: famimalin@gmail.com">
                        <FiMail />
                    </a>
                </BannerIcons>
            </BannerContent>
        </Banner>
    );
};
const AboutBlock = () => {
    return (
        <InfoBlock>
            <InfoEnTitle>About Me</InfoEnTitle>
            <InfoTitle>關於我</InfoTitle>
            <AboutContent>
                <AboutImage />
                <AboutParagraph>
                    <AboutParagraphTitle>Hello !</AboutParagraphTitle>
                    <AboutParagraphDesc>
                        我是 Gray，也可以叫我 阿鑫，誤打誤撞的 Web 工程師
                        <br />
                        <br />
                        目前 9
                        年多的工作經驗上，善於溝通與團隊合作外，也能獨自開發專案，而目前主要專注於前端
                        React 技術上，但也參與過後端開發、App 開發、chrome
                        插件開發、金流串接、電子發票串接、環境部屬與一些雲端服務等等，不排斥任何不同方向的領域。
                    </AboutParagraphDesc>
                </AboutParagraph>
            </AboutContent>
        </InfoBlock>
    );
};
type ExperiencesBlockProps = {
    data?: ExperienceListInfo[];
    isLoading?: boolean;
};
const ExperiencesBlock = (props: ExperiencesBlockProps) => {
    const { isMobileSize } = useDeviceCheck();
    const { data = [], isLoading } = props;

    return (
        <InfoBlock>
            <InfoEnTitle>Experiences</InfoEnTitle>
            <InfoTitle>工作經歷</InfoTitle>
            <ExperiencesContent>
                {isLoading ? (
                    <HomeLoading />
                ) : (
                    <>
                        {data.map((experiences, index) => {
                            const isRight = index % 2 === 1;
                            const isShowLeft = !isMobileSize && !isRight;

                            return (
                                <ExperienceRow
                                    key={index}
                                    info={experiences}
                                    innerShow={isShowLeft ? "left" : "right"}
                                    layout={isMobileSize ? "onlyRight" : "default"}
                                />
                            );
                        })}
                    </>
                )}
            </ExperiencesContent>
        </InfoBlock>
    );
};
const ExperiencesBlockByHooks = () => {
    const { formatList, isLoading } = useExperienceList({
        perPage: 100,
        currentPage: 1,
    });

    return <ExperiencesBlock data={formatList} isLoading={isLoading} />;
};
type ProjectsBlockProps = {
    data?: ProjectListInfo[];
    isLoading?: boolean;
    openProjectInfoModal?: (id: string) => void;
};
const ProjectsBlock = (props: ProjectsBlockProps) => {
    const { data = [], isLoading, openProjectInfoModal } = props;

    return (
        <InfoBlock>
            <InfoEnTitle>Projects</InfoEnTitle>
            <InfoTitle>專案與作品</InfoTitle>
            <ProjectsContent>
                {isLoading ? (
                    <HomeLoading />
                ) : (
                    <ProjectsList>
                        {data.map((project, index) => {
                            const { id } = project;

                            return (
                                <ProjectRow
                                    key={id}
                                    info={project}
                                    openProjectInfoModal={openProjectInfoModal}
                                />
                            );
                        })}
                    </ProjectsList>
                )}
            </ProjectsContent>
        </InfoBlock>
    );
};
const ProjectsBlockByHooks = () => {
    const dispatch: RootDispatch = useDispatch();
    const { formatList, isLoading } = useProjectList({
        perPage: 100,
        currentPage: 1,
    });

    const openProjectInfoModal = useCallback(
        (id: string) => {
            dispatch(ProjectActions.openProjectInfoModal({ projectId: id }));
        },
        [dispatch]
    );

    return (
        <ProjectsBlock
            data={formatList}
            isLoading={isLoading}
            openProjectInfoModal={openProjectInfoModal}
        />
    );
};

type SkillsBlcokProps = {
    data?: SkillGroupInfo[];
    isLoading?: boolean;
};
const SkillsBlcok = (props: SkillsBlcokProps) => {
    const { data = [], isLoading } = props;

    return (
        <InfoBlock>
            <InfoEnTitle>Skills</InfoEnTitle>
            <InfoTitle>技能與經驗</InfoTitle>
            <SkillContent>
                {isLoading ? (
                    <HomeLoading />
                ) : (
                    <>
                        {data.map((skillGroup, index) => {
                            const { id } = skillGroup;

                            return <SkillGroup key={id} groupInfo={skillGroup} />;
                        })}
                    </>
                )}
            </SkillContent>
        </InfoBlock>
    );
};

const SkillsBlcokByHooks = () => {
    const { formatList, isLoading } = useSkillGroupList({
        perPage: 100,
        currentPage: 1,
    });

    return <SkillsBlcok data={formatList} isLoading={isLoading} />;
};

type HomePDFProps = {
    experiencesData?: any;
    projectsData?: any;
    skillsData?: any;
};

const HomePDF = (props: HomePDFProps) => {
    const { experiencesData, projectsData, skillsData } = props;

    return (
        <PrintWrapper>
            <PrintCover>
                <BannerBlock isPrint />
            </PrintCover>
            <PrintPage>
                <AboutBlock />
                <ExperiencesBlock data={experiencesData} />
                <PageNumber>1</PageNumber>
            </PrintPage>
            <PrintPage>
                <ProjectsBlock data={projectsData} />
                <PageNumber>2</PageNumber>
            </PrintPage>
            <PrintPage>
                <SkillsBlcok data={skillsData} />
                <PageNumber>3</PageNumber>
            </PrintPage>
        </PrintWrapper>
    );
};

const PreviewHomePDF = () => {
    const { formatList: experiencesData } = useExperienceList({
        perPage: 100,
        currentPage: 1,
    });
    const { formatList: projectsData } = useProjectList({
        perPage: 100,
        currentPage: 1,
    });
    const { formatList: skillsData } = useSkillGroupList({
        perPage: 100,
        currentPage: 1,
    });

    return (
        <PrintPreview>
            <HomePDF
                experiencesData={experiencesData}
                projectsData={projectsData}
                skillsData={skillsData}
            />
        </PrintPreview>
    );
};

/*--------------------------
    Main 
--------------------------*/
type HomeProps = {};

const Home = (props: HomeProps) => {
    const [isDownloading, setIsDownloading] = useState<boolean>(false);

    const download = async () => {
        if (isDownloading) {
            return;
        }

        setIsDownloading(true);

        try {
            await PDFService.downloadHomePDF();
        } catch (e) {}
        setIsDownloading(false);
    };

    return (
        <>
            <Content>
                <BannerBlock />
                <AboutBlock />
                <ExperiencesBlockByHooks />
                <ProjectsBlockByHooks />
                <SkillsBlcokByHooks />
                <DownloadBlock>
                    <DownloadButton onClick={download} disabled={isDownloading}>
                        {isDownloading ? "Downloading..." : "Download my resume"}
                    </DownloadButton>
                </DownloadBlock>
            </Content>
            {Test_Print && <PreviewHomePDF />}
        </>
    );
};

export default Home;
export { HomePDF };
