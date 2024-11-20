export const calculateLogs = (speed: number, constant: number): number => {
    return parseFloat((speed * constant).toFixed(2));
};
  
export const calculateRequiredSpeed = (targetLogs: number, constant: number): number => {
    return parseFloat((targetLogs / constant).toFixed(2));
};