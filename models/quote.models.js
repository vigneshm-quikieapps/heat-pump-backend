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
        "0000 - 0600": [{ type: Number }],
        "0600 - 0800": [{ type: Number }],
        "0800 - 1000": [{ type: Number }],
        "1000 - 1400": [{ type: Number }],
        "1400 - 1800": [{ type: Number }],
        "1800 - 2359": [{ type: Number }],
      },
      property_usage: [String],
      // yearly: {
      //   Jan: [{ type: Number }],
      //   Feb: [{ type: Number }],
      //   Mar: [{ type: Number }],
      //   Apr: [{ type: Number }],
      //   May: [{ type: Number }],
      //   Jun: [{ type: Number }],
      //   July: [{ type: Number }],
      //   Aug: [{ type: Number }],
      //   Sep: [{ type: Number }],
      //   Oct: [{ type: Number }],
      //   Nov: [{ type: Number }],
      //   Dec: [{ type: Number }],
      // },
      number_of_adultOccupants: Number,
      number_of_childrenOccupants: Number,
      number_of_typicalOccupantsPerBedroom: Number,
    },
    // equipments: {
    //   tvs: Number,
    //   laptops: Number,
    //   Monitors: Number,
    //   itServers: Number,
    //   PhotoCopiers: Number,
    // },
    high_energy_equipments: {
      sauna: Number,
      swimmingPool: Number,
      hotTub: Number,
      kilns: Number,
      other: Number,
    },
    number_of_guests:Number,

    questions: {
      hotwater_importance: Number,
      // woodStove_importance: Number,
      // electricity_than_uk_average: Number,
      heating_then_uk_average:Number
    },
    fabric_details:{
      age:[String],
      external_walls:[{type:String}],
      internal_walls:[{type:String}],
      root_type:[{type:String}],
      windows:[{type:String}],
      suspended_floors:[{type:String}],
      internal_floors:[{type:String}],
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
    radiator_and_window_sizes:[{
      room_desc:String,
      raditator_size: String,
      window_size: String,
    }],
    heating_system: {
      type: Number,
    },
    // amount_of_electricity: Number,
    amount_of_gas: Number,
    // cost_of_electricity: Number,
    cost_of_gas: Number,
    other_details: String,
    quote_reference_number: String,
    status: {
      type: Number,
      default:1
    },
    creator_customer_id: Schema.Types.ObjectId,
    exsisting: {
      data: [String],
      other: String,
    },
    proposed: {
      data: [String],
      other: String,
    },
    other_design_factor : [
      {type: String}
    ],
    ventilation_draught: {
      draught: String,
      data: [String],
      other: String,
    },
    pricing: String,
  },
  { timestamps: true }
);

QuoteSchema.post("save", (next) => {
  console.log("Quoted Saved IN DB ");
  // next();
});

module.exports = mongoose.model("Quote", QuoteSchema);
