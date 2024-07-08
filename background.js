browser.commands.onCommand.addListener((name, tab) => {
  if (name === "move-to-new-window") {
    moveToNewWindow(tab);
  }
});

function moveToNewWindow(tab) {
  browser.windows.create({
    tabId: tab.id,
  });
}
