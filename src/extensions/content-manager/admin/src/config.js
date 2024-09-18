import theme from "./themes";
import './admin.css';

const config = {
  theme,
  auth: {
    logo: require("./assets/logo.png"), // Correct path to your custom logo
  },
  menu: {
    logo: require("./assets/logo.png"), // Correct path to your custom logo
  },
 // Extend the translations
 translations: {
  en: {
    "app.components.LeftMenu.navbrand.title": "Fine Dining",

    "app.components.LeftMenu.navbrand.workplace": "Testing",

    "Auth.form.welcome.title": "Welcom to Fine Dining",

    "Auth.form.welcome.subtitle": "Login to your account",

    "Settings.profile.form.section.experience.interfaceLanguageHelp":
      "Preference changes will apply only to you.",
  },
},
  head: {
    favicon: require('./assets/favicon.jpg'),
    title: 'Fine Dining', // Custom title for the admin panel
  },
  
  tutorials: false, // Disable Strapi tutorials
  notifications: { releases: false }, // Disable upgrade notifications
};

export default config;
