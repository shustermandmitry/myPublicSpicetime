import type { FC } from 'react';
import React from 'react';

const EraserIcon = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.0561 10.8003L11.7566 17.4121H17.8325C18.2358 17.4121 18.5627 17.7675 18.5627 18.206C18.5627 18.6445 18.2358 19 17.8325 19L5.11071 19C4.82463 19.0001 4.59942 19.0002 4.37678 18.9593C4.10767 18.91 3.84709 18.8161 3.60406 18.6811C3.403 18.5694 3.22237 18.4231 2.99293 18.2374L2.93209 18.1882C2.54567 17.8756 2.22399 17.6154 1.97579 17.3821C1.71809 17.14 1.49307 16.8852 1.3313 16.5653C0.990788 15.892 0.908918 15.0997 1.10353 14.3611C1.19599 14.0101 1.36341 13.7074 1.56527 13.4091C1.7597 13.1218 2.02019 12.7906 2.33323 12.3925L9.28703 3.55003C9.84391 2.84185 10.3088 2.25069 10.7363 1.83396C11.1878 1.39379 11.6748 1.06925 12.2893 1.00956C12.9037 0.949878 13.4359 1.17544 13.952 1.5216C14.4407 1.84934 14.9946 2.34154 15.6582 2.93118L16.5022 3.68115C17.1997 4.30097 17.7806 4.81702 18.189 5.29339C18.6198 5.79568 18.938 6.34174 18.9921 7.03719C19.0462 7.73264 18.8169 8.32907 18.4699 8.90288C18.1408 9.44707 17.648 10.0619 17.0561 10.8003ZM15.5379 4.87516C16.2858 5.53969 16.788 5.98818 17.1207 6.37619C17.439 6.74735 17.5213 6.97306 17.5368 7.17105C17.5522 7.36904 17.5059 7.60657 17.2495 8.03058C16.9814 8.47385 16.5557 9.00769 15.9211 9.79936L14.4351 11.6534L8.78454 6.63252L10.3647 4.6232C10.9625 3.86299 11.3648 3.354 11.7113 3.01624C12.042 2.69385 12.2428 2.6083 12.4192 2.59117C12.5956 2.57403 12.8072 2.61952 13.1852 2.87307C13.5813 3.1387 14.0602 3.56209 14.7725 4.19505L15.5379 4.87516ZM7.83983 7.83382L3.46072 13.4023C3.12588 13.8281 2.9007 14.1152 2.74174 14.3501C2.58662 14.5794 2.53181 14.7065 2.50761 14.7983C2.41915 15.1341 2.45636 15.4942 2.61114 15.8003C2.65348 15.884 2.73286 15.9947 2.9309 16.1808C3.13384 16.3715 3.41201 16.5971 3.82539 16.9315C4.11232 17.1637 4.19041 17.2236 4.26869 17.2671C4.37915 17.3285 4.4976 17.3711 4.61992 17.3936C4.7066 17.4095 4.80218 17.4121 5.15982 17.4121L9.8193 17.4121L13.4797 12.8453L7.83983 7.83382Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const DoubleChevron = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      width={24}
      height={24}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
      />
    </svg>
  );
};

const TextAlignRight = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" {...props}>
      <path
        fill="currentColor"
        d="M224 40v176a8 8 0 0 1-16 0V40a8 8 0 0 1 16 0m-48 8H80a16 16 0 0 0-16 16v40a16 16 0 0 0 16 16h96a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16m0 88H40a16 16 0 0 0-16 16v40a16 16 0 0 0 16 16h136a16 16 0 0 0 16-16v-40a16 16 0 0 0-16-16"
      />
    </svg>
  );
};

const TextAlignLeft = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" {...props}>
      <path
        fill="currentColor"
        d="M232 152v40a16 16 0 0 1-16 16H80a16 16 0 0 1-16-16v-40a16 16 0 0 1 16-16h136a16 16 0 0 1 16 16M40 32a8 8 0 0 0-8 8v176a8 8 0 0 0 16 0V40a8 8 0 0 0-8-8m40 88h96a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16H80a16 16 0 0 0-16 16v40a16 16 0 0 0 16 16"
      />
    </svg>
  );
};

const TextAlignCenter = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" {...props}>
      <path
        fill="currentColor"
        d="M224 152v40a16 16 0 0 1-16 16h-72v16a8 8 0 0 1-16 0v-16H48a16 16 0 0 1-16-16v-40a16 16 0 0 1 16-16h72v-16H72a16 16 0 0 1-16-16V64a16 16 0 0 1 16-16h48V32a8 8 0 0 1 16 0v16h48a16 16 0 0 1 16 16v40a16 16 0 0 1-16 16h-48v16h72a16 16 0 0 1 16 16"
      />
    </svg>
  );
};

const FormatBold = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" {...props}>
      <path
        fill="currentColor"
        d="M170.5 115.7A44 44 0 0 0 140 40H64a7.9 7.9 0 0 0-8 8v152a8 8 0 0 0 8 8h88a48 48 0 0 0 18.5-92.3ZM72 56h68a28 28 0 0 1 0 56H72Zm80 136H72v-64h80a32 32 0 0 1 0 64Z"
      />
    </svg>
  );
};

const FormatItalic = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" {...props}>
      <path
        fill="currentColor"
        d="M200 56a8 8 0 0 1-8 8h-34.23L115.1 192H144a8 8 0 0 1 0 16H64a8 8 0 0 1 0-16h34.23L140.9 64H112a8 8 0 0 1 0-16h80a8 8 0 0 1 8 8"
      />
    </svg>
  );
};

const FormatStrike = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" {...props}>
      <path
        fill="currentColor"
        d="M224 128a8 8 0 0 1-8 8h-40.07c9.19 7.11 16.07 17.2 16.07 32c0 13.34-7 25.7-19.75 34.79C160.33 211.31 144.61 216 128 216s-32.33-4.69-44.25-13.21C71 193.7 64 181.34 64 168a8 8 0 0 1 16 0c0 17.35 22 32 48 32s48-14.65 48-32c0-14.85-10.54-23.58-38.77-32H40a8 8 0 0 1 0-16h176a8 8 0 0 1 8 8M76.33 104a8 8 0 0 0 7.61-10.49a17.3 17.3 0 0 1-.83-5.51c0-18.24 19.3-32 44.89-32c18.84 0 34.16 7.42 41 19.85a8 8 0 0 0 14-7.7C173.33 50.52 152.77 40 128 40c-34.71 0-60.89 20.63-60.89 48a33.7 33.7 0 0 0 1.62 10.49a8 8 0 0 0 7.6 5.51"
      />
    </svg>
  );
};

const FormatH1 = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path fill="currentColor" d="M5 17V7h2v4h4V7h2v10h-2v-4H7v4zm12 0V9h-2V7h4v10z"></path>
    </svg>
  );
};

const FormatH2 = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M3 17V7h2v4h4V7h2v10H9v-4H5v4zm10 0v-4q0-.825.588-1.412T15 11h4V9h-6V7h6q.825 0 1.413.588T21 9v2q0 .825-.587 1.413T19 13h-4v2h6v2z"
      ></path>
    </svg>
  );
};

const FormatH3 = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M3 17V7h2v4h4V7h2v10H9v-4H5v4zm10 0v-2h6v-2h-4v-2h4V9h-6V7h6q.825 0 1.413.588T21 9v6q0 .825-.587 1.413T19 17z"
      ></path>
    </svg>
  );
};

const FormatH4 = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M3 17V7h2v4h4V7h2v10H9v-4H5v4zm15 0v-3h-5V7h2v5h3V7h2v5h2v2h-2v3z"
      ></path>
    </svg>
  );
};

const FormatH5 = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M3 17V7h2v4h4V7h2v10H9v-4H5v4zm10 0v-2h6v-2h-6V7h8v2h-6v2h4q.825 0 1.413.588T21 13v2q0 .825-.587 1.413T19 17z"
      ></path>
    </svg>
  );
};

const Paragraph = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M10.346 18.923V13h-.192q-1.671 0-2.836-1.164Q6.154 10.67 6.154 9t1.164-2.835T10.154 5h6.423v1h-2v12.923h-1V6h-2.23v12.923z"
      ></path>
    </svg>
  );
};

const Heading = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 12h12M6 20V4m12 16V4"
      ></path>
    </svg>
  );
};

const BulletList = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M20 18v1H7v-1zm-16.5-.5a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1M20 12v1H7v-1zm-16.5-.5a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1M20 6v1H7V6zM3.5 5.5a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1"
      ></path>
    </svg>
  );
};

const OrderList = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M2 11v-1h3v.9L3.2 13H5v1H2v-.9L3.8 11zm1-3V5H2V4h2v4zm-1 9v-1h3v4H2v-1h2v-.5H3v-1h1V17zM20 6v1H7V6zm0 6v1H7v-1zm0 6v1H7v-1z"
      ></path>
    </svg>
  );
};

const CodeBlock = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="m8 18l-6-6l6-6l1.425 1.425l-4.6 4.6L9.4 16.6zm8 0l-1.425-1.425l4.6-4.6L14.6 7.4L16 6l6 6z"
      ></path>
    </svg>
  );
};

const BlockQuote = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 15h15m0 4H6m9-8h6m0-4h-6M9 9h1a1 1 0 1 1-1 1V7.5a2 2 0 0 1 2-2M3 9h1a1 1 0 1 1-1 1V7.5a2 2 0 0 1 2-2"
      ></path>
    </svg>
  );
};

const Mobile = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" {...props}>
      <path
        fill="currentColor"
        d="M176 16H80a24 24 0 0 0-24 24v176a24 24 0 0 0 24 24h96a24 24 0 0 0 24-24V40a24 24 0 0 0-24-24m8 200a8 8 0 0 1-8 8H80a8 8 0 0 1-8-8V40a8 8 0 0 1 8-8h96a8 8 0 0 1 8 8ZM140 60a12 12 0 1 1-12-12a12 12 0 0 1 12 12"
      />
    </svg>
  );
};

const MobileVertical = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ rotate: '90deg' }}
      width="16"
      height="16"
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        fill="currentColor"
        d="M176 16H80a24 24 0 0 0-24 24v176a24 24 0 0 0 24 24h96a24 24 0 0 0 24-24V40a24 24 0 0 0-24-24m8 200a8 8 0 0 1-8 8H80a8 8 0 0 1-8-8V40a8 8 0 0 1 8-8h96a8 8 0 0 1 8 8ZM140 60a12 12 0 1 1-12-12a12 12 0 0 1 12 12"
      />
    </svg>
  );
};

const Tablet = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" {...props}>
      <path
        fill="currentColor"
        d="M192 24H64a24 24 0 0 0-24 24v160a24 24 0 0 0 24 24h128a24 24 0 0 0 24-24V48a24 24 0 0 0-24-24m8 184a8 8 0 0 1-8 8H64a8 8 0 0 1-8-8V48a8 8 0 0 1 8-8h128a8 8 0 0 1 8 8ZM168 64a8 8 0 0 1-8 8H96a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8"
      />
    </svg>
  );
};

const TabletVertical = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ rotate: '90deg' }}
      width="16"
      height="16"
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        fill="currentColor"
        d="M192 24H64a24 24 0 0 0-24 24v160a24 24 0 0 0 24 24h128a24 24 0 0 0 24-24V48a24 24 0 0 0-24-24m8 184a8 8 0 0 1-8 8H64a8 8 0 0 1-8-8V48a8 8 0 0 1 8-8h128a8 8 0 0 1 8 8ZM168 64a8 8 0 0 1-8 8H96a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8"
      />
    </svg>
  );
};

const Monitor = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" {...props}>
      <path
        fill="currentColor"
        d="M208 40H48a24 24 0 0 0-24 24v112a24 24 0 0 0 24 24h160a24 24 0 0 0 24-24V64a24 24 0 0 0-24-24m8 136a8 8 0 0 1-8 8H48a8 8 0 0 1-8-8V64a8 8 0 0 1 8-8h160a8 8 0 0 1 8 8Zm-48 48a8 8 0 0 1-8 8H96a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8"
      />
    </svg>
  );
};

const ChevronBottom = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      height="16"
      width="16"
      fill="none"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.46967 7.21967C4.76256 6.92678 5.23744 6.92678 5.53033 7.21967L10 11.6893L14.4697 7.21967C14.7626 6.92678 15.2374 6.92678 15.5303 7.21967C15.8232 7.51256 15.8232 7.98744 15.5303 8.28033L10.5303 13.2803C10.2374 13.5732 9.76256 13.5732 9.46967 13.2803L4.46967 8.28033C4.17678 7.98744 4.17678 7.51256 4.46967 7.21967Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

const Link = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" {...props}>
      <path
        fill="currentColor"
        d="M232 80a55.67 55.67 0 0 1-16.4 39.6l-30.07 30.06a8 8 0 0 1-11.31-11.32l30.07-30.06a40 40 0 1 0-56.57-56.56l-30.06 30.05a8 8 0 0 1-11.32-11.32L136.4 40.4A56 56 0 0 1 232 80m-93.66 94.22l-30.06 30.06a40 40 0 1 1-56.56-56.57l30.05-30.05a8 8 0 0 0-11.32-11.32L40.4 136.4a56 56 0 0 0 79.2 79.2l30.06-30.07a8 8 0 0 0-11.32-11.31"
      ></path>
    </svg>
  );
};

const Burger = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0.762338 2C0.342449 2 0 2.33428 0 2.74916C0 3.16403 0.342448 3.49832 0.762338 3.49832L19.2377 3.49832C19.6576 3.49832 20 3.16404 20 2.74916C20 2.33429 19.6576 2 19.2377 2H0.762338Z"
        fill="currentColor"
      />
      <path
        d="M0.762338 9.25084C0.342449 9.25084 0 9.58512 0 10C0 10.4149 0.342448 10.7492 0.762338 10.7492L19.2377 10.7492C19.6576 10.7492 20 10.4149 20 10C20 9.58513 19.6576 9.25084 19.2377 9.25084L0.762338 9.25084Z"
        fill="currentColor"
      />
      <path
        d="M0.762338 16.5017C0.342449 16.5017 0 16.836 0 17.2508C0 17.6657 0.342448 18 0.762338 18L19.2377 18C19.6576 18 20 17.6657 20 17.2508C20 16.836 19.6576 16.5017 19.2377 16.5017L0.762338 16.5017Z"
        fill="currentColor"
      />
    </svg>
  );
};

const Icons = {
  monitor: Monitor,
  burger: Burger,
  mobile: Mobile,
  link: Link,
  'chevron-bottom': ChevronBottom,
  'mobile-vertical': MobileVertical,
  tablet: Tablet,
  'tablet-vertical': TabletVertical,
  'code-block': CodeBlock,
  blockquote: BlockQuote,
  'bullet-list': BulletList,
  'numbered-list': OrderList,
  eraser: EraserIcon,
  paragraph: Paragraph,
  'format-h1': FormatH1,
  'format-h2': FormatH2,
  'format-h3': FormatH3,
  'format-h4': FormatH4,
  'format-h5': FormatH5,
  heading: Heading,
  'text-align-right': TextAlignRight,
  'text-align-left': TextAlignLeft,
  'text-align-center': TextAlignCenter,
  'format-bold': FormatBold,
  'format-italic': FormatItalic,
  'format-strikethrough': FormatStrike,
  'double-chevron': DoubleChevron,
} as const;

export type IconTypes = keyof typeof Icons;

const Icon: FC<{ type: IconTypes } & React.SVGProps<SVGSVGElement>> = ({ type, ...rest }) => {
  const Element = Icons[type];

  if (!Element) {
    console.error('Wrong Icon type');
    return null;
  }

  return <Element {...rest} />;
};

export default Icon;
