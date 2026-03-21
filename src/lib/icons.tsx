import { 
  IconBrandInstagram, IconBrandTwitter, IconBrandGithub, IconBrandLinkedin, 
  IconBrandYoutube, IconBrandFacebook, IconBrandTiktok, IconBrandWhatsapp,
  IconLink, IconMail, IconPhone, IconUser, IconHome, IconSearch, 
  IconSettings, IconHeart, IconStar, IconCoffee, IconMusic, 
  IconCamera, IconVideo, IconMapPin, IconCalendar, IconShoppingCart, IconGlobe
} from "@tabler/icons-react";

export const ICONS = [
  { name: "Instagram", icon: <IconBrandInstagram size={20} />, value: "brand-instagram" },
  { name: "Twitter", icon: <IconBrandTwitter size={20} />, value: "brand-twitter" },
  { name: "Github", icon: <IconBrandGithub size={20} />, value: "brand-github" },
  { name: "Linkedin", icon: <IconBrandLinkedin size={20} />, value: "brand-linkedin" },
  { name: "Youtube", icon: <IconBrandYoutube size={20} />, value: "brand-youtube" },
  { name: "Facebook", icon: <IconBrandFacebook size={20} />, value: "brand-facebook" },
  { name: "Tiktok", icon: <IconBrandTiktok size={20} />, value: "brand-tiktok" },
  { name: "Whatsapp", icon: <IconBrandWhatsapp size={20} />, value: "brand-whatsapp" },
  { name: "Link", icon: <IconLink size={20} />, value: "link" },
  { name: "Mail", icon: <IconMail size={20} />, value: "mail" },
  { name: "Phone", icon: <IconPhone size={20} />, value: "phone" },
  { name: "User", icon: <IconUser size={20} />, value: "user" },
  { name: "Home", icon: <IconHome size={20} />, value: "home" },
  { name: "Search", icon: <IconSearch size={20} />, value: "search" },
  { name: "Settings", icon: <IconSettings size={20} />, value: "settings" },
  { name: "Heart", icon: <IconHeart size={20} />, value: "heart" },
  { name: "Star", icon: <IconStar size={20} />, value: "star" },
  { name: "Coffee", icon: <IconCoffee size={20} />, value: "coffee" },
  { name: "Music", icon: <IconMusic size={20} />, value: "music" },
  { name: "Camera", icon: <IconCamera size={20} />, value: "camera" },
  { name: "Video", icon: <IconVideo size={20} />, value: "video" },
  { name: "Map", icon: <IconMapPin size={20} />, value: "map-pin" },
  { name: "Calendar", icon: <IconCalendar size={20} />, value: "calendar" },
  { name: "Cart", icon: <IconShoppingCart size={20} />, value: "shopping-cart" },
  { name: "Globe", icon: <IconGlobe size={20} />, value: "globe" },
];

export function getIconByValue(value: string | null) {
  const found = ICONS.find(i => i.value === value);
  return found ? found.icon : <IconLink size={20} />;
}
