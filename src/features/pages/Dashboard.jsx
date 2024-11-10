import { useAuth } from "../auth/context/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";

const Dashboard = () => {
  const { currentUser, addApplication } = useAuth();
  const [jobDetails, setJobDetails] = useState(null);

  // Listen for messages from the content script
  useEffect(() => {
    const handleMessage = (message) => {
      if (message.type === "jobDetails") {
        setJobDetails(message.payload); // Set the job details in state
      }
    };

    // Add event listener for messages
    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      // Cleanup the event listener
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  // Handle sending message to content script to fetch job details
  const fetchJobDetails = () => {
    chrome.runtime.sendMessage({ type: "FETCH_JOB_DETAILS" }, (response) => {
      console.log("Job details fetched:", response);
    });
  };

  // Handle adding application
  const handleAddApplication = async () => {
    if (jobDetails) {
      try {
        await addApplication(jobDetails);
        alert("Application added successfully!");
        setJobDetails(null); // Clear job details after adding
      } catch (error) {
        console.error("Error adding application:", error);
      }
    }
  };

  return (
    <Card className="max-w-md mx-auto p-6 shadow-lg rounded-lg bg-white">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold">Dashboard</CardTitle>
        <CardDescription>Welcome, {currentUser?.email}</CardDescription>
      </CardHeader>

      <CardContent>
        <Button onClick={fetchJobDetails} className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white font-medium">
          Fetch Job Details
        </Button>

        {jobDetails ? (
          <div className="job-details p-4 rounded-lg bg-gray-50 border border-gray-200">
           <p className="mb-2 text-black">
              <strong>Job Title:</strong> {jobDetails.jobTitle}
            </p>
            <p className="mb-2 text-black">
              <strong>Company:</strong> {jobDetails.companyName}
            </p>
            <p className="mb-2 text-black">
              <strong>Status:</strong> {jobDetails.status}
            </p>
            <p className="mb-2 text-black">
              <strong>Applied Date:</strong> {new Date(jobDetails.appliedDate).toLocaleDateString()}
            </p>
            <Button onClick={handleAddApplication} variant="outline" className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white font-medium">
              Save Application
            </Button>
          </div>
        ) : (
          <p className="text-center text-gray-600">No job details available. Visit a LinkedIn job page and click "Fetch Job Details".</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Dashboard;
