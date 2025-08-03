import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import TransactionForm from "./transaction-form";

const AddTransactionDrawer = () => {
  const [open, setOpen] = useState(false);

  const onCloseDrawer = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleButtonClick = () => {
    setOpen(true);
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button 
          className="!cursor-pointer !text-white"
          onClick={handleButtonClick}
        >
          <PlusIcon className="h-4 w-4" />
          Add Transaction
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-md overflow-hidden overflow-y-auto">
        <DrawerHeader className="relative">
         <div>
          <DrawerTitle className="text-xl font-semibold">
              Add Transaction
            </DrawerTitle>
            <DrawerDescription>
              Add a new transaction to track your finances
            </DrawerDescription>
         </div>
          <DrawerClose className="absolute top-4 right-4">
            <XIcon className="h-5 w-5 !cursor-pointer" />
          </DrawerClose>
        </DrawerHeader>
        <TransactionForm 
        onCloseDrawer={onCloseDrawer}
        />
      </DrawerContent>
    </Drawer>
  );
};

export default AddTransactionDrawer;
