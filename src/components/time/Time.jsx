import { useState, useEffect } from "react";

const Time = ({ timezone }) => {
  // State to hold the current time
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Function to update the current time
    const updateTime = () => {
      setCurrentTime(new Date());
    };

    // Update the time every second
    const intervalId = setInterval(updateTime, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures that this effect runs only once

  // Function to get time string based on timezone
  const getTimeString = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds(); // Add this line to extract seconds
    const period = hours >= 12 ? "pm" : "am";
    const displayHours = hours % 12 || 12; // Convert 0 to 12
    const formattedHours =
      displayHours < 10 ? `0${displayHours}` : displayHours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds; // Format seconds
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${period}`;
  };

  // Function to get date string
  const getDateString = (time) => {
    const date = time.getDate();
    const month = time.getMonth() + 1; // Month is zero-based, so we add 1
    const year = time.getFullYear();
    return `${date < 10 ? "0" + date : date}/${
      month < 10 ? "0" + month : month
    }/${year}`;
  };

  // Get time and date strings based on timezone
  let timeString = "";
  if (timezone === "US") {
    const usTime = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    });
    timeString = `${getTimeString(new Date(usTime))} - ${getDateString(
      new Date(usTime)
    )} (US time)`;
  } else if (timezone === "PH") {
    const phTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Manila",
    });
    timeString = `${getTimeString(new Date(phTime))} - ${getDateString(
      new Date(phTime)
    )} (PH time)`;
  } else {
    timeString = "Invalid timezone";
  }

  return timeString;
};

export default Time;
