/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

/**
 * User schema
 */

// Using MongoDB Hooks

const QuoteSchema = new mongoose.Schema(
  {
    site_details: {
      address_1: {
        type: String,
      },
      address_2: {
        type: String,
      },
      country: {
        type: String,
      },
      city: {
        type: String,
      },
      postcode: {
        type: String,
      },
    },
    occupancy: {
      weekly: {
        slot1: [{ type: Number }],
        slot2: [{ type: Number }],
        slot3: [{ type: Number }],
        slot4: [{ type: Number }],
        slot5: [{ type: Number }],
        slot6: [{ type: Number }],
      },
      yearly: {
        Jan: [{ type: Number }],
        Feb: [{ type: Number }],
        Mar: [{ type: Number }],
        Apr: [{ type: Number }],
        May: [{ type: Number }],
        Jun: [{ type: Number }],
        July: [{ type: Number }],
        Aug: [{ type: Number }],
        Sep: [{ type: Number }],
        Oct: [{ type: Number }],
        Nov: [{ type: Number }],
        Dec: [{ type: Number }],
      },
      number_of_adultOccupants: Number,
      number_of_childrenOccupants: Number,
      number_of_typicalOccupantsPerBedroom: Number,
    },
    equipments: {
      tvs: Number,
      laptops: Number,
      Monitors: Number,
      itServers: Number,
      PhotoCopiers: Number,
    },
    high_energy_equipments: {
      sauna: Number,
      swimmingPool: Number,
      hotTub: Number,
      kilns: Number,
      other: Number,
    },
    questions: {
      hotwater_importance: Number,
      woodStove_importance: Number,
      electricity_than_uk_average: Number,
    },

    drawings: {
      plans: [
        {
          type: String,
        },
      ],
      elevations: [
        {
          type: String,
        },
      ],
      sections: [
        {
          type: String,
        },
      ],
    },

    photos: {
      walls: [
        {
          type: String,
        },
      ],
      roof: [
        {
          type: String,
        },
      ],
      windows: [
        {
          type: String,
        },
      ],
      existing_boiler: [
        {
          type: String,
        },
      ],
      existing_radiator: [
        {
          type: String,
        },
      ],
      pipework: [
        {
          type: String,
        },
      ],
    },

    raditator_size: String,
    window_size: String,
    heating_system: {
      type: Number,
    },
    amount_of_electricity: Number,
    amount_of_gas: Number,
    cost_of_electricity: Number,
    cost_of_gas: Number,
    other_details: String,
    quote_reference_number: String,
  },
  { timestamps: true }
);

QuoteSchema.post("save", (next) => {
  console.log("Quoted Saved IN DB ");
  // next();
});

module.exports = mongoose.model("Quote", QuoteSchema);
