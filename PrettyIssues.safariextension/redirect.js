function __isOnGitHubIssuesPage(aLocation)
{
    var loc = (aLocation === undefined) ? window.location.href : aLocation,
        matchesGithubIssuesPage = new RegExp(/^(?:http|https):\/\/(?:www.)?github.com\/([-\w]+)\/([-\w]+)\/issues(?:\/)?/);

    return loc.match(matchesGithubIssuesPage);
}

function __isOnRepoPage(aLocation)
{
    var loc = (aLocation === undefined) ? window.location.href : aLocation,
        matchesGithubRepoPage = new RegExp(/^(?:http|https):\/\/(?:www.)?github.com\/([-\w]+)\/([-\w]+)(\/[\+-_\w]+)?/),
        matches = loc.match(matchesGithubRepoPage);

        if (!matches)
            return false;

        var user = matches[1],
        last = matches[3],
        reservedLocations = ["blog", "explore", "search", "inbox", "account", "logout", "repositories", "dashboard", "training", "support", "contact", "site", "security", "locale", "location", "timeline","tips"]

        return (reservedLocations.indexOf(user.toLowerCase()) === -1) ? [user, /*repo*/matches[2]] : false;
}

function __goToGitHubIssuesApp(/*string*/aLocation, /*SafariBrowserTab.url*/propertyToSet, /**BOOL*/shouldSendMessage)
{
    // in case this would ever get called from the main page
    var loc = (aLocation === undefined) ? window.location.href : aLocation,
        issueURLReplace = "http://githubissues.heroku.com/#$1/$2/$3",
        repoURLReplace = "http://githubissues.heroku.com/#$1/$2", 
        matchesSpecificGithubIssue = new RegExp(/^(?:http|https):\/\/(?:www.)?github.com\/([-\w]+)\/([-\w]+)\/issues(?:\/)?\#?(?:issue\/)?(\d+)/),
        matchesGithubIssuesPage = new RegExp(/^(?:http|https):\/\/(?:www.)?github.com\/([-\w]+)\/([-\w]+)\/issues(?:\/)?/),
        redirectArr = __isOnRepoPage(aLocation);

    if (__isOnGitHubIssuesPage(aLocation))
    {
        // we're on an issue...
        // try to match it with something
        if (loc.match(matchesSpecificGithubIssue))
            var newLocation = "http://githubissues.heroku.com/#"+loc.match(matchesSpecificGithubIssue)[1]+"/"+loc.match(matchesSpecificGithubIssue)[2]+"/"+loc.match(matchesSpecificGithubIssue)[3];//loc.replace(matchesSpecificGithubIssue,issueURLReplace);
        else
            var newLocation = "http://githubissues.heroku.com/#"+loc.match(matchesGithubIssuesPage)[1]+"/"+loc.match(matchesGithubIssuesPage)[2];
    }
    else if (propertyToSet && redirectArr)
    {
        // if we're on the repo page redirect to that issue
        // we only do this if the button was pushed, thus we check propertyToSet

        var newLocation = "http://githubissues.heroku.com/#" + redirectArr[0] + "/" + redirectArr[1];

    }
    else if (propertyToSet)
    {
        // if we're not an issues page we might be anywhere on the internets
        // thus we're going to just redirect the user to the issues app
        // but only if they click the button so we check propertyToSet

        var newLocation = "http://githubissues.heroku.com/";
        
    }

    // if we have the URL property to set
    if (propertyToSet)
        propertyToSet.url = newLocation;

    // otherwsie send a message to the active tab
    // but only if the URL matches the location we recieved
    if (shouldSendMessage && safari.application.activeBrowserWindow.activeTab.url === aLocation)
        safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("goToPage", newLocation);
}
