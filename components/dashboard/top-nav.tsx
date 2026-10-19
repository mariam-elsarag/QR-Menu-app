import React, { Dispatch } from "react";
import { LanguageSwitcher } from "../language-switcher";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
type TopNavProps = {
  toggleSidebar: Dispatch<React.SetStateAction<boolean>>;
};
const TopNav = ({ toggleSidebar }: TopNavProps) => {
  return (
    <header className="shadow-sm w-full rounded-lg py-2 md:py-3 px-4 flex items-center justify-end">
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <Button
          aria-label="close menu"
          variant="ghost"
          className="flex md:hidden"
          size="icon-lg"
          onClick={() => toggleSidebar((pre) => !pre)}
        >
          <Menu
            aria-hidden="true"
            className="size-5 text-neutral-700"
            strokeWidth={1.5}
          />
        </Button>
      </div>
    </header>
  );
};

export default TopNav;
