import { useUserSiteContent } from "@/lib/services/landing/hook";

const DEFAULT_LOGO = "/assets/images/new-logo.jpg";

/** Admin-uploaded logo, else the shipped one. `undefined` while site content loads,
 *  so the default never flashes before a custom logo. */
export const useSiteLogo = () => {
  const { data, isPending } = useUserSiteContent();
  if (isPending) return undefined;
  return data?.result?.branding?.logo || DEFAULT_LOGO;
};
