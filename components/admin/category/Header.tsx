import { Button } from "@dgshahr/ui-kit";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  return (
    <Button
      color="error"
      leftIcon={<Plus />}
      onClick={() => router.push("/admin/categories/new")}
    >
      افزودن دسته‌بندی
    </Button>
  );
};

export default Header;
