import { TabGroup } from "./types";

export const renderOptions = (
  tabGroups: TabGroup[],
  options: { onClick: (tabs: chrome.tabs.Tab[]) => void }
) => {
  const listEl = document.querySelector("#main")!;
  listEl.innerHTML = "";
  tabGroups.forEach((option) => {
    console.log(option);
    const optionEl = document.createElement("li");
    optionEl.textContent = `${option.key} (${option.tabs.length})`;
    optionEl.addEventListener("click", () => {
      options.onClick(option.tabs);
    });
    console.log(optionEl);
    listEl.appendChild(optionEl);
  });
};
