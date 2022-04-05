import {render} from "./render";
import {h} from "./vnode";
import {isString} from "../utils";

export function createApp(rootComponent) {
    const app = {
        mount(rootContainer) {
            if (isString(rootContainer)) rootContainer = document.querySelector(rootContainer)
            render(h(rootComponent),rootContainer)
        }
    }
    return app
}
