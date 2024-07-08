browser.commands.onCommand.addListener((name, _) => {
  if (name === "move-to-new-window") {
    moveToNewWindow();
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
