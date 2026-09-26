/** Geometric "AK" monogram, drawn in the same blocky, angular language as the reference mark. */
export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      aria-label="Amin Kaibov"
      role="img"
    >
      <path
        fillRule="evenodd"
        d="M 0 256 L 0 96 L 64 0 L 128 0 L 128 256 L 88 256 L 88 176 L 40 176 L 40 256 Z M 40 136 L 88 136 L 88 56 L 40 128 Z M 152 0 L 192 0 L 192 104 L 216 64 L 256 0 L 256 64 L 212 128 L 256 192 L 256 256 L 216 192 L 192 152 L 192 256 L 152 256 Z"
        fill="white"
      />
    </svg>
  )
}
