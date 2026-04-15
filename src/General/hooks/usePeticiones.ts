export const usePeticiones = () => {
  const guardarModulo = async (data: any) => {
    try {
      const response = await fetch("http://localhost:3000/api/pv_estados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  return { guardarModulo };
};
