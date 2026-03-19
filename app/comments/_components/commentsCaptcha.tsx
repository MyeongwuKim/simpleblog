"use client";

import ReCAPTCHA from "react-google-recaptcha";

export default function CommentsCaptcha({
  captchaKey,
  onTokenChange,
}: {
  captchaKey: number;
  onTokenChange: (token: string | null) => void;
}) {
  return (
    <ReCAPTCHA
      key={captchaKey}
      className="max-[500px]:scale-90 origin-top-right"
      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      onChange={onTokenChange}
    />
  );
}
