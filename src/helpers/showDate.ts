export const showDate = (dateAPI: string) => {
    const timeAPI = new Date(dateAPI).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return timeAPI;
  };
