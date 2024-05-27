const getSelectedText = async () => {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    let result;
    try {
        [{ result }] = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => getSelection().toString(),
        });
    } catch (e) {
        console.log(e);
        return; // ignoring an unsupported page like chrome://extensions
    }

    return result;
};

const convertToAppropriateTime = (selectedText, command) => {
    if (command === "convertUTC") {
        const utcDate = new Date(selectedText);
        const utcTime = utcDate.getTime();
        const istTime = new Date(utcTime + 19800000);
        return istTime;
    } else if (command === "convertAEST") {
        const utcDate = new Date(selectedText);
        console.log(utcDate);
        const utcTime = utcDate.getTime();
        const aestTime = new Date(utcTime + 36000000);
        return aestTime;
    } else {
        return selectedText;
    }
};

const sendSelectedTextToContentScript = async (selectedText, command) => {
    const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
    });

    const convertedText = convertToAppropriateTime(selectedText, command);

    await chrome.tabs.sendMessage(tab.id, {
        convertedText,
    });
};

const convertTime = async (command) => {
    getSelectedText()
        .then((result) => {
            sendSelectedTextToContentScript(result, command);
        })
        .catch((e) => {
            console.error(e);
        });
};

chrome.commands.onCommand.addListener(function (command) {
    convertTime(command);
});
