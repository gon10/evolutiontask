import React, { ReactElement, ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import "./GameCard.css";

const GameCard = ({
  title,
  rules,
  children,
  ...props
}: {
  title: string;
  rules?: string;
  children: ReactElement;
}) => {
  return (
    <div className="gameCard">
      <h5>{title}</h5>
      <Link to="/">Go Back</Link>
      {children}
    </div>
  );
};

export default GameCard;
