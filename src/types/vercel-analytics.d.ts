declare module "@vercel/analytics/react" {
  export interface AnalyticsProps {
    beforeSend?: (event: any) => any;
    debug?: boolean;
    mode?: "auto" | "development" | "production";
  }
  export const Analytics: import("react").FC<AnalyticsProps>;
}

declare module "@vercel/analytics/next" {
  export interface AnalyticsProps {
    beforeSend?: (event: any) => any;
    debug?: boolean;
    mode?: "auto" | "development" | "production";
  }
  export const Analytics: import("react").FC<AnalyticsProps>;
}
