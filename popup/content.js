const createTooltipOnTopOfSelectedNode = (convertedText) => {
    // TODO: Figure out the tooltip logic
    // const { x, y } = document
    //     .getSelection()
    //     .focusNode.parentNode.getClientRects()[0];

    const tooltip = document.createElement("div");
    tooltip.id = "time-convert-tooltip";
    tooltip.style.position = "fixed";
    tooltip.style.top = `0px`;
    tooltip.style.left = `0px`;
    tooltip.style.zIndex = 99999999999;
    tooltip.style.padding = "4px";
    tooltip.style.backgroundColor = "white";

    tooltip.innerHTML = `<b>${convertedText}</b>`;
    tooltip.onclick = (event) => {
        event.stopPropagation();
        event.preventDefault();
        navigator.clipboard.writeText(convertedText);
        tooltip.innerHTML = `<b>Copied!</b>`;
    };

    document.body.append(tooltip);
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("Content script received message", request);
    createTooltipOnTopOfSelectedNode(request.convertedText);
});

document.addEventListener("click", (event) => {
    document.getElementById("time-convert-tooltip")?.remove();
});
