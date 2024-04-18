/*=====================================
    CustomMarkdown 

    Author: Gray
    CreateTime: 2024 / 04 / 14
=====================================*/
import styled, { css } from "styled-components";
import { useEffectOnce, useUnmount, useUpdateEffect } from "react-use";
import { useCallback, useState } from "react";
import { AppActions } from "../../redux/modules/appReducer";
import { useDispatch } from "react-redux";
import { Colors, GlobalStyle } from "../../stylecomponents";
import { marked } from "marked";

/*--------------------------
    Styled
--------------------------*/
const Content = styled.div`
    a {
        color: ${Colors.Blue};
    }

    table {
        border-spacing: 0;
        border-collapse: collapse;

        tr {
            display: table-row;
            border-top: 1px solid #ccc;
            background-color: #fff;
            vertical-align: inherit;
            unicode-bidi: isolate;
        }

        th {
            padding: 6px 13px;
            border: 1px solid #ddd;
            font-weight: 700;
            text-align: left;
        }

        td {
            display: table-cell;
            min-width: 140px;
            padding: 6px 13px;
            border: 1px solid #ddd;
            vertical-align: inherit;
            unicode-bidi: isolate;
        }
    }

    img {
        display: block;
        max-width: 100%;
        max-height: 300px;
        margin: 2px auto;
        cursor: zoom-in;
    }

    ${GlobalStyle.getPhoneMedia(css`
        table {
            th {
                padding: 3px 6px;
            }

            td {
                min-width: 80px;
                padding: 3px 6px;
            }
        }
    `)}
`;

/*--------------------------
    Main 
--------------------------*/
type CustomMarkdownProps = {
    mkcontent?: string;
};

const CustomMarkdown = (props: CustomMarkdownProps) => {
    const { mkcontent = "" } = props;
    const dispatch = useDispatch();

    const [htmlText, setHtmlText] = useState<string>("");

    const listener = useCallback(
        (event: Event) => {
            const c_event = event as CustomEvent<string>;

            if (!c_event.detail) {
                return;
            }

            dispatch(
                AppActions.openImageModal({
                    imageUrl: c_event.detail,
                })
            );
        },
        [dispatch]
    );

    const init = () => {
        if (!mkcontent) {
            setHtmlText("");
            return;
        }

        const renderer = new marked.Renderer();
        const tokenizer = new marked.Tokenizer();

        renderer.link = (href, title, text) => {
            let link = marked.Renderer.prototype.link.call(this, href, title, text);
            return link.replace("<a", "<a target='_blank' ");
        };

        renderer.image = (href: string, title: string | null, text: string) => {
            const onClickText = `
                window.dispatchEvent(new CustomEvent('img-click', { detail: src }));
            `;
            return `<img src="${href}" alt="${text}" onclick="${onClickText}"/>`;
        };

        const preview = marked.parse(mkcontent, {
            breaks: true,
            gfm: true,
            renderer: renderer,
            tokenizer: tokenizer,
        });

        if (typeof preview === "string") {
            setHtmlText(preview);
        } else {
            preview
                .then((result) => {
                    setHtmlText(result);
                })
                .catch((error) => {
                    setHtmlText("");
                });
        }
    };

    useEffectOnce(() => {
        init();
    });

    useUpdateEffect(() => {
        init();
    }, [mkcontent]);

    useEffectOnce(() => {
        if (typeof window === "undefined") {
            return;
        }
        window.addEventListener("img-click", listener);
    });

    useUnmount(() => {
        if (typeof window === "undefined") {
            return;
        }
        window.removeEventListener("img-click", listener);
    });

    return <Content dangerouslySetInnerHTML={{ __html: htmlText }}></Content>;
};

export default CustomMarkdown;
