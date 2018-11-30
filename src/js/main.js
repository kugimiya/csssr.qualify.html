import { SliderIniter, ItemsToScrollerBinding, ScrollerToItemsBinding } from "./slider";

window.addEventListener('load', () => {
    let _root = document.querySelector('.js-slider');
    let { items, scroller } = SliderIniter(_root);

    ItemsToScrollerBinding(items, scroller, _root);
    ScrollerToItemsBinding(items, scroller, _root);
});