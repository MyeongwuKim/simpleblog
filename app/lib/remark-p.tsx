import React, { useEffect } from "react";

const RemarkP: React.FC<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >
> = (props) => {
  const { children } = props;

  useEffect(() => {}, [children]);

  return <p>{children}</p>;
};

export default RemarkP;
