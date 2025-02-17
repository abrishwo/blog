import { formatInTimeZone, utcToZonedTime } from "date-fns-tz";
import { parseISO } from "date-fns";

const STRAPI_TIME_ZONE = "Europe/Stockholm"; // Your Strapi server timezone

const dateFormat = (date) => {
  // Ensure the date is correctly parsed as UTC
  const parsedDate = parseISO(date + "T00:00:00Z"); // Forces midnight UTC
  
  // Convert UTC to Strapi's timezone (Stockholm)
  return formatInTimeZone(parsedDate, STRAPI_TIME_ZONE, "dd MMM yyyy");
};

export default dateFormat;
