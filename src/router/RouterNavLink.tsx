/*=====================================
    Router 

    Author: Gray
    CreateTime: 2024 / 04 / 10
=====================================*/
import { NavLink } from "react-router-dom";
import { getRouterPathUrl, getQueryUrl, ROUTER_PATHS, useRouterPathMatch } from "./RouterUtil";
import { IStyledComponent } from "styled-components";
import { ReactNode, useCallback } from "react";
import ClickFn from "../types/common/clickFn.type";

/*--------------------------
    Main 
--------------------------*/
type RouterNavLinkProp = {
    routerpath: ROUTER_PATHS;
    params?: { [key: string]: string };
    querys?: { [key: string]: string };
    locationState?: { [key: string]: any };
    hash?: string;
    end?: boolean;
    replace?: boolean;
    children?: ReactNode;
    onClick?: ClickFn;
    target?: string;
    isActive?: (match: any, location: any) => boolean;
    otherActivePaths?: ROUTER_PATHS[];
    stylecomponent?: IStyledComponent<any, any>;
    // 如果是 stylecomponent 用的 props 請丟進這 props 裡
    // 且命名請使用 $ 開頭，可以避免傳入 NavLink props 導致產生錯誤訊息
    // 詳情可看 https://styled-components.com/docs/api#transient-props
    stylecomponentProps?: { [key: string]: any };
};

const RouterNavLink = (props: RouterNavLinkProp) => {
    const {
        routerpath,
        params,
        querys,
        locationState,
        hash,
        end,
        replace,
        children,
        onClick,
        target,
        isActive,
        otherActivePaths = [],
        stylecomponent: StyleComponent,
        stylecomponentProps,
    } = props;

    const pathurl = getRouterPathUrl(routerpath, params);
    const queryurl = getQueryUrl(querys);
    const otherMatchMap = useRouterPathMatch(otherActivePaths, {
        end: true,
    });

    const to = {
        pathname: pathurl,
        search: queryurl,
        hash: hash,
        state: locationState,
    };

    const getIsShowActive = useCallback(
        (navLinkActive: boolean) => {
            if (isActive) {
                return isActive;
            }

            if (Array.isArray(otherActivePaths) && otherActivePaths.length > 0) {
                const isOtherActive = otherActivePaths.some((routerPath) => {
                    return !!otherMatchMap[routerPath];
                });

                return (match: any, location: any) => {
                    if (!!match) {
                        return true;
                    }
                    return isOtherActive;
                };
            }

            return navLinkActive;
        },
        [isActive, otherActivePaths, otherMatchMap]
    );

    const getNavLinkClass = useCallback(
        (navLinkActive: boolean) => {
            return getIsShowActive(navLinkActive) ? "active" : "";
        },
        [getIsShowActive]
    );

    if (StyleComponent) {
        return (
            <StyleComponent
                as={NavLink}
                to={to}
                replace={replace}
                className={({ isActive }) => getNavLinkClass(isActive)}
                target={target}
                end={end}
                onClick={onClick}
                {...stylecomponentProps}
            >
                {children}
            </StyleComponent>
        );
    } else {
        return (
            <NavLink
                to={to}
                replace={replace}
                className={({ isActive }) => getNavLinkClass(isActive)}
                target={target}
                end={end}
                onClick={onClick}
            >
                {children}
            </NavLink>
        );
    }
};

export default RouterNavLink;
export type { RouterNavLinkProp };
