export function SliderIniter (rootDomNode) {
    let items = [],
        scroller;

    rootDomNode
    .querySelectorAll('[data-item]')
    .forEach(
        item => {
            items.push({
                itemNode: item,
                itemRadioNode: item.querySelector('input[type=radio]')
            });
        }
    );

    scroller = rootDomNode.querySelector('[data-scroller]');

    scrollToElm(
        scroller,
        rootDomNode.querySelector('[data-checked="true"]').querySelector('input[type=radio]'),
        rootDomNode
    );

    return {items, scroller};
}

export function ItemsToScrollerBinding (items, scroller, root) {
    items.forEach(
        ({ itemRadioNode }) => {
            itemRadioNode.addEventListener('change', () => {
                scrollToElm(scroller, itemRadioNode, root);
            })
        }
    );
}

export function ScrollerToItemsBinding (items, scroller, root) {
    let trackingMode = false;

    scroller.addEventListener('mousedown', _toggleTracking);
    scroller.addEventListener('mouseup', _toggleTracking);
    scroller.addEventListener('mouseup', _calcNearItem);

    scroller.addEventListener('mousemove', (ev) => {
        if (!trackingMode) return;
        scrollToX(scroller, ev.clientX, root);
    });

    let scrollBar = root.querySelector('.js-slider__scroller-container');
    scrollBar.addEventListener('click', (ev) => {
        scrollToX(scroller, ev.clientX, root);
        _calcNearItem();
    });

    function _toggleTracking () {
        scroller.classList.toggle('tracking-mode');
        trackingMode = !trackingMode;
    }

    function _calcNearItem () {
        setTimeout(() => {
            let centers = [];

            items.forEach(
                ({ itemNode }) => {
                    let { left, right } = itemNode.getBoundingClientRect();
                    centers.push({
                        x: (left + right) / 2,
                        item: itemNode
                    });
                }
            );

            let { left } = scroller.getBoundingClientRect(),
                nearestIndex = 0,
                nearestItem;

            centers.forEach(
                ({ x }, _index) => {
                    nearestIndex = (Math.abs(left - x) <= Math.abs(left - centers[nearestIndex].x))
                    ? _index : nearestIndex;
                }
            )

            nearestItem = (centers[nearestIndex].item).querySelector('input[type=radio]');

            scrollToElm(scroller, nearestItem, root);
        }, 100);
    }
}


function scrollToElm (scroller, elm, root) {
    let newOffset = (elm.getBoundingClientRect().left - root.getBoundingClientRect().left)
        || 0;

    scroller.style.left = newOffset + 'px';
}

function scrollToX (scroller, _x, root) {
    let { left, width } = root.getBoundingClientRect(),
        newOffset = (_x - left) || 0;

    newOffset = newOffset >= 0 ? newOffset : 0;
    newOffset = newOffset <= (width - 5) ? newOffset : (width - 5);

    scroller.style.left = newOffset + 'px';
}