import { useState } from "react";

export const useHandleDialogs = () => {
  // const [dialogs, setDialogs] = useState({
  //   delete: { open: false, urlToDelete: null },
  //   edit: { open: false, urlToEdit: null },
  //   qr: { open: false, urlToQRCode: null },
  //   recents: { open: false, selectedUrl: null },
  //   graph: { open: false, selectedUrl: null },
  // })

  const [dialogs, setDialogs] = useState({
    delete: { isOpen: false, data: null },
    edit: { isOpen: false, data: null },
    qrCode: { isOpen: false, data: null },
    recents: { isOpen: false, data: null },
    accessGraph: { isOpen: false, data: null },
  });

  const openDialog = (dialogName, data) => {
    setDialogs((prevDialogs) => ({
      ...prevDialogs,
      [dialogName]: { isOpen: true, data: data },
    }));
  };

  const closeDialog = (dialogName) => {
    setDialogs((prevDialogs) => ({
      ...prevDialogs,
      [dialogName]: { isOpen: false, data: null },
    }));
  };

  return { dialogs, openDialog, closeDialog };
}