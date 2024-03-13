import { BsPersonLinesFill, BsPersonFillLock } from "react-icons/bs";

import PropTypes from "prop-types";
import "./Icon.css";

const Icon = ({ type }) => {
  const access = {
    owner: {
      accessType: 1,
      icon: BsPersonLinesFill,
    },
    cashier: {
      accessType: 2,
      icon: BsPersonFillLock,
    },
  };

  const entry = Object.entries(access).find(
    ([key, value]) => value.accessType === type
  );
  const IconComponent = entry ? entry[1].icon : null;
  return IconComponent ? (
    <IconComponent className="me-1" style={{ width: "25px" }} />
  ) : null;
};

Icon.propTypes = {
  type: PropTypes.number,
};

export default Icon;
