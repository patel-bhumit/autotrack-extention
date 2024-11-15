console.log("Content script loaded on LinkedIn job page");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in content script:", message);
    if (message.type === "FETCH_JOB_DETAILS") {
        extractJobDetails();
        sendResponse({ status: "Job details fetched" });
    }
});

function extractJobDetails() {
    const jobTitleElement = document.querySelector( ".jobsearch-JobInfoHeader-title.css-1t78hkx.e1tiznh50 > span:nth-of-type(1), .job-details-jobs-unified-top-card__job-title h1 a");
    const companyNameElement = document.querySelector(".css-r3nvn0.e19afand0, .job-details-jobs-unified-top-card__company-name > .app-aware-link" );

    const jobTitle = jobTitleElement ? jobTitleElement.innerText.trim() : "Job title not found";
    const companyName = companyNameElement ? companyNameElement.innerText.trim() : "Company name not found";

    // Format the applied date as YYYY-MM-DD
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    const appliedDate = formatDate(Date.now()); // Format the current date

    console.log("Extracted job details:", { jobTitle, companyName, appliedDate });

    // Send extracted data back to Dashboard
    chrome.runtime.sendMessage({
        type: "jobDetails",
        payload: {
            jobTitle,
            companyName,
            status: "applied",
            appliedDate, // Send formatted date directly
        },
    });
}

