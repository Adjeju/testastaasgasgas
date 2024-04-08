import { categoriesConfig } from "./categories-config.js";
import { Categories } from "./categories.js";
import { WelcomeWindow } from "./welcome-modal.js";

document
  .querySelector("#app")
  .appendChild(new Categories(categoriesConfig).render())
  .appendChild(new WelcomeWindow().render());
