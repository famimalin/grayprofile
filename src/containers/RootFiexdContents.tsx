/*=====================================
    RootFiexdContents 

    Author: Gray
    CreateTime: 2024 / 04 / 11
=====================================*/
import { imported } from "react-imported-component/macro";
import ImageModal from "../components/modals/ImageModal";

const ProjectInfoModal = imported(() => import("../components/modals/ProjectInfoModal"));

/*--------------------------
    Main 
--------------------------*/
type RootFiexdContentsProps = {};

const RootFiexdContents = (props: RootFiexdContentsProps) => {
    return (
        <div>
            <ProjectInfoModal />
            <ImageModal />
        </div>
    );
};

export default RootFiexdContents;
