import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Agenda.module.scss"; // Use CSS modules for better scoping
import { markdownify } from "@lib/utils/textConverter";

const AgendaWidget = ({ position }) => {
  const [agendaItems, setAgendaItems] = useState([]);
  const [showAgenda, setShowAgenda] = useState(true);

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        const { data } = await axios.get("/api/agenda");
        if (data.agenda.length > 0 || data.settings[0].attributes.ShowAgenda) {
          console.log(JSON.stringify(data));
          setAgendaItems(data.agenda);
        } else {
          setShowAgenda(false);
        }
      } catch (error) {
        console.error("Error fetching agenda:", error);
        setShowAgenda(false);
      }
    };

    fetchAgenda();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options).toUpperCase();
  };

  if (!showAgenda) return null;

  return (
    <>
    { agendaItems.length > 0 && (
    <div
      className={`w-full mt-24 pt-12 w-full ${styles["agenda-widget"]} ${
        position === "Below News" ? styles["below-news"] : styles["above-news"]
      }`}
    >
      <h2 className={styles["agenda-title"]}>Upcoming Events</h2>
      <div className={styles["agenda-cards"]}>
        {agendaItems.map((item) => (
          <div key={item.id} className={styles["agenda-card"]}>
            <div className={styles["agenda-date"]}>
              {formatDate(item.attributes.Date)}
            </div>
            <h4 className={styles["agenda-title"]}>
              {item.attributes.Title}
            </h4>
            {markdownify(
              item.attributes.Description,
              "p",
              `${styles["agenda-description"]}`
            )}
          </div>
        ))}
      </div>
    </div>

      )}
      </>
  );
};

export default AgendaWidget;
