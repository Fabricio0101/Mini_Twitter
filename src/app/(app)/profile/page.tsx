import { ProfilePageHeader } from "@/components/profile/ProfilePageHeader";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileContent } from "@/components/profile/ProfileContent";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 md:px-0 space-y-4 md:space-y-6 py-4 md:py-6">
      <ProfilePageHeader />
      <ProfileHeader />
      <ProfileContent />
    </div>
  );
}
