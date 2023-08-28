import type { CommandModule } from "yargs";
import type { AdvertMutationResult } from "./helpers/advert/types";
import { createAdvertFactory } from "./helpers/advert";

const commandSpec: CommandModule = {
  command: "create-advert",
  describe: "Creates an advert",
  async handler({}) {
    const createAdvert = createAdvertFactory();
    const result: AdvertMutationResult = await createAdvert({
      title: "Min sak",
      description: "Lorem ipsum dolor sit amet",
      location: {
        adress: "Min Gata",
        zipCode: "12345",
        city: "MyStad",
        country: "Sverige",
      },
      contact: {
        phone: "070-123456",
        email: "XXXXXXXXXXXXX",
      },
      quantity: 1,
      images: [{ url: "https://www.example.com/image.jpg" }],
      unit: "st",
      material: "Plast",
      condition: "Bra",
      usage: "Hemma",
    });
    console.log("Result: ", result);
  },
};

export default commandSpec;
