import { ImageResponse } from "next/og";

/**
 * Apple touch icon.
 *
 * iOS does not accept an SVG touch icon, so this renders the same monogram to
 * a PNG at build time. Keep the geometry in step with `src/app/icon.svg` and
 * `src/components/brand/logo-mark.tsx`.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0E2344",
        }}
      >
        <svg width="132" height="132" viewBox="0 0 32 32" fill="none">
          <g
            stroke="#F2EEE8"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 23V11l5 6.5L17 11v12" />
            <path d="M25 23V11" />
          </g>
          <path
            d="M17 11l8 12"
            stroke="#B1967D"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    size,
  );
}
