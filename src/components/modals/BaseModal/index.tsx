/*=====================================
    BaseModal

    Author: Gray
    CreateTime: 2024 / 04 / 11
=====================================*/
import { ReactNode, useEffect, useMemo, useState } from "react";
import ReactModal from "react-modal";
import { GlobalStyle } from "../../../stylecomponents";
import { lockBodyScroll, unlockBodyScroll } from "../../../utils/scrollUtil";
import "./style.scss";

ReactModal.setAppElement("#root");

/*--------------------------
    Main 
--------------------------*/

type BaseModalProp = {
    modalId?: string;
    isOpen: boolean;
    children: ReactNode;
    closeMethod: () => void;
    contentHeight?: string;
    contentMargin?: string;
    contentPadding?: string;
    zIndex?: number;
    animate?:
        | "no-animate"
        | "animate-fade"
        | "animate-slide-bottom2top"
        | "animate-slide-right2left"
        | "animate-opacity";
    overlayType?:
        | "dark-overlay"
        | "gray-overlay"
        | "blur-overlay"
        | "deepen-blur-overlay"
        | "white-overlay"
        | "none-overlay";
    shouldCloseOnOverlayClick?: boolean;
    shouldCloseOnEsc?: boolean;
    needOverflowXAuto?: boolean;
    setOverlayNode?: (instance: HTMLDivElement) => void;
    removeCssTransform?: boolean;
};

const BaseModal = (props: BaseModalProp) => {
    const {
        modalId,
        isOpen,
        children,
        closeMethod,
        contentHeight = "auto",
        contentMargin = "auto",
        contentPadding = "0",
        zIndex = GlobalStyle.ModalDefaultZindex,
        animate = "animate-fade",
        overlayType = "dark-overlay",
        shouldCloseOnOverlayClick = true,
        shouldCloseOnEsc = true,
        needOverflowXAuto,
        setOverlayNode,
        removeCssTransform,
    } = props;

    const [hasEntered, setHasEntered] = useState<boolean>(false);

    const { underlayClass, dialogClass } = useMemo(() => {
        let underlayClass = `base-modal-overlay ${overlayType} ${animate}`;
        let dialogClass = `base-modal-content ${animate}`;

        if (hasEntered) {
            underlayClass += " active";
            dialogClass += " active";
        }

        if (needOverflowXAuto) {
            underlayClass += ` overflow-x-auto`;
        }

        if (removeCssTransform) {
            dialogClass += ` remove-css-transform`;
        }

        return {
            underlayClass,
            dialogClass,
        };
    }, [overlayType, animate, hasEntered, needOverflowXAuto, removeCssTransform]);

    const onAfterOpen = () => {
        setHasEntered(true);

        if (typeof window !== "undefined") {
            const modalDocs = window.document.getElementsByClassName("base-modal-content");

            // 已經有其他 modal
            if (modalDocs.length > 1) {
                return;
            }
        }

        // 鎖定 scroll, topbar更動寬度，避免抖動
        lockBodyScroll((scrollSize, hasScrollbar) => {
            if (hasScrollbar) {
                let topbar = document.getElementById("topbar");
                let dashboardSubTitle = document.getElementById("dashboard-sub-title");
                let dashboardSubContentBackground = document.getElementById(
                    "dashboard-sub-content-background"
                );

                if (topbar) {
                    topbar.style.width = `calc(100% - ${scrollSize}px)`;
                }

                if (dashboardSubTitle) {
                    dashboardSubTitle.style.paddingRight = `${scrollSize}px`;
                }

                if (dashboardSubContentBackground) {
                    dashboardSubContentBackground.style.width = `calc(100% - ${scrollSize}px)`;
                }
            }
        });
    };

    const onAfterClose = () => {
        if (typeof window !== "undefined") {
            const modalDocs = window.document.getElementsByClassName("base-modal-content");

            // 還有其他 modal
            if (modalDocs.length > 0) {
                return;
            }
        }

        // 解除鎖定 scroll, topbar復原，避免抖動
        unlockBodyScroll(() => {
            let topbar = document.getElementById("topbar");
            let dashboardSubTitle = document.getElementById("dashboard-sub-title");
            let dashboardSubContentBackground = document.getElementById(
                "dashboard-sub-content-background"
            );

            if (topbar) {
                topbar.style.width = "";
            }

            if (dashboardSubTitle) {
                dashboardSubTitle.style.paddingRight = "";
            }

            if (dashboardSubContentBackground) {
                dashboardSubContentBackground.style.width = "";
            }
        });
    };

    useEffect(() => {
        if (!isOpen) {
            setHasEntered(false);
        }
    }, [isOpen]);

    return (
        <ReactModal
            overlayRef={setOverlayNode}
            isOpen={isOpen}
            style={{
                overlay: {
                    zIndex: zIndex,
                    cursor: shouldCloseOnOverlayClick ? "pointer" : "default",
                },
                content: {
                    height: contentHeight,
                    margin: contentMargin,
                    padding: contentPadding,
                },
            }}
            onAfterOpen={onAfterOpen}
            onAfterClose={onAfterClose}
            onRequestClose={closeMethod}
            overlayClassName={underlayClass}
            className={dialogClass}
            // 動畫效果雖然是300ms，但要解除鎖scroll，設定比300小一點才能避免解鎖失敗
            closeTimeoutMS={animate === "no-animate" ? 0 : 250}
            shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
            shouldCloseOnEsc={shouldCloseOnEsc}
            overlayElement={(props, contentElement) => (
                <div {...props} id={modalId}>
                    {contentElement}
                </div>
            )}
        >
            {children}
        </ReactModal>
    );
};

export default BaseModal;
