import axios from "axios";

export default async function handler(req, res) {
  try {
    const [agendaRes, settingsRes] = await Promise.all([
      axios.get("https://admin.starsandtoques.com/api/agendas"),
      axios.get("https://admin.starsandtoques.com/api/system-configs"),
    ]);

    const today = new Date();
    const filteredAgenda = agendaRes?.data?.data?.filter((item) => {
      const itemDate = new Date(item.attributes.Date);
      return itemDate.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0);
    });

    res.status(200).json({
      agenda: filteredAgenda.sort(
        (a, b) => new Date(a.attributes.Date) - new Date(b.attributes.Date)
      ),
      settings: settingsRes.data.data,
    });
  } catch (error) {
    console.error("Error fetching agenda data:", error);
    res.status(500).json({ error: "Failed to fetch agenda data" });
  }
}
