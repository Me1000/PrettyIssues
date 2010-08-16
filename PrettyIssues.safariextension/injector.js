function redirectToIssuesApp(aMessageEvent)
{

    if (aMessageEvent.name === "goToPage")
        window.location = aMessageEvent.message;
}
// register for message events
safari.self.addEventListener("message", redirectToIssuesApp, false);

// when the page first starts loading we need to 
// let the global page know
safari.self.tab.dispatchMessage("pageDidLoad", window.location.href);
