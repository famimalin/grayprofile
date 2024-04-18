/*=====================================
    ImageModal 

    Author: Gray
    CreateTime: 2024 / 04 / 14
=====================================*/
import Lightbox from "../../vendors/react-image-lightbox-master";
import "../../vendors/react-image-lightbox-master/style.css"; // This only needs to be imported once in your app
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/configureStore";
import { useCallback } from "react";
import { AppActions } from "../../redux/modules/appReducer";
import { GlobalStyle } from "../../stylecomponents";

/*--------------------------
    Main 
--------------------------*/
type ImageModalProps = {};

const ImageModal = (props: ImageModalProps) => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state: RootState) => state.app.imageModal.isOpen);
    const imageUrl = useSelector((state: RootState) => state.app.imageModal.imageUrl);

    const onClose = useCallback(() => {
        dispatch(AppActions.closeImageModal({}));
    }, [dispatch]);

    if (!isOpen) {
        return null;
    }

    return (
        <Lightbox
            mainSrc={imageUrl}
            onCloseRequest={onClose}
            // onAfterOpen={onAfterOpen}
            onImageLoad={() => {
                window.dispatchEvent(new Event("resize"));
            }}
            reactModalStyle={{ overlay: { zIndex: GlobalStyle.ModalDefaultZindex } }}
        />
    );
};

export default ImageModal;
