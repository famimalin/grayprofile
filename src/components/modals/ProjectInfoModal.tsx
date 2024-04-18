/*=====================================
    ProjectInfoModal 

    Author: Gray
    CreateTime: 2024 / 04 / 11
=====================================*/
import styled, { css } from "styled-components";
import { RootDispatch, RootState } from "../../redux/configureStore";
import { useDispatch, useSelector } from "react-redux";
import { ProjectActions } from "../../redux/modules/projectReducer";
import { useUpdateEffect } from "react-use";
import BaseModal from "./BaseModal";
import { Colors, GlobalStyle } from "../../stylecomponents";
import useProjectInfo from "../../hooks/project/useProjectInfo";
import Spin from "../animation/Spin";
import CustomMarkdown from "../others/CustomMarkdown";
import { IoMdClose } from "react-icons/io";
import { trackProjectModalview } from "../../utils/googleAnalyticsUtil";

/*--------------------------
    Styled
--------------------------*/
const Content = styled.div`
    position: relative;
    width: calc(100vw - 40px);
    max-width: 800px;
    min-height: calc(100vh - 40px);
    height: auto;
    margin: 20px auto;
    padding: 40px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.16);
    overflow: hidden;

    ${GlobalStyle.getPhoneMedia(css`
        padding: 20px;
    `)}
`;
const CloseButton = styled.div`
    position: absolute;
    display: flex;
    top: 0;
    right: 0;
    width: 60px;
    height: 60px;
    color: ${Colors.Dark_500};
    font-size: 18px;
    cursor: pointer;
    align-items: center;
    justify-content: center;

    &:hover {
        opacity: 0.8;
    }
`;
const Title = styled.div`
    line-height: 1;
    padding: 0 0 20px 0;
    border-bottom: 1px solid ${Colors.Dark_200};
    color: ${Colors.Dark_500};
    font-size: 32px;
    font-weight: bold;
`;
const InnerContent = styled.div`
    margin: 20px 0 0 0;
`;
const LoadingContent = styled.div`
    position: relative;
    display: flex;
    width: 100%;
    height: 300px;
    align-items: center;
    justify-content: center;
`;

/*--------------------------
    Components
--------------------------*/
type ProjectInfoProps = {
    projectId: string;
};
const ProjectInfoContent = (props: ProjectInfoProps) => {
    const { projectId } = props;
    const { info, isLoading } = useProjectInfo({ id: projectId });

    if (isLoading) {
        return (
            <LoadingContent>
                <Spin size="80px" />
            </LoadingContent>
        );
    }

    return (
        <div>
            <Title>{info?.title}</Title>
            <InnerContent>
                <CustomMarkdown mkcontent={info?.mkcontent} />
            </InnerContent>
        </div>
    );
};

/*--------------------------
    Main 
--------------------------*/
const ProjectInfoModal = () => {
    const dispatch: RootDispatch = useDispatch();
    const projectInfoModal = useSelector((state: RootState) => state.project.projectInfoModal);

    const { isOpen, projectId } = projectInfoModal;

    const closeModal = () => {
        dispatch(ProjectActions.closeProjectInfoModal());
    };

    const init = () => {
        if (isOpen && projectId) {
            trackProjectModalview(projectId);
        }
    };

    useUpdateEffect(() => {
        init();
    }, [isOpen]);

    return (
        <BaseModal
            isOpen={isOpen}
            closeMethod={closeModal}
            overlayType={"dark-overlay"}
            animate={"animate-opacity"}
            contentMargin={"0 auto"}
            removeCssTransform
            // overlayType="none-overlay"
        >
            <Content>
                <CloseButton onClick={closeModal}>
                    <IoMdClose />
                </CloseButton>
                {projectId && <ProjectInfoContent projectId={projectId} />}
            </Content>
        </BaseModal>
    );
};

export default ProjectInfoModal;
