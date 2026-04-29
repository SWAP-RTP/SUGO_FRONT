const API_URL = import.meta.env.VITE_API_URL;

export const usePeticiones = () => {
  const guardarModulo = async (data: any) => {
    try {
      const response = await fetch(`${API_URL}/pv_estados`, {
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
