import axios from "axios";

export default async function handler(req, res) {
  try {
    const [agendaRes, settingsRes] = await Promise.all([
      axios.get("https://admin.starsandtoques.com/api/agendas"),
      axios.get("https://admin.starsandtoques.com/api/system-configs"),
    ]);


    console.log("===============================+"+JSON.stringify(agendaRes.data )+"+================================")
    const today = new Date();
    // const filteredAgenda = agendaRes?.data?.data?.filter(
    //     (item) => new Date(item.attributes.Date) >= today
    //   (item) => item.status && new Date(item.date) >= today
    // );
const filteredAgenda = agendaRes?.data?.data;
    console.log(filteredAgenda);
    res.status(200).json({
      agenda: filteredAgenda.sort((a, b) => new Date(a.date) - new Date(b.date)),
      settings: settingsRes.data.data,
    });
  } catch (error) {
    console.error("Error fetching agenda data:", error);
    res.status(500).json({ error: "Failed to fetch agenda data" });
  }
}
