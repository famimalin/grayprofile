/*=====================================
    App

    Author: Gray
    CreateTime: 2024 / 04 / 05
=====================================*/
import { Provider } from "react-redux";
import rootStore from "./redux/configureStore";
import Root from "./containers/Root";
import "./App.css";
import { StyleSheetManager } from "styled-components";

/*--------------------------
    Main 
--------------------------*/
const App = () => {
    return (
        <Provider store={rootStore}>
            <StyleSheetManager enableVendorPrefixes>
                <Root />
            </StyleSheetManager>
        </Provider>
    );
};

export default App;
