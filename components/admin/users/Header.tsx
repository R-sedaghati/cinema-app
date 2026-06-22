import { Button } from "@dgshahr/ui-kit";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";

const Header = () => {
  const queryClient = useQueryClient();
  return (
    <Button
      variant="text"
      size="large"
      onClick={() => {
        queryClient.resetQueries({
          queryKey: ["chequeList"],
        });
      }}
      className="py-0! m-0 px-2! text-2xl"
      rightIcon={<RefreshCw />}
    />
  );
};

export default Header;
