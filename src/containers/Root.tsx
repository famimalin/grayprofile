/*=====================================
    Roots 

    Author: Gray
    CreateTime: 2024 / 04 / 05
=====================================*/
import { Helmet } from "react-helmet-async";
import { Navigate, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { ROUTER_PATHS } from "../router/RouterUtil";
import Home from "./Home";
import { Colors, GlobalStyle } from "../stylecomponents";
import RootFiexdContents from "./RootFiexdContents";
import GALoader from "../components/loader/GALoader";

/*--------------------------
    Styled
--------------------------*/
const Content = styled.div`
    position: relative;
    min-height: calc(100vh - ${GlobalStyle.FooterHeight}px);
`;
const Footer = styled.div`
    display: flex;
    width: 100%;
    height: ${GlobalStyle.FooterHeight}px;
    background-color: ${Colors.Dingley};
    color: #fff;
    font-size: 14px;
    align-items: center;
    justify-content: center;
`;

/*--------------------------
    Main 
--------------------------*/
type RootsProp = {};

const Roots = (props: RootsProp) => {
    return (
        <>
            <Helmet>
                <title>Gray Lin</title>
                <meta name="description" content="Hey, I'm Gray Lin. a Web Developer." />
            </Helmet>

            <Content>
                <Routes>
                    <Route path={ROUTER_PATHS.HOME} element={<Home />} />
                    <Route path="*" element={<Navigate to={ROUTER_PATHS.HOME} />} />
                </Routes>
            </Content>
            <Footer>Copyright © Gray Lin 2024</Footer>

            <RootFiexdContents />
            <GALoader />
        </>
    );
};

export default Roots;
