import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Agenda.module.scss";
import { markdownify } from "@lib/utils/textConverter";
import { motion } from "framer-motion";
import ImageFallback from "@layouts/components/ImageFallback";

const AgendaWidget = ({ position }) => {
  const [agendaData, setAgendaData] = useState({
    items: [],
    settings: null,
  });
  const [showAgenda, setShowAgenda] = useState(true);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        const { data } = await axios.get("/api/agenda");
        const show = data.settings?.[0]?.attributes?.ShowAgenda;
        if (data.agenda.length > 0 || show) {
          setAgendaData({
            items: data.agenda,
            settings: data.settings[0].attributes,
          });
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

  const { settings, items: agendaItems } = agendaData;

  return (
    <motion.div
      className={styles["agenda-widget"]}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo and Bio Section */}
      {settings && (
        <div className={styles["agenda-header"]}>
          {settings.Logo?.data && (
            <div className={styles["agenda-logo-wrap"]}>
              <ImageFallback
                className={styles["agenda-logo"]}
                src={
                  settings.Logo.data.attributes.url.startsWith("http")
                    ? settings.Logo.data.attributes.url
                    : `${BASE_URL || ""}${settings.Logo.data.attributes.url}`
                }
                alt="author"
                width={150}
                height={150}
              />
            </div>
          )}
          {settings.Bio &&
            markdownify(settings.Bio, "p", styles["agenda-bio"])}
        </div>
      )}

      {/* Upcoming Events Section */}
      {agendaItems.length > 0 && (
        <div className={styles["agenda-events"]}>
          <h2 className={styles["agenda-title"]}>Upcoming Events</h2>
          <div className={styles["agenda-cards"]}>
            {agendaItems.map((item) => (
              <div key={item.id} className={styles["agenda-card"]}>
                <div className={styles["agenda-date"]}>
                  {formatDate(item.attributes.Date)}
                </div>
                <h4 className={styles["agenda-card-title"]}>
                  {item.attributes.Title}
                </h4>
                {markdownify(
                  item.attributes.Description,
                  "p",
                  styles["agenda-description"]
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AgendaWidget;
