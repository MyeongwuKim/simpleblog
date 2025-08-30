import React, { useEffect } from "react";

const RemarkOL: React.FC<
  React.DetailedHTMLProps<
    React.OlHTMLAttributes<HTMLOListElement>,
    HTMLOListElement
  >
> = (props) => {
  const { children } = props;

  useEffect(() => {}, [children]);
  return <ol>{children}</ol>;
};

export default RemarkOL;
