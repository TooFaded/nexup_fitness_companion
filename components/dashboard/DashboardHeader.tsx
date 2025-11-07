import Image from "next/image";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  userEmail: string;
  onSignOut: () => void;
}

export default function DashboardHeader({ userEmail, onSignOut }: DashboardHeaderProps) {
  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/nexup_logo.svg"
              alt="Nexup Logo"
              width={80}
              height={80}
              className="dark:hidden"
            />
            <Image
              src="/nexup-white.svg"
              alt="Nexup Logo"
              width={80}
              height={80}
              className="hidden dark:block"
            />
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground hidden sm:block">
              {userEmail}
            </p>
            <form action={onSignOut}>
              <Button variant="outline" size="sm">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
