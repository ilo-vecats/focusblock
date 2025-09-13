document.getElementById("refresh").addEventListener("click", async () => {
  chrome.runtime.getBackgroundPage((bg) => {
    bg.fetchBlocked();
    document.getElementById("status").innerText = "Blocked sites refreshed!";
  });
});