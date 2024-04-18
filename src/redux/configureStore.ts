/*=====================================
    configureStore

    Author: Gray
    CreateTime: 2024 / 04 / 05
=====================================*/
import { combineReducers } from "redux";
import appReducer from "./modules/appReducer";
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./modules/projectReducer";
import skillReducer from "./modules/skillReducer";
import experienceReducer from "./modules/experienceReducer";

/*--------------------------
    rootStore Export
--------------------------*/
const actionReducers = combineReducers({
    app: appReducer,
    project: projectReducer,
    skill: skillReducer,
    experience: experienceReducer,
});

const rootStore = configureStore({
    reducer: actionReducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export default rootStore;
export type RootState = ReturnType<typeof actionReducers>;
export type RootDispatch = typeof rootStore.dispatch;
