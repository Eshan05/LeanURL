import { Accesses, URLDocument } from "@/types/types";
import { useState } from "react";

type DialogState<T> = {
  isOpen: boolean;
  data: T | null;
};

type Dialogs = {
  delete: DialogState<string>; // URL ID
  edit: DialogState<URLDocument>; // URL
  qrCode: DialogState<string>; // Shortened URL)
  recents: DialogState<{ accesses: Accesses }>; //  Accesses
  accessGraph: DialogState<{ accesses: Accesses }>; //  Accesses
};

export const useHandleDialogs = () => {
  const [dialogs, setDialogs] = useState<Dialogs>({
    delete: { isOpen: false, data: null },
    edit: { isOpen: false, data: null },
    qrCode: { isOpen: false, data: null },
    recents: { isOpen: false, data: null },
    accessGraph: { isOpen: false, data: null },
  });

  const openDialog = <T extends keyof Dialogs>(dialogName: T, data: Dialogs[T]['data']) => {
    setDialogs((prevDialogs) => ({
      ...prevDialogs,
      [dialogName]: { isOpen: true, data },
    }));
  };

  const closeDialog = (dialogName: keyof Dialogs) => {
    setDialogs((prevDialogs) => ({
      ...prevDialogs,
      [dialogName]: { isOpen: false, data: null },
    }));
  };

  return { dialogs, openDialog, closeDialog };
}