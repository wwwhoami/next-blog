import AuthModal from "@/components/AuthModal";
import UserProfileTabgroup from "@/components/user/UserProfileTabgroup";

export default function Edit() {
  return (
    <AuthModal title={"Edit profile"}>
      <UserProfileTabgroup />
    </AuthModal>
  );
}
