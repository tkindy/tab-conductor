browser.commands.onCommand.addListener((name, _) => {
  if (name === "move-to-new-window") {
    moveToNewWindow();
  } else if (name === "move-to-previous-window") {
    moveToPreviousWindow();
  }
});

async function moveToNewWindow() {
  const tabs = await browser.tabs.query({
    highlighted: true,
    windowId: browser.windows.WINDOW_ID_CURRENT,
  });

  const window = await browser.windows.create({
    tabId: tabs[0].id,
  });

  if (tabs.length > 1) {
    browser.tabs.move(
      tabs.slice(1).map((tab) => tab.id),
      { windowId: window.id, index: -1 }
    );
  }
}

const windowStack = [];

browser.windows.onFocusChanged.addListener(async (windowId) => {
  const window = await browser.windows.get(windowId);
  if (window.type !== "normal") {
    return;
  }

  windowStack.push(windowId);
  if (windowStack.length > 2) {
    windowStack.shift();
  }
});

async function moveToPreviousWindow() {
  if (windowStack.length < 2) {
    console.debug("No previous window to move to");
    return;
  }

  const [previousWindowId, currentWindowId] = windowStack;
  if (previousWindowId === currentWindowId) {
    console.debug("Previous window is the same as the current window");
    return;
  }

  const tabs = await browser.tabs.query({
    highlighted: true,
    windowId: currentWindowId,
  });
  if (tabs.length === 0) {
    console.debug("No tabs to move");
    return;
  }

  browser.tabs.move(
    tabs.map((tab) => tab.id),
    { windowId: previousWindowId, index: -1 }
  );
  browser.tabs.update(tabs.at(-1).id, { active: true });
  browser.windows.update(previousWindowId, { focused: true });
}
