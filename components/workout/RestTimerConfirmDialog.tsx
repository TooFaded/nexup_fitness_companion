"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RestTimerConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (startTimer: boolean) => void;
}

export function RestTimerConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
}: RestTimerConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start Rest Timer?</DialogTitle>
          <DialogDescription>
            Would you like to start a rest timer for this workout? You can choose to start it now or continue without a timer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => {
              onConfirm(false);
              onOpenChange(false);
            }}
          >
            No, Continue Without Timer
          </Button>
          <Button
            onClick={() => {
              onConfirm(true);
              onOpenChange(false);
            }}
            className="bg-brand-ember hover:bg-brand-ember/90"
          >
            Yes, Start Timer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
