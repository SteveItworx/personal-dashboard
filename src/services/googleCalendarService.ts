import { gapi } from "gapi-script";

const CLIENT_ID = "923820507012-2l8gdbis74emjc91dqnqeao9arooc2mj.apps.googleusercontent.com"; // Replace with your actual client ID
const API_KEY = "AIzaSyBffnmphNzGpTXjIeRKPzXrM4-eYGt6a3w"; // Replace with your API Key
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

export const initGoogleAPI = () => {
  return new Promise((resolve) => {
    gapi.load("client:auth2", () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
      }).then(() => resolve(true));
    });
  });
};

export const signInWithGoogle = async () => {
  try {
    await gapi.auth2.getAuthInstance().signIn();
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};

export const signOutGoogle = () => {
  gapi.auth2.getAuthInstance().signOut();
};

export const getGoogleEvents = async () => {
  try {
    const response = await gapi.client.calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });
    return response.result.items;
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error);
    return [];
  }
};

export const addGoogleEvent = async (title: string, date: string) => {
  try {
    const response = await gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: {
        summary: title,
        start: { dateTime: new Date(date).toISOString(), timeZone: "UTC" },
        end: { dateTime: new Date(date).toISOString(), timeZone: "UTC" },
      },
    });
    return response.result;
  } catch (error) {
    console.error("Error adding event to Google Calendar:", error);
  }
};
