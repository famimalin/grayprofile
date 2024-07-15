import "styled-components";

declare global {
    interface Window {
        dataLayer: any[];
    }
}

type Theme = {
    color: string;
    backgroundColor: string;
    textColor: string;
};

declare module "styled-components" {
    export interface DefaultTheme extends Theme {}
}

export default global;
