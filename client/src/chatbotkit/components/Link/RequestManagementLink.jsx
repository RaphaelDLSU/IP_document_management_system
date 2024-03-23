import React from "react";

import Link from './Link';

const RequestManagementLink = ({ selectedAirport }) => {
  const getUrl = () => {
    return `localhost:3000/requests`;
  };

  return <Link url={getUrl()} title={"Requests Management"} />;
};

export default RequestManagementLink;
