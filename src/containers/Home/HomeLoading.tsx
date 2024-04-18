/*=====================================
    HomeLoading 

    Author: Gray
    CreateTime: 2024 / 04 / 10
=====================================*/
import styled from "styled-components";
import Spin from "../../components/animation/Spin";

/*--------------------------
    Styled
--------------------------*/
const Content = styled.div`
    position: relative;
    display: flex;
    width: 100%;
    height: 160px;
    align-items: center;
    justify-content: center;
`;

/*--------------------------
    Main 
--------------------------*/
type HomeLoadingProps = {};

const HomeLoading = (props: HomeLoadingProps) => {
    return (
        <Content>
            <Spin size="80px" />
        </Content>
    );
};

export default HomeLoading;
