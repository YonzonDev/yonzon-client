import { Image } from "react-bootstrap";
import PropTypes from "prop-types";
import "./Model.css";

import Rows2DeepDish from "../../assets/images/products/2-rows-deepdish.jpg";
import Rows3DeepDish from "../../assets/images/products/3-rows-deepdish.jpg";
import Mai70800s from "../../assets/images/products/70mai-800s.jpg";
import Mai70A400 from "../../assets/images/products/70mai-a400.jpg";
import Mai80A400s from "../../assets/images/products/70mai-a400s.jpg";
import Mai70A500s from "../../assets/images/products/70mai-a500s.jpg";
import AllPurposeCleaner from "../../assets/images/products/all-purpose-cleaner.jpg";
import AndroidHeadunit from "../../assets/images/products/android-headunit.jpg";
import CarAlarm from "../../assets/images/products/car-alarm.jpg";
import CarShampoo from "../../assets/images/products/car-shampoo.jpg";
import DustProofCarCover from "../../assets/images/products/dust-proof-carcover.jpg";
import GarnishSet from "../../assets/images/products/garnish-set.jpg";
import KeonSondra from "../../assets/images/products/keon-sondra.jpg";
import LuxLed from "../../assets/images/products/lux-led.jpg";
import LuxorPink from "../../assets/images/products/luxor-pink.jpg";
import NanoWax500ml from "../../assets/images/products/nano-wax-500ml.jpg";
import PushStartSystem from "../../assets/images/products/push-start-system.jpg";
import QCYF24 from "../../assets/images/products/qcy-f24.jpg";
import SBLed from "../../assets/images/products/sbled.jpg";
import SkidPlate from "../../assets/images/products/skid-plate.jpg";
import TeslaHeadunit from "../../assets/images/products/tesla-headunit.jpg";
import TowHitch from "../../assets/images/products/tow-hitch.jpg";
import WaterProofCarCover from "../../assets/images/products/water-proof-car-cover.jpg";
import WindshieldWasher from "../../assets/images/products/windshield-washer.jpg";
import XFilms from "../../assets/images/products/x-films.jpg";

const Model = ({ modelName }) => {
  const models = {
    model1: {
      modelName: "2 rows deep dish",
      image: Rows2DeepDish,
    },
    model2: {
      modelName: "3 rows deep dish",
      image: Rows3DeepDish,
    },
    model3: {
      modelName: "70mai A800s",
      image: Mai70800s,
    },
    model4: {
      modelName: "70mai A400",
      image: Mai70A400,
    },
    model5: {
      modelName: "70mai A400s",
      image: Mai80A400s,
    },
    model6: {
      modelName: "70mai A500s",
      image: Mai70A500s,
    },
    model7: {
      modelName: "All purpose cleaner",
      image: AllPurposeCleaner,
    },
    model8: {
      modelName: "Android headunit w/ oem panel",
      image: AndroidHeadunit,
    },
    model9: {
      modelName: "Car alarm",
      image: CarAlarm,
    },
    model10: {
      modelName: "Car shampoo w/ max 1 liter",
      image: CarShampoo,
    },
    model11: {
      modelName: "Dustproof",
      image: DustProofCarCover,
    },
    model12: {
      modelName: "Garnish set",
      image: GarnishSet,
    },
    model13: {
      modelName: "Keon Sondra",
      image: KeonSondra,
    },
    model14: {
      modelName: "Lux Led",
      image: LuxLed,
    },
    model15: {
      modelName: "Luxor pink car shampoo w/max 1 liter",
      image: LuxorPink,
    },
    model16: {
      modelName: "Nano wax 500ml",
      image: NanoWax500ml,
    },
    model17: {
      modelName: "Push start alarm system",
      image: PushStartSystem,
    },
    model18: {
      modelName: "Qcy F24",
      image: QCYF24,
    },
    model19: {
      modelName: "SBLed",
      image: SBLed,
    },
    model20: {
      modelName: "Skid plate",
      image: SkidPlate,
    },
    model21: {
      modelName: "Tesla style headunit",
      image: TeslaHeadunit,
    },
    model22: {
      modelName: "Tow hitch receiver",
      image: TowHitch,
    },
    model23: {
      modelName: "Waterproof",
      image: WaterProofCarCover,
    },
    model24: {
      modelName: "Windshield washer",
      image: WindshieldWasher,
    },
    model25: {
      modelName: "X-Films",
      image: XFilms,
    },
  };

  const entry = Object.entries(models).find(
    ([key, value]) => value.modelName === modelName
  );
  const ImageComponent = entry ? entry[1].image : null;
  return ImageComponent ? (
    <div className="text-center">
      <Image
        src={ImageComponent}
        className="model-image"
        alt="model"
        style={{ width: "70px", height: "70px" }}
      />
    </div>
  ) : (
    <div className="text-center">
      <Image
        src={"https://cdn-icons-png.flaticon.com/512/2821/2821378.png"}
        className="model-image"
        alt="model"
        style={{ width: "70px", height: "70px", backgroundColor: "#ffffff" }}
      />
    </div>
  );
};

Model.propTypes = {
  modelName: PropTypes.string,
};

export default Model;
