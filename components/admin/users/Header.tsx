import { Button } from "@dgshahr/ui-kit";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";

interface Props {
  /** Query key prefix of the list this header refreshes — matches every params variant. */
  queryKey: string;
}

const Header = ({ queryKey }: Props) => {
  const queryClient = useQueryClient();
  return (
    <Button
      variant="text"
      size="large"
      onClick={() => {
        queryClient.resetQueries({
          queryKey: [queryKey],
        });
      }}
      className="py-0! m-0 px-2! text-2xl"
      rightIcon={<RefreshCw />}
    />
  );
};

export default Header;
