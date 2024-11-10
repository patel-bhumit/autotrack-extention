console.log("Content script loaded on LinkedIn job page");

function extractJobDetails() {
    const jobTitleElement = document.querySelector(".job-details-jobs-unified-top-card__job-title h1 a");
    const companyNameElement = document.querySelector(".job-details-jobs-unified-top-card__company-name > .app-aware-link");

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

// Listen for a request to fetch job details
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "FETCH_JOB_DETAILS") {
        // Call function to extract job details or handle the message
        extractJobDetails();
        sendResponse({ status: "Job details fetched" });
    }
});

